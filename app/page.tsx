"use client";

import { useState, useEffect } from "react";
import { Plus, Zap, Calendar, LogOut } from "lucide-react";
import { useTasks, type Task } from "@/hooks/use-tasks";
import { EisenhowerMatrix } from "./components/matrix/eisenhower-matrix";
import { TaskForm } from "./components/task-form";
import { CalendarTimePicker } from "./components/calendar-time-picker";
import { ThemeToggle } from "./components/theme-toggle";

export default function Home() {
  const {
    tasks,
    loading,
    creating,
    isGoogleConnected,
    createTask,
    updateTask,
    deleteTask,
    sendToCalendar,
    disconnectGoogle,
    checkGoogleStatus,
  } = useTasks();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [calendarPickerTask, setCalendarPickerTask] = useState<Task | null>(null);
  const [googleMenuOpen, setGoogleMenuOpen] = useState(false);

  // Check for google=connected query param after OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") {
      checkGoogleStatus();
      window.history.replaceState({}, "", "/");
    }
  }, [checkGoogleStatus]);

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

  const handleSendToCalendar = (task: Task) => {
    if (task.deadline) {
      // Has deadline → send directly
      sendToCalendar(task.id);
    } else {
      // No deadline → open time picker
      setCalendarPickerTask(task);
    }
  };

  const handleCalendarConfirm = async (dateTime: string) => {
    if (!calendarPickerTask) return;
    await sendToCalendar(calendarPickerTask.id, dateTime);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTask(null);
  };

  const handleGoogleConnect = () => {
    window.location.href = "/api/auth/google";
  };

  const handleGoogleDisconnect = async () => {
    await disconnectGoogle();
    setGoogleMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)] bg-grid">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border-color)] border-t-[var(--q2-color)]" />
          <span className="text-xs text-[var(--text-secondary)] tracking-widest uppercase">Cargando</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--bg-primary)] bg-grid">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-3 bg-[var(--bg-secondary)]/60 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--q2-color)] to-[var(--q1-color)]">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <h1 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)] tracking-tight">
            <span className="hidden md:inline">Dikta</span>
            <span className="md:hidden">Dikta</span>
          </h1>
          <span className="hidden md:inline-block text-[11px] text-[var(--text-muted)] tracking-widest uppercase ml-1">Eisenhower Matrix</span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Google Calendar indicator */}
          <div className="relative">
            {isGoogleConnected ? (
              <>
                <button
                  onClick={() => setGoogleMenuOpen(!googleMenuOpen)}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--q2-border)] bg-[var(--q2-glow)] px-3 py-1.5 text-xs font-medium text-[var(--q2-color)] transition-all hover:bg-[var(--q2-glow)]"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Calendar</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                </button>

                {googleMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setGoogleMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-10 z-50 min-w-[160px] rounded-lg border border-[var(--glass-border)] bg-[var(--bg-secondary)] py-1 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                      <button
                        className="w-full px-3 py-2 text-left text-sm text-[var(--q1-color)] hover:bg-[var(--bg-card-hover)] flex items-center gap-2"
                        onClick={handleGoogleDisconnect}
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Desconectar
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={handleGoogleConnect}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--text-muted)] transition-all hover:border-[var(--q2-border)] hover:text-[var(--q2-color)]"
              >
                <Calendar className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Calendar</span>
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setFormOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-[var(--btn-primary-bg)] px-4 py-2 text-sm font-medium text-[var(--btn-primary-text)] transition-all hover:shadow-[0_0_20px_var(--btn-primary-shadow)] active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Nueva tarea</span>
            <span className="md:hidden">Nueva</span>
          </button>
        </div>
      </header>

      {/* Matrix */}
      <main className="flex-1 overflow-hidden">
        <EisenhowerMatrix
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMoveToQuadrant={handleMoveToQuadrant}
          onSendToCalendar={handleSendToCalendar}
          isGoogleConnected={isGoogleConnected}
        />
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center border-t border-[var(--border-color)] bg-[var(--bg-secondary)]/40 px-4 py-1.5">
        <span className="text-[11px] text-[var(--text-muted)] tracking-widest uppercase font-[family-name:var(--font-space-grotesk)]">
          ALVIS Solutions
        </span>
      </footer>

      {/* Task Form (Create/Edit) */}
      <TaskForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleCreate}
        onUpdate={handleUpdate}
        editingTask={editingTask}
        loading={creating}
      />

      {/* Calendar Time Picker */}
      <CalendarTimePicker
        open={!!calendarPickerTask}
        onClose={() => setCalendarPickerTask(null)}
        onConfirm={handleCalendarConfirm}
        taskTitle={calendarPickerTask?.title || ""}
      />
    </div>
  );
}
