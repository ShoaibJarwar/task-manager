import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("Task Manager App", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it("renders login form when not logged in", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("allows user to login and view task manager", () => {
    localStorage.setItem("users", JSON.stringify([{ username: "test", password: "1234" }]));
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: "test" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "1234" } });
    fireEvent.click(screen.getByText("Login"));
    expect(screen.getByText("Task Manager")).toBeInTheDocument();
  });

  it("adds a new task", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", "testUser");
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Add a task"), { target: { value: "New Task" } });
    fireEvent.change(screen.getByPlaceholderText("Add a deadline"), { target: { value: "2025-01-15T10:00" } });
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("New Task")).toBeInTheDocument();
  });

  it("shows error when adding duplicate task", () => {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("username", "testUser");
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Add a task"), { target: { value: "Duplicate Task" } });
    fireEvent.change(screen.getByPlaceholderText("Add a deadline"), { target: { value: "2025-01-15T10:00" } });
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByText("Task already exists! Please enter a unique task.")).toBeInTheDocument();
  });

  it("toggles dark mode", () => {
    render(<App />);
    const toggleButton = screen.getByText("Switch to Dark Mode");
    fireEvent.click(toggleButton);
    expect(localStorage.getItem("darkMode")).toBe("true");
  });
});
