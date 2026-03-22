import { prisma } from "@/lib/prisma";
import type { Quadrant, Prisma } from "@prisma/client";

export const tasksRepository = {
  findAll(filters?: { completed?: boolean; quadrant?: Quadrant }) {
    const where: Prisma.TaskWhereInput = {};

    if (filters?.completed !== undefined) {
      where.completed = filters.completed;
    }
    if (filters?.quadrant) {
      where.quadrant = filters.quadrant;
    }

    return prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.task.findUnique({ where: { id } });
  },

  create(data: {
    title: string;
    description?: string;
    deadline?: Date;
    quadrant: Quadrant;
    aiConfidence: number;
    aiReasoning?: string;
  }) {
    return prisma.task.create({ data });
  },

  update(
    id: string,
    data: Prisma.TaskUpdateInput,
  ) {
    return prisma.task.update({ where: { id }, data });
  },

  delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },
};
