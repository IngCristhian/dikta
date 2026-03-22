import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  deadline: z.string().datetime().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "El título es requerido").optional(),
  description: z.string().nullable().optional(),
  deadline: z.string().datetime().nullable().optional(),
  quadrant: z.enum(["DO", "PLAN", "DELEGATE", "ELIMINATE"]).optional(),
  completed: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
