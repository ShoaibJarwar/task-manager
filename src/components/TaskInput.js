import React from "react";

const TaskInput = ({
  taskInput, setTaskInput,
  deadlineInput, setDeadlineInput,
  handleAddTask, editingTaskId,
  inputRef, errorMessage,
  searchQuery, setSearchQuery
}) => (
  <>
    <div className="search-container">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search tasks..."
        className="search-input"
      />
    </div>
    <div className="input-container">
      <input
        ref={inputRef}
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        placeholder="Add a task"
        className="task-input"
        onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
      />
      <input
        type="datetime-local"
        value={deadlineInput}
        onChange={(e) => setDeadlineInput(e.target.value)}
        className="deadline-input"
      />
      <button onClick={handleAddTask} className="task-button">
        {editingTaskId ? "Save" : "Add"}
      </button>
    </div>
    {errorMessage && <p className="error-message">{errorMessage}</p>}
  </>
);

export default TaskInput;
