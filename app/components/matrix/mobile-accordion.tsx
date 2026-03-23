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
  onSendToCalendar: (task: Task) => void;
  isGoogleConnected: boolean;
}

export function MobileAccordion({
  config,
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveToQuadrant,
  onSendToCalendar,
  isGoogleConnected,
}: MobileAccordionProps) {
  const [open, setOpen] = useState(tasks.length > 0);
  const Icon = config.icon;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="flex flex-col border-b border-[var(--border-color)]">
      {/* Accordion header */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-4 py-3 transition-colors"
        style={{ backgroundColor: config.bg }}
      >
        {open ? (
          <ChevronDown className="h-4 w-4 transition-transform" style={{ color: config.color }} />
        ) : (
          <ChevronRight className="h-4 w-4 transition-transform" style={{ color: config.color }} />
        )}
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
        <div className="flex-1" />
        <span
          className="flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[11px] font-bold tabular-nums"
          style={{
            backgroundColor: config.glow,
            color: config.color,
          }}
        >
          {pendingCount}
        </span>
      </button>

      {/* Tasks */}
      {open && (
        <div className="flex flex-col gap-1.5 px-3 py-2 bg-[var(--bg-primary)]">
          {tasks.length === 0 ? (
            <div className="py-4 text-center text-sm text-[var(--text-muted)]">
              Sin tareas
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                compact
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
      )}
    </div>
  );
}
