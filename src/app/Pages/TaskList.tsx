"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Task } from "../types/Task";
import { useTaskContext } from "../context/TaskContext";
import { Label } from "@/components/ui/label";

const TaskList = () => {
  const {
    tasks,
    addTask,
    editTask,
    toggleTaskCompletion,
    removeTask,
    loading,
    error,
  } = useTaskContext();
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskDescription, setNewTaskDescription] = useState<string>("");
  const [newTaskPriority, setNewTaskPriority] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isClient, setIsClient] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleToggleModal = () => {
    setShowModal(!showModal);
    setEditTaskId(null);
    setNewTaskTitle("");
    setNewTaskDescription("");
    setNewTaskPriority("");
  };

  const handleAddOrEditTask = async () => {
    if (
      !newTaskTitle.trim() ||
      !newTaskDescription.trim() ||
      !newTaskPriority.trim()
    ) {
      return;
    }

    if (editTaskId) {
      await editTask(editTaskId, {
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
      });
    } else {
      await addTask({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
      });
    }
    setShowModal(false);
  };

  const handleToggleTaskCompletion = async (id: number) => {
    await toggleTaskCompletion(id);
  };

  const handleRemoveTask = async (id: number) => {
    await removeTask(id);
  };

  const handleEditButtonClick = (task: Task) => {
    setEditTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
    setNewTaskPriority(task.priority);
    setShowModal(true);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.priority.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <div className="flex justify-center mt-6">
        <Label htmlFor="title" className="text-3xl font-bold">
          TASKS
        </Label>
      </div>
      <div className="p-4 mx-auto">
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button onClick={handleToggleModal}>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editTaskId ? "Edit Task" : "Add Task"}</DialogTitle>
              <DialogDescription>
                {editTaskId
                  ? "Edit your task here"
                  : "Add a new task to your list"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Input
                  id="priority"
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddOrEditTask}>
                {editTaskId ? "Save Changes" : "Add Task"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <input
          className="border p-2 w-full mb-2 mt-3 border-gray-400"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />

        {isClient && (
          <Table className="mt-4 w-full border">
            <TableHeader>
              <TableRow>
                <TableHead className="border border-gray-300 p-2 text-lg font-bold text-left min-w-[100px]">
                  Complete
                </TableHead>
                <TableHead className="border border-gray-300 p-2 text-lg font-bold text-left min-w-[200px]">
                  Title
                </TableHead>
                <TableHead className="border border-gray-300 p-2 text-lg font-bold text-left min-w-[300px]">
                  Description
                </TableHead>
                <TableHead className="border border-gray-300 p-2 text-lg font-bold text-left min-w-[150px]">
                  Priority
                </TableHead>
                <TableHead className="border border-gray-300 p-2 text-lg font-bold text-left min-w-[100px]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="border border-gray-300 p-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTaskCompletion(task.id)}
                    />
                  </TableCell>
                  <TableCell
                    className={`border border-gray-300 p-2 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.title}
                  </TableCell>
                  <TableCell
                    className={`border border-gray-300 p-2 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.description}
                  </TableCell>
                  <TableCell
                    className={`border border-gray-300 p-2 ${
                      task.completed ? "line-through" : ""
                    }`}
                  >
                    {task.priority}
                  </TableCell>
                  <TableCell className="border border-gray-300 p-2">
                    <Button
                      className="bg-red-500 text-white p-2 hover:bg-red-700"
                      onClick={() => handleRemoveTask(task.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="bg-yellow-500 text-white p-2 ml-2 hover:bg-yellow-700"
                      onClick={() => handleEditButtonClick(task)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default TaskList;
