"use client";

import { useState, useEffect } from "react";
import { Loader2, Sparkles, X } from "lucide-react";
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

  const inputClasses =
    "w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] transition-all focus:border-[var(--q2-color)]/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]";

  return (
    <>
      {/* Desktop: Dialog overlay */}
      <div className="fixed inset-0 z-50 hidden md:block">
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={loading ? undefined : onClose}
        />
        <div className="flex h-full items-center justify-center">
          <div className="relative z-10 w-[480px] rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)] tracking-tight">
              {isEditing ? "Editar tarea" : "Nueva tarea"}
            </h2>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Escribe el título..."
                  className={inputClasses}
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                  Descripción
                  <span className="ml-1 text-[var(--text-muted)] normal-case tracking-normal">(opcional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Agrega una descripción..."
                  rows={3}
                  className={`${inputClasses} resize-none`}
                  disabled={loading}
                />
              </div>

              {/* Deadline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                  Fecha límite
                  <span className="ml-1 text-[var(--text-muted)] normal-case tracking-normal">(opcional)</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={inputClasses}
                  disabled={loading}
                />
              </div>

              {/* AI hint */}
              {!isEditing && (
                <div className="flex items-center gap-2 rounded-lg border border-[var(--q2-border)] bg-[var(--q2-bg)] p-3">
                  <Sparkles className="h-4 w-4 shrink-0 text-[var(--q2-color)]" />
                  <span className="text-xs text-[var(--q2-color)]">
                    La IA clasificará automáticamente tu tarea
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-lg border border-[var(--border-color)] px-5 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] hover:text-[var(--text-primary)] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="flex items-center gap-2 rounded-lg bg-[var(--btn-primary-bg)] px-5 py-2.5 text-sm font-medium text-[var(--btn-primary-text)] disabled:opacity-40 transition-all hover:shadow-[0_0_20px_var(--btn-primary-shadow)] active:scale-[0.97]"
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
          className="flex-shrink-0 h-12 bg-black/60 backdrop-blur-sm"
          onClick={loading ? undefined : onClose}
        />
        <div className="flex flex-1 flex-col rounded-t-2xl border-t border-[var(--glass-border)] bg-[var(--bg-secondary)] shadow-[0_-8px_40px_rgba(0,0,0,0.5)]">
          {/* Mobile header */}
          <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="text-sm text-[var(--text-secondary)]"
            >
              Cancelar
            </button>
            <h2 className="text-base font-semibold font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)] tracking-tight">
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
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                  Título
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Preparar presentación trimestral"
                  className={inputClasses}
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                  Descripción
                  <span className="ml-1 text-[var(--text-muted)] normal-case tracking-normal">(opcional)</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Añade detalles sobre la tarea..."
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
                  Fecha límite
                  <span className="ml-1 text-[var(--text-muted)] normal-case tracking-normal">(opcional)</span>
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={inputClasses}
                  disabled={loading}
                />
              </div>

              {/* AI hint */}
              {!isEditing && (
                <div className="flex items-center gap-2 rounded-lg border border-[var(--q2-border)] bg-[var(--q2-bg)] p-3">
                  <Sparkles className="h-4 w-4 shrink-0 text-[var(--q2-color)]" />
                  <span className="text-xs text-[var(--q2-color)]">
                    La IA clasificará automáticamente tu tarea
                  </span>
                </div>
              )}
            </div>

            {/* Mobile bottom buttons */}
            <div className="border-t border-[var(--border-color)] p-4">
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--btn-primary-bg)] py-3.5 text-sm font-medium text-[var(--btn-primary-text)] disabled:opacity-40 transition-all active:scale-[0.97]"
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
                className="mt-2 w-full py-2 text-center text-sm text-[var(--text-secondary)]"
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
