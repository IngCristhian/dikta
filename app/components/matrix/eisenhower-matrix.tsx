"use client";

import type { Task } from "@/hooks/use-tasks";
import { Quadrant, QUADRANTS } from "./quadrant";
import { MobileAccordion } from "./mobile-accordion";

interface EisenhowerMatrixProps {
  tasks: Task[];
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMoveToQuadrant: (id: string, quadrant: Task["quadrant"]) => void;
  onSendToCalendar: (task: Task) => void;
  isGoogleConnected: boolean;
}

export function EisenhowerMatrix({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onMoveToQuadrant,
  onSendToCalendar,
  isGoogleConnected,
}: EisenhowerMatrixProps) {
  const getTasksForQuadrant = (quadrant: Task["quadrant"]) =>
    tasks.filter((t) => t.quadrant === quadrant);

  return (
    <>
      {/* Desktop: Grid 2x2 */}
      <div className="hidden h-full grid-cols-2 grid-rows-2 gap-px bg-[var(--border-color)] md:grid">
        {QUADRANTS.map((config) => (
          <Quadrant
            key={config.key}
            config={config}
            tasks={getTasksForQuadrant(config.key)}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveToQuadrant={onMoveToQuadrant}
            onSendToCalendar={onSendToCalendar}
            isGoogleConnected={isGoogleConnected}
          />
        ))}
      </div>

      {/* Mobile: Accordion */}
      <div className="flex h-full flex-col md:hidden overflow-y-auto bg-[var(--bg-primary)]">
        {QUADRANTS.map((config) => (
          <MobileAccordion
            key={config.key}
            config={config}
            tasks={getTasksForQuadrant(config.key)}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
            onMoveToQuadrant={onMoveToQuadrant}
            onSendToCalendar={onSendToCalendar}
            isGoogleConnected={isGoogleConnected}
          />
        ))}
      </div>
    </>
  );
}
