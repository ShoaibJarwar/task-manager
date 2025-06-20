import React from "react";

const TaskList = ({
  tasks, timeLeft,
  calculateTimeLeft,
  toggleCompletion,
  handleEditTask,
  handleDeleteTask
}) => (
  <ul className="task-list">
    {tasks.map(task => (
      <li key={task.id} className={`task-item ${task.completed ? "completed-task" : ""}`}>
        <span className="task-text" style={{ textDecoration: task.completed ? "line-through" : "none" }}>
          {task.text}
        </span>
        <span className="deadline-timer">
          {timeLeft[task.id] || calculateTimeLeft(task.deadline)}
        </span>
        <div className="task-actions">
          <button onClick={() => toggleCompletion(task.id)} className="completion-button">
            {task.completed ? "Mark Incomplete" : "Mark Complete"}
          </button>
          <button onClick={() => handleEditTask(task)} className="edit-button">Edit</button>
          <button onClick={() => handleDeleteTask(task.id)} className="delete-button">Delete</button>
        </div>
      </li>
    ))}
  </ul>
);

export default TaskList;
