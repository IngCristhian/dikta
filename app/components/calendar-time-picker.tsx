"use client";

import { useState } from "react";
import { CalendarPlus, Loader2, X } from "lucide-react";

interface CalendarTimePickerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (dateTime: string) => Promise<void>;
  taskTitle: string;
}

export function CalendarTimePicker({
  open,
  onClose,
  onConfirm,
  taskTitle,
}: CalendarTimePickerProps) {
  const now = new Date();
  const nextHour = new Date(now);
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);

  const [date, setDate] = useState(nextHour.toISOString().split("T")[0]);
  const [time, setTime] = useState(
    `${String(nextHour.getHours()).padStart(2, "0")}:${String(nextHour.getMinutes()).padStart(2, "0")}`,
  );
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    setLoading(true);
    try {
      const dateTime = new Date(`${date}T${time}`).toISOString();
      await onConfirm(dateTime);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] transition-all focus:border-[var(--q2-color)]/50 focus:shadow-[0_0_0_3px_rgba(59,130,246,0.1)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={loading ? undefined : onClose}
      />
      <div className="relative z-10 w-[400px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-secondary)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--q2-glow)]">
            <CalendarPlus className="h-3.5 w-3.5 text-[var(--q2-color)]" />
          </div>
          <h2 className="text-lg font-semibold font-[family-name:var(--font-space-grotesk)] text-[var(--text-primary)] tracking-tight">
            Enviar a Calendar
          </h2>
        </div>

        <p className="mt-2 text-sm text-[var(--text-secondary)] truncate">
          {taskTitle}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClasses}
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[var(--text-secondary)] tracking-wide uppercase">
              Hora
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={inputClasses}
              disabled={loading}
            />
          </div>

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
              disabled={loading || !date || !time}
              className="flex items-center gap-2 rounded-lg bg-[var(--btn-primary-bg)] px-5 py-2.5 text-sm font-medium text-[var(--btn-primary-text)] disabled:opacity-40 transition-all hover:shadow-[0_0_20px_var(--btn-primary-shadow)] active:scale-[0.97]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CalendarPlus className="h-4 w-4" />
                  Crear evento
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
