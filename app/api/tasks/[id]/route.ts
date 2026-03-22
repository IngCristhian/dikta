import { tasksService } from "@/modules/tasks/tasks.service";
import { success, handleError } from "@/lib/api-response";
import type { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const task = await tasksService.update(id, body);
    return success(task);
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await tasksService.delete(id);
    return success({ deleted: true });
  } catch (err) {
    return handleError(err);
  }
}
