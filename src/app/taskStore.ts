import { Task } from "@/app/types/Task";

let tasks: Task[] = [
  {
    id: 1,
    title: "Complete project report",
    description:
      "Finish writing the project report and submit it to the manager",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Make important phone call",
    description: "Call the client to discuss the project details",
    priority: "High",
    completed: false,
  },
  {
    id: 3,
    title: "Respond to urgent emails",
    description: "Reply to the pending emails from the clients and colleagues",
    priority: "Medium",
    completed: false,
  },
  {
    id: 4,
    title: "Review and edit document",
    description: "Review and edit the project document before submission",
    priority: "Medium",
    completed: false,
  },
  {
    id: 5,
    title: "Organize files and documents",
    description: "Organize the files and documents in the project folder",
    priority: "Low",
    completed: false,
  },
  {
    id: 6,
    title: "Take a break and stretch",
    description: "Take a short break and stretch to refresh the mind and body",
    priority: "Low",
    completed: false,
  },
];
export const getTasks = () => tasks;

export const addTask = (task: Omit<Task, "id" | "completed">): Task => {
  const newTask: Task = {
    id: tasks.length + 1,
    ...task,
    completed: false,
  };
  tasks.push(newTask);
  return newTask;
};

export const updateTask = (
  id: number,
  updatedTask: Partial<Task>
): Task | null => {
  const index = tasks.findIndex((task) => task.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    return tasks[index];
  }
  return null;
};

export const deleteTask = (id: number): boolean => {
  const initialLength = tasks.length;
  tasks = tasks.filter((task) => task.id !== id);
  return tasks.length < initialLength;
};

export const toggleTaskCompletion = (id: number): Task | null => {
  const task = tasks.find((task) => task.id === id);
  if (task) {
    task.completed = !task.completed;
    return task;
  }
  return null;
};
