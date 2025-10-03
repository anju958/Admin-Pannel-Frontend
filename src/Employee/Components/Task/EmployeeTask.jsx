import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

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

  // Fetch tasks & stats
//   useEffect(() => {
//     if (user?.employeeId) {
//       // Get stats
//       axios.get(`http://localhost:5000/api/getTaskStats/${user.employeeId}`)
//         .then(res => {
//           const stats = res.data;
//           setCards([
//             { id: 1, title: 'Total Tasks', number: stats.totalTasks || 0 },
//             { id: 2, title: 'Completed Tasks', number: stats.completedTasks || 0 },
//             { id: 3, title: 'Pending Tasks', number: stats.pendingTasks || 0 },
//           ]);
//         })
//         .catch(err => console.error(err));

//       // Get tasks
//       axios.get(`http://localhost:5000/api/getTasksByEmployee/${user.employeeId}`)
//         .then(res => setTasks(res.data || []))
//         .catch(err => console.error(err));
//     }
//   }, [user]);

  // Update task status
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/updateTaskStatus/${taskId}`, { status: newStatus });
      // refresh tasks after update
      const updated = await axios.get(`http://localhost:5000/api/getTasksByEmployee/${user.employeeId}`);
      setTasks(updated.data || []);
      // refresh stats
      const stats = await axios.get(`http://localhost:5000/api/getTaskStats/${user.employeeId}`);
      setCards([
        { id: 1, title: 'Total Tasks', number: stats.data.totalTasks || 0 },
        { id: 2, title: 'Completed Tasks', number: stats.data.completedTasks || 0 },
        { id: 3, title: 'Pending Tasks', number: stats.data.pendingTasks || 0 },
      ]);
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
            <Card key={card.id}>
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
                <td>{task.task_name}</td>
                <td>{task.assigned_date}</td>
                <td>{task.due_date}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>
                  {task.status !== "Completed" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleStatusChange(task.id, "Completed")}
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
