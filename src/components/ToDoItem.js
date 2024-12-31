import React, { useState } from 'react';

function ToDoItem({ task, deleteTask, toggleCompleted, editTask }) {
  const [editValue, setEditValue] = useState(task.text); // Initialize with task.text
  const [isEditing, setIsEditing] = useState(false); // Track editing state

  function handleChange() {
    toggleCompleted(task.id);
  }

  return (
    <div className="todo-item">
      <div>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleChange}
        />
        {isEditing ? (
          // Editable input field when in editing mode
          <input
            type="text"
            value={editValue} // Controlled input linked to state
            onChange={(e) => setEditValue(e.target.value)} // Update editValue on input
          />
        ) : (
          // Display task text when not editing
          <p className={task.completed ? "completed" : ""}>{task.text}</p>
        )}
      </div>
      <div className="actions">
        <button
          className="edit-btn"
          onClick={() => {
            if (isEditing) {
              // Save the edited value
              editTask(task.id, editValue);
            }
            setIsEditing(!isEditing); // Toggle editing state
          }}
        >
          {isEditing ? "Save" : <i className="bi bi-pencil"></i>}
        </button>
        <button
          className="delete-btn"
          onClick={() => deleteTask(task.id)}
        >
          <i className="bi bi-trash"></i>
        </button>
      </div>

    </div>
  );
}

export default ToDoItem;