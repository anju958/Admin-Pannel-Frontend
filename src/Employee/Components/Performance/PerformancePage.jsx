

import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';
import { API_URL } from "../../../config";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function EmployeePerformance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [cards, setCards] = useState([
    { id: 1, title: 'Total Tasks', number: 0 },
    { id: 2, title: 'Completed Tasks', number: 0 },
    { id: 3, title: 'Pending Tasks', number: 0 },
  ]);
  const [tasks, setTasks] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  // Fetch tasks
  const fetchTasks = async () => {
    if (user?.employeeId) {
      try {
        const res = await axios.get(`${API_URL}/api/getTasksByEmployee/${user.employeeId}`);
        const tasksData = res.data || [];
        setTasks(tasksData);
        updateStats(tasksData);
        updatePerformanceChart(tasksData);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Update stats
  const updateStats = (tasksList) => {
    const total = tasksList.length;
    const completed = tasksList.filter(t => t.status === "Completed").length;
    const pending = total - completed;

    setCards([
      { id: 1, title: 'Total Tasks', number: total },
      { id: 2, title: 'Completed Tasks', number: completed },
      { id: 3, title: 'Pending Tasks', number: pending },
    ]);
  };

  // Update performance chart
  const updatePerformanceChart = (tasksList) => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const data = months.map((m, idx) => {
      const count = tasksList.filter(task => {
        if(task.status !== "Completed") return false;
        const taskMonth = new Date(task.dueDate).getMonth();
        return taskMonth === idx;
      }).length;
      return { month: m, score: count };
    });
    setPerformanceData(data);
  };

  const performanceScore = cards[0].number ? Math.round((cards[1].number / cards[0].number) * 100) : 0;

  return (
    <div className="container-fluid">
  
      {/* Performance Summary */}
      <div className="performance-summary d-flex gap-3 justify-content-center my-4">
        <div className="summary-card p-3 border">
          <h3>Performance Score</h3>
          <p>{performanceScore}%</p>
        </div>
        <div className="summary-card p-3 border">
          <h3>Tasks Completed</h3>
          <p>{cards[1].number}</p>
        </div>
        <div className="summary-card p-3 border">
          <h3>Pending Tasks</h3>
          <p>{cards[2].number}</p>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="performance-chart">
        <h3>Tasks Completed Per Month</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default EmployeePerformance;
