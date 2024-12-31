const express = require('express');
const cors = require('cors');
const pgp = require('pg-promise')();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5002;

// Database connection setup
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'ToDoList',
  user: 'postgres',
  password: 'Chauhan@123',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Node.js backend for React!');
});

// Get all tasks
app.get('/list', async (req, res) => {
  try {
    const list = await db.any('SELECT * FROM list');
    console.log(list); // Log the tasks
    res.status(200).json(list);
  } catch (error) {
    console.error('Error fetching list:', error);
    res.status(500).json({ error: 'Failed to fetch list' });
  }
});

// Add a new task
app.post('/list', async (req, res) => {
  const { task } = req.body; // Extract data from the request body
  try {
    const result = await db.one(
      'INSERT INTO list (task, completed) VALUES ($1, $2) RETURNING *',
      [task, false] // Default `completed` to false for new tasks
    );
    res.status(201).json({ message: 'Task added successfully!', data: result });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update a task (both `task` and `completed`)
app.put('/list/:id', async (req, res) => {
  const { id } = req.params;
  const { task, completed } = req.body;

  try {
    const updatedTask = await db.one(
      'UPDATE list SET task = COALESCE($1, task), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *',
      [task, completed, id]
    );
    res.status(200).json({ message: 'Task updated successfully!', data: updatedTask });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/list/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.none('DELETE FROM list WHERE id = $1', [id]);
    res.status(200).send('Task deleted');
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// What is COALESCE?
// COALESCE is an SQL function that returns the first non-NULL value from a list of arguments.
// It is used to provide a default or fallback value when a column or input value is NULL.

// Why is COALESCE needed here?
// In the PUT method, we are updating multiple fields (task and completed).
// If the client sends only one field (e.g., task) and omits the other (e.g., completed),
// the omitted field would be NULL, which could overwrite the existing value in the database.
// Using COALESCE ensures that if the input value is NULL, the current database value is retained,
// preventing accidental data loss for fields not included in the update.
