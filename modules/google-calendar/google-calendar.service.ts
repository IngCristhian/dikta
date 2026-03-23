import { oauth2Client, calendar, SCOPES } from "@/lib/google-auth";
import { googleTokenRepository } from "./google-calendar.repository";
import { tasksRepository } from "../tasks/tasks.repository";
import type { Quadrant } from "@prisma/client";

const QUADRANT_LABELS: Record<Quadrant, string> = {
  DO: "Hacer (Urgente + Importante)",
  PLAN: "Planificar (Importante)",
  DELEGATE: "Delegar (Urgente)",
  ELIMINATE: "Eliminar",
};

const QUADRANT_COLORS: Record<Quadrant, string> = {
  DO: "11",        // Tomato
  PLAN: "9",       // Blueberry
  DELEGATE: "5",   // Banana
  ELIMINATE: "8",   // Graphite
};

export const googleCalendarService = {
  getAuthUrl() {
    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
      prompt: "consent",
    });
  },

  async handleCallback(code: string) {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      throw new Error("No se recibieron tokens de Google");
    }

    await googleTokenRepository.upsertToken({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: new Date(tokens.expiry_date || Date.now() + 3600 * 1000),
      scope: tokens.scope || SCOPES.join(" "),
    });

    oauth2Client.setCredentials(tokens);
  },

  async isConnected(): Promise<boolean> {
    const token = await googleTokenRepository.getToken();
    if (!token) return false;

    // If expired, try to refresh
    if (token.expiresAt < new Date()) {
      try {
        oauth2Client.setCredentials({ refresh_token: token.refreshToken });
        const { credentials } = await oauth2Client.refreshAccessToken();

        await googleTokenRepository.upsertToken({
          accessToken: credentials.access_token!,
          refreshToken: credentials.refresh_token || token.refreshToken,
          expiresAt: new Date(credentials.expiry_date || Date.now() + 3600 * 1000),
          scope: token.scope,
        });

        return true;
      } catch {
        return false;
      }
    }

    return true;
  },

  async disconnect() {
    const token = await googleTokenRepository.getToken();
    if (token) {
      try {
        await oauth2Client.revokeToken(token.accessToken);
      } catch {
        // Ignore revocation errors
      }
    }
    await googleTokenRepository.deleteToken();
  },

  async createEventFromTask(taskId: string, dateTime?: string) {
    const task = await tasksRepository.findById(taskId);
    if (!task) throw new Error("Tarea no encontrada");
    if (task.calendarEventId) throw new Error("Esta tarea ya está en Google Calendar");

    const token = await googleTokenRepository.getToken();
    if (!token) throw new Error("Google Calendar no conectado");

    // Refresh if expired
    if (token.expiresAt < new Date()) {
      oauth2Client.setCredentials({ refresh_token: token.refreshToken });
      const { credentials } = await oauth2Client.refreshAccessToken();

      await googleTokenRepository.upsertToken({
        accessToken: credentials.access_token!,
        refreshToken: credentials.refresh_token || token.refreshToken,
        expiresAt: new Date(credentials.expiry_date || Date.now() + 3600 * 1000),
        scope: token.scope,
      });

      oauth2Client.setCredentials(credentials);
    } else {
      oauth2Client.setCredentials({
        access_token: token.accessToken,
        refresh_token: token.refreshToken,
      });
    }

    // Build event description
    const descParts: string[] = [];
    if (task.description) descParts.push(task.description);
    descParts.push(`\n📋 Cuadrante: ${QUADRANT_LABELS[task.quadrant]}`);
    if (task.aiReasoning) descParts.push(`🤖 IA: ${task.aiReasoning}`);

    // Build start/end
    let start: { date?: string; dateTime?: string; timeZone?: string };
    let end: { date?: string; dateTime?: string; timeZone?: string };

    if (task.deadline) {
      // All-day event on the deadline date
      const deadlineDate = new Date(task.deadline).toISOString().split("T")[0];
      const nextDay = new Date(task.deadline);
      nextDay.setDate(nextDay.getDate() + 1);
      const nextDayStr = nextDay.toISOString().split("T")[0];

      start = { date: deadlineDate };
      end = { date: nextDayStr };
    } else if (dateTime) {
      // Use the user-provided dateTime
      const startDate = new Date(dateTime);
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour default

      start = { dateTime: startDate.toISOString() };
      end = { dateTime: endDate.toISOString() };
    } else {
      // Fallback: 1-hour event starting now
      const now = new Date();
      const later = new Date(now.getTime() + 60 * 60 * 1000);

      start = { dateTime: now.toISOString() };
      end = { dateTime: later.toISOString() };
    }

    const event = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary: task.title,
        description: descParts.join("\n"),
        colorId: QUADRANT_COLORS[task.quadrant],
        start,
        end,
      },
    });

    // Save the calendar event ID on the task
    return tasksRepository.update(taskId, {
      calendarEventId: event.data.id,
    });
  },
};
