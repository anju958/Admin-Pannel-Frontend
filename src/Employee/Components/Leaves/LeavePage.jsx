
import React, { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import axios from "axios";
import { API_URL } from "../../../config";

function LeavePage() {
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user")) || {}; }
    catch { return {}; }
  }, []);

  const [employee, setEmployee] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [cards, setCards] = useState([{ id: 1, title: "Leaves Taken (This Month)", number: 0 }]);
  const [leave, setLeave] = useState({
    employeeId: user?._id || user?.employeeId || "",
    employeeName: "",
    leave_type: "",
    from_date: "",
    to_date: "",
    reason: "",
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState(0);

  // Fetch employee info
  useEffect(() => {
    if (!user?.employeeId || dataFetched) return;

    axios.get(`${API_URL}/api/getEmpDataByID/${user.employeeId}`)
      .then(res => {
        const emp = res.data;
        if (emp) {
          setEmployee(emp);
          setLeave(prev => ({
            ...prev,
            employeeId: emp.employeeId || "",
            employeeName: emp.ename || "",
          }));
          setDataFetched(true);
        }
      })
      .catch(err => console.error("Error fetching employee:", err));
  }, [user, dataFetched]);

  // Fetch leave history
  const fetchLeaves = async () => {
    if (!employee) return;

    try {
      const leaveRes = await axios.get(`${API_URL}/api/getAllLeaves/${employee._id}`);
      const leaves = leaveRes.data || [];
      setLeaveHistory(leaves);

      // Update card count for current month
      const now = new Date();
      const currentMonthLeaves = leaves.filter(lv => {
        const d = new Date(lv.startDate || lv.from_date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      setCards([{ id: 1, title: "Leaves Taken (This Month)", number: currentMonthLeaves.length }]);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  useEffect(() => { fetchLeaves(); }, [employee]);

  const handleChange = e => {
    const { name, value } = e.target;
    setLeave(prev => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   if (!employee) return;

  //   const empId = employee._id;
  //   try {
  //     await axios.post(`${API_URL}/api/addLeave`, {
  //       userId: empId,
  //       reason: leave.reason,
  //       startDate: leave.from_date,
  //       endDate: leave.to_date,
  //       leave_type: leave.leave_type,
  //     });

  //     await fetchLeaves(); // refresh leave history

  //     // Reset form
  //     setLeave(prev => ({ ...prev, leave_type: "", from_date: "", to_date: "", reason: "" }));
  //   } catch (err) {
  //     console.error("Error submitting leave:", err);
  //     alert(err.response?.data?.message || "Error submitting leave");
  //   }
  // };


const handleSubmit = async e => {
  e.preventDefault();
  if (!employee) return;

  const empId = employee._id;
  try {
    await axios.post(`${API_URL}/api/addLeave`, {
      userId: empId,
      reason: leave.reason,
      startDate: leave.from_date,
      endDate: leave.to_date,
      leave_type: leave.leave_type,
    });

    await fetchLeaves(); // refresh leave history

    alert('Leave applied successfully'); // Success message

    setLeave(prev => ({ ...prev, leave_type: "", from_date: "", to_date: "", reason: "" }));
  } catch (err) {
    console.error("Error submitting leave:", err);
    alert(err.response?.data?.message || "Error submitting leave");
  }
};


  const formatDate = d => (d ? new Date(d).toISOString().split("T")[0] : "");

  const filteredLeaves = leaveHistory.filter(lv => {
    const d = new Date(lv.startDate || lv.from_date);
    return d.getMonth() === selectedMonth.getMonth() &&
           d.getFullYear() === selectedMonth.getFullYear();
  });

  return (
    <>
      {/* Leave Card */}
      <div className="container-fluid">
        <div className="p-4">
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: 2 }}>
            {cards.map((card, index) => (
              <Card key={card.id}>
                <CardActionArea onClick={() => setSelectedCard(index)} data-active={selectedCard===index? "": undefined} sx={{
                  height:"100%", "&[data-active]": { backgroundColor:"action.selected", "&:hover":{backgroundColor:"action.selectedHover"} }
                }}>
                  <CardContent sx={{height:"100%"}}>
                    <Typography variant="h6">{card.title}</Typography>
                    <Typography variant="h5" fontWeight="bold">{card.number}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </div>
      </div>

      {/* Leave Form */}
      <div className="container-fluid">
        <h2 className="text-center mt-3">Apply for Leave</h2>
        <form onSubmit={handleSubmit} className="p-3">
          <div className="mb-3">
            <label className="form-label fw-semibold">Employee ID</label>
            <input type="text" className="form-control" value={leave.employeeId} disabled />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Employee Name</label>
            <input type="text" className="form-control" value={leave.employeeName} disabled />
          </div>
          <div className="mb-3">
            <select name="leave_type" className="form-control" value={leave.leave_type} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Earned Leave">Earned Leave / Privilege Leave</option>
              <option value="Maternity Leave">Maternity / Paternity Leave</option>
              <option value="Half-Day Leave">Half-Day Leave</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">From Date</label>
            <input type="date" name="from_date" className="form-control" value={leave.from_date} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">To Date</label>
            <input type="date" name="to_date" className="form-control" value={leave.to_date} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Reason</label>
            <input type="text" name="reason" className="form-control" value={leave.reason} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary form-control">Apply Leave</button>
          </div>
        </form>
      </div>

      {/* Green Area - Leave History */}
      <div className="container-fluid my-4 p-3" style={{backgroundColor:"#d4edda", borderRadius:"5px"}}>
        <div className="d-flex justify-content-end mb-2">
          <label className="me-2 fw-semibold">Select Month:</label>
          <input
            type="month"
            value={`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth()+1).padStart(2,"0")}`}
            onChange={e => { const [y,m]=e.target.value.split("-"); setSelectedMonth(new Date(y,m-1,1)) }}
          />
        </div>
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
            {filteredLeaves.length > 0 ? filteredLeaves.map((lv, idx)=>(
              <tr key={idx}>
                <td>{lv.leave_type}</td>
                <td>{formatDate(lv.from_date)}</td>
                <td>{formatDate(lv.to_date)}</td>
                <td>{lv.days || "-"}</td>
                <td>{lv.status || "Pending"}</td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="text-center">No leave history for this month</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LeavePage;
