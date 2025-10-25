import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';
import { API_URL } from "../../../config";

function EmployeeTask() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCard, setSelectedCard] = useState(0);

  // Stats cards
  const [cards, setCards] = useState([
    { id: 1, title: 'Total Tasks', number: 0 },
    { id: 2, title: 'Completed Tasks', number: 0 },
    { id: 3, title: 'Pending Tasks', number: 0 },
  ]);

  // Task list
  const [tasks, setTasks] = useState([]);

  // Update stats based on tasks
  const updateStats = (tasksList) => {
    const total = tasksList.length;
    const completed = tasksList.filter(t => t.status === "Completed").length;
    const pending = tasksList.filter(t => t.status !== "Completed").length;

    setCards([
      { id: 1, title: 'Total Tasks', number: total },
      { id: 2, title: 'Completed Tasks', number: completed },
      { id: 3, title: 'Pending Tasks', number: pending },
    ]);
  };

  // Fetch tasks
  const fetchTasks = async () => {
    if (user?.employeeId) {
      try {
        const res = await axios.get(`${API_URL}/api/getTasksByEmployee/${user.employeeId}`);
        const tasksData = res.data || [];
        setTasks(tasksData);
        updateStats(tasksData);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_URL}/api/updateTaskStatus/${taskId}`, { status: newStatus });
      // Refresh tasks
      await fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Error updating task status");
    }
  };

  return (
    <div className="container-fluid">
      {/* Top Cards */}
      <div className="p-4">
        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(200px, 100%), 1fr))',
            gap: 2,
          }}
        >
          {cards.map((card, index) => (
            <Card key={card.id} sx={{ backgroundColor: card.title === 'Pending Tasks' && card.number > 0 ? '#ffe0e0' : undefined }}>
              <CardActionArea
                onClick={() => setSelectedCard(index)}
                data-active={selectedCard === index ? '' : undefined}
                sx={{
                  height: '100%',
                  '&[data-active]': {
                    backgroundColor: 'action.selected',
                    '&:hover': {
                      backgroundColor: 'action.selectedHover',
                    },
                  },
                }}
              >
                <CardContent sx={{ height: '100%' }}>
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                  <Typography variant="h5" color="text.primary" fontWeight="bold">
                    {card.number}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </div>

      {/* Task List Table */}
      <h2 className="text-center">My Tasks</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Assigned Date</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            tasks.map((task, idx) => (
              <tr key={idx}>
                <td>{task.title}</td>
                <td>{new Date(task.startDate).toLocaleDateString()}</td>
                <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>
                  {task.status !== "Completed" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusChange(task._id, "Completed")}
                    >
                      Mark Completed
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">No tasks assigned</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default EmployeeTask;
