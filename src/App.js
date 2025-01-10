import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [taskInput, setTaskInput] = useState("");
  const [deadlineInput, setDeadlineInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true";
  });

  const inputRef = useRef(null);

  // Login-related states
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLogin = localStorage.getItem("isLoggedIn");
    return savedLogin === "true";
  });

  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState(() => {
    const savedUsername = localStorage.getItem("username");
    return savedUsername || "";
  });
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("users");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Task notification handling
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedTimeLeft = tasks.reduce((acc, task) => {
        acc[task.id] = calculateTimeLeft(task.deadline);

        if (calculateTimeLeft(task.deadline) === "1h 0m 0s" && !task.notified) {
          sendOneHourBeforeNotification(task);
          markAsNotified(task.id);
        }

        if (calculateTimeLeft(task.deadline) === "Time's up!" && !task.notified) {
          sendDeadlineNotification(task);
          markAsNotified(task.id);
        }

        return acc;
      }, {});
      setTimeLeft(updatedTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks]);

  const calculateTimeLeft = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) return "Time's up!";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const sendDeadlineNotification = (task) => {
    if (Notification.permission === "granted") {
      new Notification("Task Deadline Reached", {
        body: `Your task "${task.text}" is now overdue!`,
      });
    }
  };

  const sendOneHourBeforeNotification = (task) => {
    if (Notification.permission === "granted") {
      new Notification("Task Deadline Approaching", {
        body: `Your task "${task.text}" is due in one hour!`,
      });
    }
  };

  const markAsNotified = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, notified: true } : task
      )
    );
  };

  // User authentication functions
  const handleRegister = () => {
    if (!username || !password) {
      alert("Please enter a valid username and password.");
      return;
    }

    if (users.find((user) => user.username === username)) {
      alert("Username already exists. Please choose another.");
      return;
    }

    const newUsers = [...users, { username, password }];
    setUsers(newUsers);
    localStorage.setItem("users", JSON.stringify(newUsers));
    alert("Registration successful! Please log in.");
    setIsRegistering(false);
  };

  const handleLogin = () => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("tasks", JSON.stringify(tasks)); // Save tasks
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleLogout = () => {
    // Save tasks to localStorage before logging out
    if (isLoggedIn && username) {
      localStorage.setItem(username, JSON.stringify(tasks));
    }

    // Log the user out
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("tasks");
  };

  useEffect(() => {
    if (isLoggedIn && username) {
      // Load tasks from localStorage for the logged-in user
      const savedTasks = localStorage.getItem(username);
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
    }
  }, [isLoggedIn, username]);

  // Task management functions
  const handleAddTask = () => {
    if (taskInput.trim() && deadlineInput) {
      if (editingTaskId !== null) {
        const currentTask = tasks.find((task) => task.id === editingTaskId);

        if (currentTask.text === taskInput && currentTask.deadline === deadlineInput) {
          setEditingTaskId(null);
          setTaskInput("");
          setDeadlineInput("");
          setErrorMessage("");
          return;
        }

        const isDuplicate = tasks.some(
          (task) =>
            task.text.toLowerCase() === taskInput.toLowerCase().trim() &&
            task.id !== editingTaskId
        );

        if (isDuplicate) {
          setErrorMessage("Task already exists!");
          return;
        }

        setTasks(
          tasks.map((task) =>
            task.id === editingTaskId
              ? { ...task, text: taskInput, deadline: deadlineInput, notified: false }
              : task
          )
        );
        setEditingTaskId(null);
      } else {
        const isDuplicate = tasks.some(
          (task) => task.text.toLowerCase() === taskInput.toLowerCase().trim()
        );

        if (isDuplicate) {
          setErrorMessage("Task already exists!");
          return;
        }

        setTasks([
          ...tasks,
          {
            id: Date.now(),
            text: taskInput.trim(),
            completed: false,
            deadline: deadlineInput,
            notified: false,
          },
        ]);
      }

      setTaskInput("");
      setDeadlineInput("");
      setErrorMessage("");
    }
  };

  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    const confirmation = window.confirm(
      `Are you sure you want to delete the task: "${taskToDelete.text}"?`
    );
  
    if (confirmation) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  };

  const handleEditTask = (task) => {
    setTaskInput(task.text);
    setDeadlineInput(task.deadline);
    setEditingTaskId(task.id);
    setErrorMessage("");
  };

  const toggleCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    const task = tasks.find((task) => task.id === taskId);
    if (task && !task.completed) {
      sendCompletionNotification(task);
    }
  };

  const sendCompletionNotification = (task) => {
    if (Notification.permission === "granted") {
      new Notification("Task Completed", {
        body: `You've marked "${task.text}" as complete.`,
      });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleAddTask();
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If not logged in, show login/register page
  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <h1 className="heading">Task Manager</h1>
        <h2 className="subheading">{isRegistering ? "Register" : "Login"}</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
        />
        {isRegistering ? (
          <button onClick={handleRegister} className="auth-button">
            Register
          </button>
        ) : (
          <button onClick={handleLogin} className="auth-button">
            Login
          </button>
        )}
        <button
          onClick={() => setIsRegistering((prev) => !prev)}
          className="toggle-auth-button"
        >
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </button>
      </div>
    );
  }

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="container">
        <h1 className="heading">Task Manager</h1>

        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Logout
        </button>

        <button
          className="toggle-theme-button"
          onClick={() => {
            setDarkMode((prev) => {
              const newMode = !prev;
              localStorage.setItem("darkMode", newMode);
              return newMode;
            });
          }}
        >
          {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search tasks..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Add a task"
            className="task-input"
            onKeyDown={handleKeyPress}
            ref={inputRef}
          />
          <input
            type="datetime-local"
            value={deadlineInput}
            onChange={(e) => setDeadlineInput(e.target.value)}
            className="deadline-input"
          />
          <button onClick={handleAddTask} className="task-button">
            {editingTaskId !== null ? "Save" : "Add"}
          </button>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "completed-task" : ""}`}
            >
              <span
                className="task-text"
                style={{ textDecoration: task.completed ? "line-through" : "none" }}
              >
                {task.text}
              </span>
              <span className="deadline-timer">
                {timeLeft[task.id] || calculateTimeLeft(task.deadline)}
              </span>
              <div className="task-actions">
                <button
                  onClick={() => toggleCompletion(task.id)}
                  className={`completion-button ${task.completed ? "mark-incomplete" : "mark-complete"}`}
                >
                  {task.completed ? "Mark Incomplete" : "Mark Complete"}
                </button>
                <button
                  onClick={() => handleEditTask(task)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
