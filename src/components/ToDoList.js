import React, { useState, useEffect } from 'react';
import ToDoItem from './ToDoItem';
import axios from 'axios';

function ToDoList() {

  const [tasks, setTasks] = useState([]); 

  useEffect(() => {
    const fetchList = async () => {
      try {
        const response = await axios.get('http://localhost:5002/list');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchList();
  }, []); 

  const [text, setText] = useState(''); 

  async function addTask(text) {
    try {
      const response = await axios.post("http://localhost:5002/list", {task: text})
  
    const newTask = response.data.data;
    setTasks([...tasks, newTask])
    setText('');
  } catch (error) {
    console.error("Error adding task:", error);
  }
}

const [isClicked, setIsClicked] = useState(false);

async function editTask(id, updatedText) {
  try {
    const response = await axios.put(`http://localhost:5002/list/${id}`, { task: updatedText });
    const updatedTask = response.data.data; // Correctly access the updated task
    // Update the task in the state
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
  } catch (error) {
    console.error("Error editing task:", error);
  }
}


 async function deleteTask(id) {
    try {
      await axios.delete(`http://localhost:5002/list/${id}`);
    setTasks(tasks.filter(task => task.id !== id));
  }catch (error) {
    console.error('Error deleting task:', error);
  }
}

async function toggleCompleted(id) {
  const task = tasks.find((task) => task.id === id); // Find the task to toggle
  try {
    const response = await axios.put(`http://localhost:5002/list/${id}`, { completed: !task.completed });
    const updatedTask = response.data.data; // Access the full updated task from the backend
    
    // Merge the updated task into the state
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t)));
  } catch (error) {
    console.error('Error updating task:', error);
  }
}

  return (
    <div className='todo-list'>
      <h1>To-Do List</h1>
      <div className="input-section">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a new task"
        />
        <button className="add-btn" onClick={() => addTask(text)}>Add</button>
      </div>

      <div className="task-container">
      {tasks.map(task => (
         <ToDoItem
          key={task.id}
          task={{
          id: task.id,
          text: task.task,
          completed: task.completed,
       }}
          deleteTask={deleteTask} 
          toggleCompleted={toggleCompleted}
          editTask={editTask}
          isClicked={isClicked}
          setIsClicked={setIsClicked}
         />
       ))}
      </div>
    </div>
    );
}

export default ToDoList;


/* fetchList();
  }, []); 
  
  When you use an empty dependency array ([]) in useEffect, it runs only once when the component is mounted (i.e., when the page loads or when the component first appears on the screen). After that, it will not run again, even if the component re-renders due to state or prop changes.
  
*/

/* setTasks(response.data);
[
  {
    "id": 1,
    "task": "Learn React"
  },
  {
    "id": 2,
    "task": "Build a To-Do List"
  }
]

(response.data) is already the array of tasks, so there’s no need for further nesting (e.g., response.data.data).
*/

/* const newTask = response.data.data;

First response.data: This refers to the entire response body returned by the server.
Second .data: This refers to the nested data property inside the response payload. 
eg. {
  "status": "success",
  "data": {
    "id": 3,
    "task": "New Task"
  }
}
*/

/* setTasks([...tasks, newTask])
The new task is displayed on the page, but this is purely from the updated tasks state, not because of a GET request because due to empty dependancy array, it only run once when component or page loads.
*/

/* task={{
          id: task.id,
          text: task.task,
          completed: task.completed,
        }}
        
        Keys on left side is being used by ToDoItem.js and values on right side after dot is being taken from database req.*/

        /* async function toggleCompleted(id)
        Summary of the Function's Workflow
       - Find the task in the tasks array using its ID.
       - Send a PUT request to the server to toggle the task’s completed status.
       - Receive the updated task from the server.
       - Update the frontend state so the UI reflects the change.
       - Handle errors gracefully if something goes wrong during the update.
       */

      /* const task = tasks.find(task => task.id === id) 
      The find method in JavaScript is an array method that is used to locate the first element in an array that satisfies a specific condition (or test). It returns the value of the first matching element, or undefined if no element matches.
      */