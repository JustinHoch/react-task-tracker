import express from 'express';
import mongo from 'mongodb';
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

    client.close();
  } catch (error) {
    res.status(500).json({message: 'Error connnecting to database', error });
    console.log(error);
  }
};

// Get Tasks
app.get('/tasks', async (req, res) => {
  dbConnection(async (db) => {

    // Query: get all tasks from 'tasks' collection
    const tasks = await db.collection('tasks').find({}).toArray();

    // Send tasks in json format
    res.status(200).json(tasks);

  }, res);
});

// Add Task
app.post('/add-task', async (req, res) => {
  dbConnection(async (db) => {

    // Get task from request body
    const {text, day, reminder} = req.body;
    // const task = { text: text, day: day, reminder: reminder };
    const task = {text, day, reminder};

    // Query: Add task to collection
    await db.collection('tasks').insertOne(task);

    // Retrieve added task
    const addedTask = await db.collection('tasks').findOne({"_id": task._id});

    // Send added task
    res.status(200).json(addedTask);

  }, res);
});

// Delete Task
app.post('/delete-task/:id', async (req, res) => {
  dbConnection(async (db) => {

    // Get task ID
    const taskId = req.params.id;

    // Get task to be deleted
    const task = await await db.collection('tasks').findOne({"_id": mongo.ObjectID(taskId)});

    // Delete task
    await db.collection('tasks').deleteOne({"_id": mongo.ObjectID(taskId)});

    res.status(200).json(task);

  }, res);
});

// Set Task Reminder

// Server listening on port 8000
app.listen(8000, () => console.log('listening on port 8000'));