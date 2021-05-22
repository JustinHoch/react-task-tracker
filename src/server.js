import express from 'express';
import MongoClient from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// tell express to parse JSON
app.use(express.json());

// Database Connection
const dbConnection = async (operations, res) => {
  try {
    const dbURL = process.env.DBURL;
    const client = await MongoClient.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('react-task-tracker');

    // For queries
    await operations(db);

    // For testing REMOVE LATER
    console.log("connection worked");

    client.close();
  } catch (error) {
    res.status(500).json({message: 'Error connnecting to database', error });
    console.log(error);
  }
};

// Get tasks from MongoDb
app.get('/tasks', async (req, res) => {
  dbConnection(async (db) => {

    // Query: get all tasks from 'tasks' collection
    const tasks = await db.collection('tasks').find({}).toArray();

    // Send tasks in json format
    res.status(200).json(tasks);

  }, res);
});

// Add Task

// Delete Task

// Set Task Reminder

// Server listening on port 8000
app.listen(8000, () => console.log('listening on port 8000'));