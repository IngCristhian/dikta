"use client";

import {
  TriangleAlert,
  Calendar,
  Users,
  Trash2,
} from "lucide-react";
import type { Task } from "@/hooks/use-tasks";
import { TaskCard } from "./task-card";

export interface QuadrantConfig {
  key: Task["quadrant"];
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

export const QUADRANTS: QuadrantConfig[] = [
  {
    key: "DO",
    label: "Hacer",
    description: "Urgente + Importante",
    icon: TriangleAlert,
    color: "var(--q1-color)",
    bg: "var(--q1-bg)",
  },
  {
    key: "PLAN",
    label: "Planificar",
    description: "Importante, no urgente",
    icon: Calendar,
    color: "var(--q2-color)",
    bg: "var(--q2-bg)",
  },
  {
    key: "DELEGATE",
    label: "Delegar",
    description: "Urgente, no importante",
    icon: Users,
    color: "var(--q3-color)",
    bg: "var(--q3-bg)",
  },
  {
    key: "ELIMINATE",
    label: "Eliminar",
    description: "Ni urgente ni importante",
    icon: Trash2,
    color: "var(--q4-color)",
    bg: "var(--q4-bg)",
  },
];

interface QuadrantProps {
  config: QuadrantConfig;
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveToQuadrant: (id: string, quadrant: Task["quadrant"]) => void;
}

export function Quadrant({
  config,
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveToQuadrant,
}: QuadrantProps) {
  const Icon = config.icon;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5"
        style={{
          backgroundColor: config.bg,
          borderLeft: `4px solid ${config.color}`,
        }}
      >
        <Icon className="h-4 w-4" style={{ color: config.color }} />
        <span
          className="text-sm font-semibold font-[family-name:var(--font-space-grotesk)]"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        <span
          className="text-xs text-[var(--text-secondary)]"
        >
          {config.description}
        </span>
        <span
          className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white"
          style={{ backgroundColor: config.color }}
        >
          {pendingCount}
        </span>
      </div>

      {/* Task list */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <span className="text-sm text-[var(--text-secondary)]">
              Sin tareas
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveToQuadrant={onMoveToQuadrant}
            />
          ))
        )}
      </div>
    </div>
  );
}
