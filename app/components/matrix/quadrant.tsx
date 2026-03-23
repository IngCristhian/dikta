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
  glow: string;
  border: string;
}

export const QUADRANTS: QuadrantConfig[] = [
  {
    key: "DO",
    label: "Hacer",
    description: "Urgente + Importante",
    icon: TriangleAlert,
    color: "var(--q1-color)",
    bg: "var(--q1-bg)",
    glow: "var(--q1-glow)",
    border: "var(--q1-border)",
  },
  {
    key: "PLAN",
    label: "Planificar",
    description: "Importante, no urgente",
    icon: Calendar,
    color: "var(--q2-color)",
    bg: "var(--q2-bg)",
    glow: "var(--q2-glow)",
    border: "var(--q2-border)",
  },
  {
    key: "DELEGATE",
    label: "Delegar",
    description: "Urgente, no importante",
    icon: Users,
    color: "var(--q3-color)",
    bg: "var(--q3-bg)",
    glow: "var(--q3-glow)",
    border: "var(--q3-border)",
  },
  {
    key: "ELIMINATE",
    label: "Eliminar",
    description: "Ni urgente ni importante",
    icon: Trash2,
    color: "var(--q4-color)",
    bg: "var(--q4-bg)",
    glow: "var(--q4-glow)",
    border: "var(--q4-border)",
  },
];

interface QuadrantProps {
  config: QuadrantConfig;
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveToQuadrant: (id: string, quadrant: Task["quadrant"]) => void;
  onSendToCalendar: (task: Task) => void;
  isGoogleConnected: boolean;
}

export function Quadrant({
  config,
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveToQuadrant,
  onSendToCalendar,
  isGoogleConnected,
}: QuadrantProps) {
  const Icon = config.icon;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div
      className="flex h-full flex-col"
      style={{ backgroundColor: config.bg }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-4 py-2.5"
        style={{
          borderBottom: `1px solid ${config.border}`,
        }}
      >
        <div
          className="flex h-6 w-6 items-center justify-center rounded-md"
          style={{ backgroundColor: config.glow }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: config.color }} />
        </div>
        <span
          className="text-sm font-semibold font-[family-name:var(--font-space-grotesk)] tracking-tight"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        <span className="text-[11px] text-[var(--text-secondary)] tracking-wide uppercase">
          {config.description}
        </span>
        <span
          className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-bold tabular-nums"
          style={{
            backgroundColor: config.glow,
            color: config.color,
          }}
        >
          {pendingCount}
        </span>
      </div>

      {/* Task list */}
      <div className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-2">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8">
            <span className="text-sm text-[var(--text-muted)]">
              Sin tareas
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              quadrantColor={config.color}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveToQuadrant={onMoveToQuadrant}
              onSendToCalendar={onSendToCalendar}
              isGoogleConnected={isGoogleConnected}
            />
          ))
        )}
      </div>
    </div>
  );
}
