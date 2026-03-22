"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, Calendar as CalendarIcon } from "lucide-react";
import type { Task } from "@/hooks/use-tasks";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description?: string;
    deadline?: string;
  }) => Promise<void>;
  onUpdate?: (
    id: string,
    data: Partial<Pick<Task, "title" | "description" | "deadline">>,
  ) => Promise<void>;
  editingTask?: Task | null;
  loading: boolean;
}

export function TaskForm({
  open,
  onClose,
  onSubmit,
  onUpdate,
  editingTask,
  loading,
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  const isEditing = !!editingTask;

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setDeadline(
        editingTask.deadline
          ? new Date(editingTask.deadline).toISOString().split("T")[0]
          : "",
      );
    } else {
      setTitle("");
      setDescription("");
      setDeadline("");
    }
  }, [editingTask, open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const data = {
      title: title.trim(),
      description: description.trim() || undefined,
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
    };

    if (isEditing && onUpdate) {
      await onUpdate(editingTask.id, data);
    } else {
      await onSubmit(data);
    }
    onClose();
  };

  return (
    <>
      {/* Desktop: Dialog overlay */}
      <div className="fixed inset-0 z-50 hidden md:block">
        <div
          className="absolute inset-0 bg-black/40"
          onClick={loading ? undefined : onClose}
        />
        <div className="flex h-full items-center justify-center">
          <div className="relative z-10 w-[480px] rounded-xl bg-white p-8 shadow-xl">
            <h2 className="text-xl font-semibold font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)]">
              {isEditing ? "Editar tarea" : "Nueva tarea"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-primary)]">
                  Título de la tarea
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Escribe el título..."
                  className="rounded-md border border-[var(--border-color)] px-3 py-2.5 text-sm outline-none focus:border-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-primary)]">
                  Descripción (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Agrega una descripción..."
                  rows={3}
                  className="resize-none rounded-md border border-[var(--border-color)] px-3 py-2.5 text-sm outline-none focus:border-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  disabled={loading}
                />
              </div>

              {/* Deadline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-primary)]">
                  Fecha límite (opcional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-md border border-[var(--border-color)] px-3 py-2.5 text-sm outline-none focus:border-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-md border border-[var(--border-color)] px-5 py-2.5 text-sm hover:bg-[var(--bg-secondary)]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="flex items-center gap-2 rounded-md bg-[var(--btn-primary-bg)] px-5 py-2.5 text-sm font-medium text-[var(--btn-primary-text)] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Clasificando...
                    </>
                  ) : isEditing ? (
                    "Guardar cambios"
                  ) : (
                    "Crear tarea"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile: Bottom sheet */}
      <div className="fixed inset-0 z-50 flex flex-col md:hidden">
        <div
          className="flex-shrink-0 h-12"
          onClick={loading ? undefined : onClose}
        />
        <div className="flex flex-1 flex-col rounded-t-2xl bg-white shadow-xl">
          {/* Mobile header */}
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="text-sm text-[var(--text-secondary)]"
            >
              Cancelar
            </button>
            <h2 className="text-base font-semibold font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)]">
              {isEditing ? "Editar tarea" : "Nueva tarea"}
            </h2>
            <div className="w-14" />
          </div>

          {/* Mobile form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <div className="flex flex-1 flex-col gap-5 p-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-primary)]">
                  Título de la tarea
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Preparar presentación trimestral"
                  className="rounded-md border border-[var(--border-color)] px-3 py-2.5 text-sm outline-none focus:border-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-primary)]">
                  Descripción (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Añade detalles sobre la tarea..."
                  rows={4}
                  className="resize-none rounded-md border border-[var(--border-color)] px-3 py-2.5 text-sm outline-none focus:border-[var(--text-primary)] placeholder:text-[var(--text-secondary)]"
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-primary)]">
                  Fecha límite (opcional)
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-md border border-[var(--border-color)] px-3 py-2.5 text-sm outline-none focus:border-[var(--text-primary)]"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* AI hint */}
              {!isEditing && (
                <div className="flex items-start gap-2 rounded-lg bg-[var(--bg-secondary)] p-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--text-secondary)]" />
                  <span className="text-xs text-[var(--text-secondary)]">
                    La IA clasificará automáticamente tu tarea en el cuadrante
                    correcto
                  </span>
                </div>
              )}
            </div>

            {/* Mobile bottom buttons */}
            <div className="border-t border-[var(--border-color)] p-4">
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--btn-primary-bg)] py-3.5 text-sm font-medium text-[var(--btn-primary-text)] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Clasificando...
                  </>
                ) : isEditing ? (
                  "Guardar cambios"
                ) : (
                  "Crear tarea"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="mt-2 w-full py-2 text-center text-sm text-[var(--q2-color)]"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
