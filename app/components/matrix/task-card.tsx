"use client";

import { useState } from "react";
import { MoreHorizontal, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "@/hooks/use-tasks";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveToQuadrant: (id: string, quadrant: Task["quadrant"]) => void;
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
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveToQuadrant,
  compact,
}: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return `Vence: ${date.toLocaleDateString("es", { day: "numeric", month: "short" })}`;
  };

  const confidenceText = `IA ${Math.round(task.aiConfidence * 100)}%`;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-[var(--border-color)] bg-white p-3",
        compact ? "gap-2 p-2" : "p-3 gap-3",
        task.completed && "opacity-[var(--completed-opacity)]",
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggleComplete(task.id, !task.completed)}
        className={cn(
          "flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded",
          task.completed
            ? "bg-[var(--text-primary)] border-[1.5px] border-[var(--text-primary)]"
            : "border-[1.5px] border-[var(--border-color)]",
        )}
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
            <span className="rounded bg-[var(--badge-bg)] px-1.5 py-0.5 text-[11px] text-[var(--text-secondary)]">
              {confidenceText}
            </span>
          )}
        </div>
      </div>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-6 z-50 min-w-[160px] rounded-lg border border-[var(--border-color)] bg-white py-1 shadow-lg">
              <button
                className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--bg-secondary)]"
                onClick={() => {
                  onEdit(task);
                  setMenuOpen(false);
                }}
              >
                Editar
              </button>
              {(["DO", "PLAN", "DELEGATE", "ELIMINATE"] as const)
                .filter((q) => q !== task.quadrant)
                .map((q) => (
                  <button
                    key={q}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[var(--bg-secondary)]"
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
                className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-[var(--bg-secondary)]"
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
