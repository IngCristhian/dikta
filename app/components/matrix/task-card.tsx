"use client";

import { useState } from "react";
import { MoreHorizontal, Check, Sparkles, CalendarPlus, CalendarCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/hooks/use-tasks";

interface TaskCardProps {
  task: Task;
  quadrantColor?: string;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveToQuadrant: (id: string, quadrant: Task["quadrant"]) => void;
  onSendToCalendar: (task: Task) => void;
  isGoogleConnected: boolean;
  compact?: boolean;
}

const QUADRANT_LABELS: Record<Task["quadrant"], string> = {
  DO: "Hacer",
  PLAN: "Planificar",
  DELEGATE: "Delegar",
  ELIMINATE: "Eliminar",
};

export function TaskCard({
  task,
  quadrantColor,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveToQuadrant,
  onSendToCalendar,
  isGoogleConnected,
  compact,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [calendarLoading, setCalendarLoading] = useState(false);

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return `Vence: ${date.toLocaleDateString("es", { day: "numeric", month: "short" })}`;
  };

  const confidenceText = `${Math.round(task.aiConfidence * 100)}%`;

  const isInCalendar = !!task.calendarEventId;

  const handleCalendarClick = async () => {
    if (!isGoogleConnected || isInCalendar || calendarLoading) return;
    setCalendarLoading(true);
    try {
      onSendToCalendar(task);
    } finally {
      setCalendarLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-lg border border-[var(--border-color)] p-3 transition-all duration-200",
        "bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-glow)]",
        compact ? "gap-2 p-2" : "p-3 gap-3",
        task.completed && "opacity-[var(--completed-opacity)]",
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggleComplete(task.id, !task.completed)}
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded transition-all",
          task.completed
            ? "border-[1.5px]"
            : "border-[1.5px] border-[var(--text-muted)] hover:border-[var(--text-secondary)]",
        )}
        style={task.completed ? {
          backgroundColor: quadrantColor || 'var(--text-secondary)',
          borderColor: quadrantColor || 'var(--text-secondary)',
        } : undefined}
      >
        {task.completed && <Check className="h-3.5 w-3.5 text-white" />}
      </button>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span
          className={cn(
            "text-sm font-medium text-[var(--text-primary)] truncate",
            task.completed && "line-through",
          )}
        >
          {task.title}
        </span>
        <div className="flex items-center gap-2">
          {task.deadline && (
            <span className="text-xs text-[var(--text-secondary)]">
              {formatDeadline(task.deadline)}
            </span>
          )}
          {task.aiConfidence > 0 && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--badge-bg)] px-1.5 py-0.5 text-[11px] text-[var(--text-secondary)]">
              <Sparkles className="h-2.5 w-2.5" />
              {confidenceText}
            </span>
          )}
          {isInCalendar && (
            <span className="flex items-center gap-1 rounded-md bg-[var(--q2-glow)] px-1.5 py-0.5 text-[11px] text-[var(--q2-color)]">
              <CalendarCheck className="h-2.5 w-2.5" />
              Calendar
            </span>
          )}
        </div>
      </div>

      {/* Calendar button */}
      <button
        onClick={handleCalendarClick}
        disabled={!isGoogleConnected || isInCalendar || calendarLoading}
        className={cn(
          "opacity-0 group-hover:opacity-100 transition-opacity",
          isInCalendar
            ? "text-[var(--q2-color)] opacity-60 group-hover:opacity-60 cursor-default"
            : isGoogleConnected
              ? "text-[var(--text-muted)] hover:text-[var(--q2-color)]"
              : "text-[var(--text-muted)] opacity-30 cursor-not-allowed",
        )}
        title={
          isInCalendar
            ? "Ya en Calendar"
            : isGoogleConnected
              ? "Enviar a Calendar"
              : "Conecta Google Calendar"
        }
      >
        {calendarLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isInCalendar ? (
          <CalendarCheck className="h-4 w-4" />
        ) : (
          <CalendarPlus className="h-4 w-4" />
        )}
      </button>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-6 z-50 min-w-[180px] rounded-lg border border-[var(--glass-border)] bg-[var(--bg-secondary)] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
              <button
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
              >
                Editar
              </button>

              {/* Calendar menu item */}
              <button
                className={cn(
                  "w-full px-3 py-2 text-left text-sm flex items-center gap-2",
                  isInCalendar
                    ? "text-[var(--text-muted)] cursor-default"
                    : isGoogleConnected
                      ? "text-[var(--q2-color)] hover:bg-[var(--bg-card-hover)]"
                      : "text-[var(--text-muted)] cursor-not-allowed",
                )}
                disabled={!isGoogleConnected || isInCalendar}
                onClick={() => {
                  if (!isGoogleConnected || isInCalendar) return;
                  onSendToCalendar(task);
                  setMenuOpen(false);
                }}
              >
                {isInCalendar ? (
                  <>
                    <CalendarCheck className="h-3.5 w-3.5" />
                    Ya en Calendar
                  </>
                ) : (
                  <>
                    <CalendarPlus className="h-3.5 w-3.5" />
                    Enviar a Calendar
                  </>
                )}
              </button>

              <hr className="my-1 border-[var(--border-color)]" />

              {(["DO", "PLAN", "DELEGATE", "ELIMINATE"] as const)
                .filter((q) => q !== task.quadrant)
                .map((q) => (
                  <button
                    key={q}
                    className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
                    onClick={() => {
                      onMoveToQuadrant(task.id, q);
                      setMenuOpen(false);
                    }}
                  >
                    Mover a {QUADRANT_LABELS[q]}
                  </button>
                ))}
              <hr className="my-1 border-[var(--border-color)]" />
              <button
                className="w-full px-3 py-2 text-left text-sm text-[var(--q1-color)] hover:bg-[var(--bg-card-hover)]"
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
              >
                Eliminar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
