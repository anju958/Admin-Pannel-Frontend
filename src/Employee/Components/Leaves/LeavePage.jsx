
import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import axios from 'axios';

function LeavePage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCard, setSelectedCard] = useState(0);

  // Stats cards
  const [cards, setCards] = useState([
    { id: 2, title: 'Total Projects', number: 0 },
    { id: 3, title: 'Total Leaves', number: 0 },
    { id: 4, title: 'Balance Leaves', number: 0 }
  ]);

  // Leave form state
  const [leave, setLeave] = useState({
    employeeId: user?.employeeId || "",
    leave_type: "",
    from_date: "",
    to_date: "",
    reason: "",
  });

  // Leave history
  const [leaveHistory, setLeaveHistory] = useState([]);

//   useEffect(() => {
//     // Fetch leave stats
//     if (user?.employeeId) {
//       axios.get(`http://localhost:5000/api/getLeaveStats/${user.employeeId}`)
//         .then(res => {
//           // expecting { totalProjects, totalLeaves, balanceLeaves }
//           const stats = res.data;
//           setCards([
//             { id: 2, title: 'Total Projects', number: stats.totalProjects || 0 },
//             { id: 3, title: 'Total Leaves', number: stats.totalLeaves || 0 },
//             { id: 4, title: 'Balance Leaves', number: stats.balanceLeaves || 0 },
//           ]);
//         })
//         .catch(err => console.error(err));

//       // Fetch leave history
//       axios.get(`http://localhost:5000/api/getLeaveHistory/${user.employeeId}`)
//         .then(res => setLeaveHistory(res.data || []))
//         .catch(err => console.error(err));
//     }
//   }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave({ ...leave, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/addLeave", leave);
      alert(res.data.message);
      setLeave({
        employeeId: user?.employeeId || "",
        leave_type: "",
        from_date: "",
        to_date: "",
        reason: "",
      });
      // refresh history after submit
      const history = await axios.get(`http://localhost:5000/api/getLeaveHistory/${user.employeeId}`);
      setLeaveHistory(history.data || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting leave");
    }
  };

  return (
    <>
      <div className="container-fluid">
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
      </div>

      <div className="container-fluid">
        <h2 className="text-center mt-3">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="p-3">
          <div className="mb-3">
            <select
              name="leave_type"
              className="form-control"
              value={leave.leave_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave / Privilege Leave</option>
              <option value="Maternity Leave">Maternity Leave / Paternity Leave</option>
              <option value="Half-Day Leave">Half-Day Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">From Date</label>
            <input
              type="date"
              name="from_date"
              className="form-control"
              value={leave.from_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">To Date</label>
            <input
              type="date"
              name="to_date"
              className="form-control"
              value={leave.to_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Reason</label>
            <input
              type="text"
              name="reason"
              placeholder="Enter Reason"
              className="form-control"
              value={leave.reason}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-primary form-control">
              Apply Leave
            </button>
          </div>
        </form>
      </div>

      <div className="container-fluid">
        <h2 className="text-center">Leave History</h2>
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>Leave Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.length > 0 ? (
              leaveHistory.map((lv, idx) => (
                <tr key={idx}>
                  <td>{lv.leave_type}</td>
                  <td>{lv.from_date}</td>
                  <td>{lv.to_date}</td>
                  <td>{lv.days}</td>
                  <td>{lv.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">No leave history available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LeavePage;
