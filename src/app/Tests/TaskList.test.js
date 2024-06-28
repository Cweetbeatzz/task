import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TaskList from "./TaskList";
import { TaskProvider } from "../context/TaskContext";

// Mock the UI components
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, id }) => (
    <input id={id} value={value} onChange={onChange} />
  ),
}));

jest.mock("@/components/ui/table", () => ({
  Table: ({ children }) => <table>{children}</table>,
  TableBody: ({ children }) => <tbody>{children}</tbody>,
  TableCell: ({ children }) => <td>{children}</td>,
  TableHead: ({ children }) => <th>{children}</th>,
  TableHeader: ({ children }) => <thead>{children}</thead>,
  TableRow: ({ children }) => <tr>{children}</tr>,
}));

jest.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children }) => <div>{children}</div>,
  DialogContent: ({ children }) => <div>{children}</div>,
  DialogDescription: ({ children }) => <div>{children}</div>,
  DialogHeader: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogTrigger: ({ children }) => <div>{children}</div>,
  DialogFooter: ({ children }) => <div>{children}</div>,
}));

// Mock the TaskContext
const mockTaskContext = {
  tasks: [
    {
      id: 1,
      title: "Test Task",
      description: "Test Description",
      priority: "High",
      completed: false,
    },
  ],
  addTask: jest.fn(),
  editTask: jest.fn(),
  toggleTaskCompletion: jest.fn(),
  removeTask: jest.fn(),
  loading: false,
  error: null,
};

jest.mock("../context/TaskContext", () => ({
  useTaskContext: () => mockTaskContext,
}));

describe("TaskList Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders TaskList component", async () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("TASKS")).toBeInTheDocument();
      expect(screen.getByText("Add Task")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search tasks...")
      ).toBeInTheDocument();
    });
  });

  test("opens add task modal", async () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(screen.getByText("Add Task")).toBeInTheDocument();
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
      expect(screen.getByLabelText("Description")).toBeInTheDocument();
      expect(screen.getByLabelText("Priority")).toBeInTheDocument();
    });
  });

  test("adds a new task", async () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    fireEvent.click(screen.getByText("Add Task"));

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "New Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "New Description" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "High" },
    });

    fireEvent.click(screen.getByText("Add Task"));

    await waitFor(() => {
      expect(mockTaskContext.addTask).toHaveBeenCalledWith({
        title: "New Task",
        description: "New Description",
        priority: "High",
      });
    });
  });

  test("toggles task completion", async () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockTaskContext.toggleTaskCompletion).toHaveBeenCalledWith(1);
    });
  });

  test("removes a task", async () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    fireEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(mockTaskContext.removeTask).toHaveBeenCalledWith(1);
    });
  });

  test("edits a task", async () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    fireEvent.click(screen.getByText("Edit"));

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Updated Task" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Updated Description" },
    });
    fireEvent.change(screen.getByLabelText("Priority"), {
      target: { value: "Low" },
    });

    fireEvent.click(screen.getByText("Save Changes"));

    await waitFor(() => {
      expect(mockTaskContext.editTask).toHaveBeenCalledWith(1, {
        title: "Updated Task",
        description: "Updated Description",
        priority: "Low",
      });
    });
  });

  test("filters tasks based on search query", async () => {
    render(
      <TaskProvider>
        <TaskList />
      </TaskProvider>
    );

    const searchInput = screen.getByPlaceholderText("Search tasks...");
    fireEvent.change(searchInput, { target: { value: "Test" } });

    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: "Nonexistent" } });

    await waitFor(() => {
      expect(screen.queryByText("Test Task")).not.toBeInTheDocument();
    });
  });
});
