import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function error(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    return error(err.errors.map((e) => e.message).join(", "), 400);
  }
  if (err instanceof Error) {
    if (err.message.includes("no encontrad")) return error(err.message, 404);
    return error(err.message, 500);
  }
  return error("Error interno del servidor", 500);
}
