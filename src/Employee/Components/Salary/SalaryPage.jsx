
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

function SalaryPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCard, setSelectedCard] = useState(0);

  // Top cards stats
  const [cards, setCards] = useState([
    { id: 1, title: 'Total Earnings', number: 0 },
    { id: 2, title: 'Total Deductions', number: 0 },
    { id: 3, title: 'Net Pay', number: 0 },
  ]);

  // Salary details list
  const [salaryDetails, setSalaryDetails] = useState([]);

  // useEffect(() => {
  //   if (user?.employeeId) {
  //     // Fetch salary stats
  //     axios.get(`http://localhost:5000/api/getSalaryStats/${user.employeeId}`)
  //       .then(res => {
  //         const stats = res.data;
  //         setCards([
  //           { id: 1, title: 'Total Earnings', number: stats.totalEarnings || 0 },
  //           { id: 2, title: 'Total Deductions', number: stats.totalDeductions || 0 },
  //           { id: 3, title: 'Net Pay', number: stats.netPay || 0 },
  //         ]);
  //       })
  //       .catch(err => console.error(err));

  //     // Fetch salary details (monthly)
  //     axios.get(`http://localhost:5000/api/getSalaryDetails/${user.employeeId}`)
  //       .then(res => setSalaryDetails(res.data || []))
  //       .catch(err => console.error(err));
  //   }
  // }, [user]);

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
                    ₹{card.number}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </div>

      {/* Salary Details Table */}
      <h2 className="text-center">Salary Details</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Month</th>
            <th>Basic Pay</th>
            <th>Allowances</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {salaryDetails.length > 0 ? (
            salaryDetails.map((item, idx) => (
              <tr key={idx}>
                <td>{item.month}</td>
                <td>₹{item.basic_pay}</td>
                <td>₹{item.allowances}</td>
                <td>₹{item.deductions}</td>
                <td>₹{item.net_salary}</td>
                <td>
                  {item.status === "Paid" ? (
                    <span className="badge bg-success">Paid</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Pending</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">No salary records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalaryPage;
