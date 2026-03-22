"use client";

import { useState, useEffect, useCallback } from "react";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  quadrant: "DO" | "PLAN" | "DELEGATE" | "ELIMINATE";
  aiConfidence: number;
  aiReasoning: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: {
    title: string;
    description?: string;
    deadline?: string;
  }) => {
    setCreating(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Error creando tarea");
      const task = await res.json();
      setTasks((prev) => [task, ...prev]);
      return task;
    } finally {
      setCreating(false);
    }
  };

  const updateTask = async (
    id: string,
    data: Partial<Pick<Task, "title" | "description" | "deadline" | "quadrant" | "completed">>,
  ) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error actualizando tarea");
    const updated = await res.json();
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const deleteTask = async (id: string) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error eliminando tarea");
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, creating, createTask, updateTask, deleteTask, fetchTasks };
}
