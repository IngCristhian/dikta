import { tasksService } from "@/modules/tasks/tasks.service";
import { success, handleError } from "@/lib/api-response";
import type { NextRequest } from "next/server";
import type { Quadrant } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const completedParam = searchParams.get("completed");
    const quadrantParam = searchParams.get("quadrant");

    const filters: { completed?: boolean; quadrant?: Quadrant } = {};

    if (completedParam !== null) {
      filters.completed = completedParam === "true";
    }
    if (
      quadrantParam &&
      ["DO", "PLAN", "DELEGATE", "ELIMINATE"].includes(quadrantParam)
    ) {
      filters.quadrant = quadrantParam as Quadrant;
    }

    const tasks = await tasksService.list(filters);
    return success(tasks);
  } catch (err) {
    return handleError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = await tasksService.create(body);
    return success(task, 201);
  } catch (err) {
    return handleError(err);
  }
}
