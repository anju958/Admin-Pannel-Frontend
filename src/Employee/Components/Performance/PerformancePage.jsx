import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';


const performanceData = [
  { month: 'Jan', score: 75 },
  { month: 'Feb', score: 80 },
  { month: 'Mar', score: 85 },
  { month: 'Apr', score: 90 },
  { month: 'May', score: 88 },
  { month: 'Jun', score: 92 },
];

function PerformancePage() {
  return (
    <div className="performance-page">
      <h2 className="page-title">Performance Dashboard</h2>

      <div className="performance-summary">
        <div className="summary-card">
          <h3>Performance Score</h3>
          <p>88%</p>
        </div>
        <div className="summary-card">
          <h3>Tasks Completed</h3>
          <p>42</p>
        </div>
        <div className="summary-card">
          <h3>Pending Tasks</h3>
          <p>5</p>
        </div>
      </div>

      <div className="performance-chart">
        <h3>Performance Trend</h3>
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

      <div className="recent-feedback">
        <h3>Recent Feedback</h3>
        <ul>
          <li>Completed project ahead of schedule – Excellent!</li>
          <li>Improved teamwork and communication.</li>
          <li>Needs minor improvement in reporting.</li>
        </ul>
      </div>
    </div>
  );
}

export default PerformancePage;
