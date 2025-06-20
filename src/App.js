import React, { useState, useEffect, useRef } from "react";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import {
  sendDeadlineNotification,
  sendOneHourBeforeNotification,
  sendCompletionNotification,
} from "./utils/notifications";

function App() {
  const inputRef = useRef(null);

  const [tasks, setTasks] = useState(() => {
    const savedUsername = localStorage.getItem("username");
    const savedTasks = savedUsername ? localStorage.getItem(savedUsername) : null;
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");

  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("isLoggedIn") === "true");
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(() => localStorage.getItem("username") || "");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Save dark mode changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Save task list when tasks change
  useEffect(() => {
    if (isLoggedIn && username) {
      localStorage.setItem(username, JSON.stringify(tasks));
    }
  }, [tasks, username, isLoggedIn]);

  // Timer updates for countdown and notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const updated = tasks.reduce((acc, task) => {
        const time = calculateTimeLeft(task.deadline);
        acc[task.id] = time;

        if (time === "1h 0m 0s" && !task.notified) {
          sendOneHourBeforeNotification(task);
          markAsNotified(task.id);
        }

        if (time === "Time's up!" && !task.notified) {
          sendDeadlineNotification(task);
          markAsNotified(task.id);
        }

        return acc;
      }, {});
      setTimeLeft(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  const calculateTimeLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;
    if (diff <= 0) return "Time's up!";
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
  };

  const markAsNotified = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, notified: true } : task))
    );
  };

  const handleRegister = () => {
    if (!username || !password) return alert("Enter valid username & password.");
    if (users.find((u) => u.username === username)) return alert("Username already exists.");

    const updatedUsers = [...users, { username, password }];
    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    alert("Registration successful!");
    setIsRegistering(false);
  };

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      const savedTasks = localStorage.getItem(username);
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.setItem(username, JSON.stringify(tasks));
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  const handleAddTask = () => {
    if (!taskInput.trim() || !deadlineInput) {
      setErrorMessage("Both fields required");
      return;
    }

    const isDuplicate = tasks.some(
      (task) =>
        task.text.trim().toLowerCase() === taskInput.trim().toLowerCase() &&
        task.id !== editingTaskId
    );

    if (isDuplicate) {
      setErrorMessage("Task already exists!");
      return;
    }

    const updatedTasks = editingTaskId
      ? tasks.map((task) =>
          task.id === editingTaskId
            ? { ...task, text: taskInput, deadline: deadlineInput, notified: false }
            : task
        )
      : [
          ...tasks,
          {
            id: Date.now(),
            text: taskInput.trim(),
            completed: false,
            deadline: deadlineInput,
            notified: false,
          },
        ];

    setTasks(updatedTasks);
    setTaskInput("");
    setDeadlineInput("");
    setEditingTaskId(null);
    setErrorMessage("");
  };

  const handleEditTask = (task) => {
    setTaskInput(task.text);
    setDeadlineInput(task.deadline);
    setEditingTaskId(task.id);
    setErrorMessage("");
  };

  const handleDeleteTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!window.confirm(`Delete "${task.text}"?`)) return;
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
  };

  const toggleCompletion = (id) => {
    const updated = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
    const task = tasks.find((t) => t.id === id);
    if (task && !task.completed) sendCompletionNotification(task);
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <AuthForm
        isRegistering={isRegistering}
        setIsRegistering={setIsRegistering}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        darkMode={darkMode}
      />
    );
  }

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="container">
        <Header
          title="Task Manager"
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          username={username}
        />

        <TaskInput
          taskInput={taskInput}
          setTaskInput={setTaskInput}
          deadlineInput={deadlineInput}
          setDeadlineInput={setDeadlineInput}
          handleAddTask={handleAddTask}
          editingTaskId={editingTaskId}
          inputRef={inputRef}
          errorMessage={errorMessage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <TaskList
          tasks={filteredTasks}
          timeLeft={timeLeft}
          calculateTimeLeft={calculateTimeLeft}
          toggleCompletion={toggleCompletion}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
        />
      </div>
    </div>
  );
}

export default App;
