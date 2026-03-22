"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useTasks, type Task } from "@/hooks/use-tasks";
import { EisenhowerMatrix } from "./components/matrix/eisenhower-matrix";
import { TaskForm } from "./components/task-form";

export default function Home() {
  const { tasks, loading, creating, createTask, updateTask, deleteTask } =
    useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreate = async (data: {
    title: string;
    description?: string;
    deadline?: string;
  }) => {
    await createTask(data);
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Pick<Task, "title" | "description" | "deadline">>,
  ) => {
    await updateTask(id, data);
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await updateTask(id, { completed });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
  };

  const handleMoveToQuadrant = async (
    id: string,
    quadrant: Task["quadrant"],
  ) => {
    await updateTask(id, { quadrant });
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--border-color)] border-t-[var(--text-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-3 md:px-6">
        <h1 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)]">
          <span className="hidden md:inline">Eisenhower Tasks</span>
          <span className="md:hidden">Eisenhower</span>
        </h1>
        <button
          onClick={() => {
            setEditingTask(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-1 rounded-md bg-[var(--btn-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--btn-primary-text)] md:gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden md:inline">Nueva tarea</span>
          <span className="md:hidden">Nueva</span>
        </button>
      </header>

      {/* Matrix */}
      <main className="flex-1 overflow-hidden">
        <EisenhowerMatrix
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMoveToQuadrant={handleMoveToQuadrant}
        />
      </main>

      {/* Task Form (Create/Edit) */}
      <TaskForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        editingTask={editingTask}
        loading={creating}
      />
    </div>
  );
}
