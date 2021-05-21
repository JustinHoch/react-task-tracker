import express from 'express';
import MongoClient from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// tell express to parse JSON
app.use(express.json());

// Get tasks from MongoDb
app.get('/tasks', async (req, res) => {
  try {
    const dbURL = process.env.DBURL;
    const client = await MongoClient.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db('react-task-tracker');

    const tasks = await db.collection('tasks').find( {} ).toArray();
    res.status(200).json(tasks);
    console.log("connection worked");

    client.close();
  } catch (error) {
    res.status(500).json({message: 'Error connnecting to database', error });
    console.log(error);
  }
});

// Add Task


app.listen(8000, () => console.log('listening on port 8000'));