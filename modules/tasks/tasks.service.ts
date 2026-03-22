import { tasksRepository } from "./tasks.repository";
import { createTaskSchema, updateTaskSchema } from "./tasks.schemas";
import type { CreateTaskInput, UpdateTaskInput } from "./tasks.schemas";
import { classifyTask } from "@/lib/classify";
import type { Quadrant } from "@prisma/client";

export const tasksService = {
  async list(filters?: { completed?: boolean; quadrant?: Quadrant }) {
    return tasksRepository.findAll(filters);
  },

  async getById(id: string) {
    const task = await tasksRepository.findById(id);
    if (!task) throw new Error("Tarea no encontrada");
    return task;
  },

  async create(data: CreateTaskInput) {
    const validated = createTaskSchema.parse(data);

    const classification = await classifyTask(
      validated.title,
      validated.description,
      validated.deadline,
    );

    return tasksRepository.create({
      title: validated.title,
      description: validated.description,
      deadline: validated.deadline ? new Date(validated.deadline) : undefined,
      quadrant: classification.quadrant,
      aiConfidence: classification.confidence,
      aiReasoning: classification.reasoning,
    });
  },

  async update(id: string, data: UpdateTaskInput) {
    await this.getById(id);
    const validated = updateTaskSchema.parse(data);

    const updateData: Record<string, unknown> = {};

    if (validated.title !== undefined) updateData.title = validated.title;
    if (validated.description !== undefined)
      updateData.description = validated.description;
    if (validated.deadline !== undefined)
      updateData.deadline = validated.deadline
        ? new Date(validated.deadline)
        : null;
    if (validated.quadrant !== undefined)
      updateData.quadrant = validated.quadrant;
    if (validated.completed !== undefined) {
      updateData.completed = validated.completed;
      updateData.completedAt = validated.completed ? new Date() : null;
    }

    return tasksRepository.update(id, updateData);
  },

  async delete(id: string) {
    await this.getById(id);
    return tasksRepository.delete(id);
  },
};
