import { useState, useEffect } from 'react';
import Header from './components/Header';
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';

function App() {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTasks(tasksFromServer);
    }

    getTasks();
  }, []);

  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:8000/tasks');
    const data = await res.json();

    // check data returned
    console.log(data);

    return data;
  }

  // Add Task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:8000/add-task', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    });

    const data = await res.json();

    setTasks([...tasks, data]);
  };

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:8000/delete-task/${id}`, {
      method: 'POST'
    });

    setTasks(tasks.filter((task) => task._id !== id));
  }

  // toggle reminder
  const toggleReminder = async (id) => {
    await fetch(`http://localhost:8000/set-reminder/${id}`, {
      method: 'POST'
    });
    setTasks(tasks.map((task) => task._id === id ? { ...task, reminder: !task.reminder } : task));
  }

  return (
    <div className='container'>
      <Header title='Task Tracker' onAdd={() => setShowAddTask(!showAddTask)} showAddTask={showAddTask} />
      {showAddTask && <AddTask onAdd={addTask}/>}
      {tasks.length > 0 ? (
        <Tasks
          tasks={tasks}
          onDelete={deleteTask}
          onToggle={toggleReminder}
        />
      ) : (
        'No Tasks To Show'
      )}
    </div>
  );
}

export default App;
