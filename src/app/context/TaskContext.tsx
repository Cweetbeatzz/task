"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Task } from "../types/Task";
import {
  getTasks,
  addTask as addTaskToStore,
  updateTask,
  deleteTask,
  toggleTaskCompletion as toggleTaskCompletionInStore,
} from "../taskStore";

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, "id" | "completed">) => Promise<void>;
  editTask: (id: number, taskData: Partial<Task>) => Promise<void>;
  toggleTaskCompletion: (id: number) => Promise<void>;
  removeTask: (id: number) => Promise<void>;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  //   useEffect(() => {
  //     const fetchTasks = async () => {
  //       try {
  //         setLoading(true);
  //         const response = await fetch("/api/tasks");
  //         if (response.ok) {
  //           const data = await response.json();
  //           setTasks(data);
  //         } else {
  //           throw new Error("Failed to fetch tasks");
  //         }
  //       } catch (error) {
  //         console.error("Error fetching tasks:", error);
  //         setError("Failed to fetch tasks. Please try again later.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     fetchTasks();
  //   }, []);

  const addTask = async (taskData: Omit<Task, "id" | "completed">) => {
    try {
      setLoading(true);
      const newTask = addTaskToStore(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //   const addTask = async (taskData: Omit<Task, "id" | "completed">) => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch("/api/tasks", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(taskData),
  //       });
  //       if (response.ok) {
  //         const addedTask = await response.json();
  //         setTasks((prevTasks) => [...prevTasks, addedTask]);
  //       } else {
  //         throw new Error("Failed to add task");
  //       }
  //     } catch (error) {
  //       console.error("Error adding task:", error);
  //       setError("Failed to add task. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const editTask = async (id: number, taskData: Partial<Task>) => {
    try {
      setLoading(true);
      const updatedTask = updateTask(id, taskData);
      if (updatedTask) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === id ? { ...task, ...updatedTask } : task
          )
        );
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      console.error("Error editing task:", error);
      setError("Failed to edit task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //   const editTask = async (id: number, taskData: Partial<Task>) => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(`/api/tasks/${id}`, {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(taskData),
  //       });
  //       if (response.ok) {
  //         const updatedTask = await response.json();
  //         setTasks((prevTasks) =>
  //           prevTasks.map((task) =>
  //             task.id === id ? { ...task, ...updatedTask } : task
  //           )
  //         );
  //       } else {
  //         throw new Error("Failed to edit task");
  //       }
  //     } catch (error) {
  //       console.error("Error editing task:", error);
  //       setError("Failed to edit task. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const toggleTaskCompletion = async (id: number) => {
    try {
      setLoading(true);
      const updatedTask = toggleTaskCompletionInStore(id);
      if (updatedTask) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === id ? updatedTask : task))
        );
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //   const toggleTaskCompletion = async (id: number) => {
  //     try {
  //       setLoading(true);
  //       const taskToUpdate = tasks.find((task) => task.id === id);
  //       if (taskToUpdate) {
  //         const updatedTask = {
  //           ...taskToUpdate,
  //           completed: !taskToUpdate.completed,
  //         };
  //         const response = await fetch(`/api/tasks/${id}`, {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(updatedTask),
  //         });
  //         if (response.ok) {
  //           setTasks((prevTasks) =>
  //             prevTasks.map((task) => (task.id === id ? updatedTask : task))
  //           );
  //         } else {
  //           throw new Error("Failed to toggle task completion");
  //         }
  //       }
  //     } catch (error) {
  //       console.error("Error toggling task completion:", error);
  //       setError("Failed to update task. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const removeTask = async (id: number) => {
    try {
      setLoading(true);
      const isDeleted = deleteTask(id);
      if (isDeleted) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      console.error("Error removing task:", error);
      setError("Failed to remove task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //   const removeTask = async (id: number) => {
  //     try {
  //       setLoading(true);
  //       const response = await fetch(`/api/tasks/${id}`, {
  //         method: "DELETE",
  //       });
  //       if (response.ok) {
  //         setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  //       } else {
  //         throw new Error("Failed to remove task");
  //       }
  //     } catch (error) {
  //       console.error("Error removing task:", error);
  //       setError("Failed to remove task. Please try again.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const contextValue: TaskContextType = {
    tasks,
    loading,
    error,
    addTask,
    editTask,
    toggleTaskCompletion,
    removeTask,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};
