"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { Task } from "@/hooks/use-tasks";
import type { QuadrantConfig } from "./quadrant";
import { TaskCard } from "./task-card";

interface MobileAccordionProps {
  config: QuadrantConfig;
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveToQuadrant: (id: string, quadrant: Task["quadrant"]) => void;
}

export function MobileAccordion({
  config,
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveToQuadrant,
}: MobileAccordionProps) {
  const [open, setOpen] = useState(tasks.length > 0);
  const Icon = config.icon;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-col">
      {/* Accordion header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-3"
        style={{ backgroundColor: config.bg }}
      >
        {open ? (
          <ChevronDown className="h-4 w-4" style={{ color: config.color }} />
        ) : (
          <ChevronRight className="h-4 w-4" style={{ color: config.color }} />
        )}
        <Icon className="h-4 w-4" style={{ color: config.color }} />
        <span
          className="text-sm font-semibold"
          style={{ color: config.color }}
        >
          {config.label}
        </span>
        <span className="text-xs text-[var(--text-secondary)]">
          {config.description}
        </span>
        <div className="flex-1" />
        <span
          className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold text-white"
          style={{ backgroundColor: config.color }}
        >
          {pendingCount}
        </span>
      </button>

      {/* Tasks */}
      {open && (
        <div className="flex flex-col gap-1.5 px-3 py-2">
          {tasks.length === 0 ? (
            <div className="py-4 text-center text-sm text-[var(--text-secondary)]">
              Sin tareas
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                compact
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                onMoveToQuadrant={onMoveToQuadrant}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
