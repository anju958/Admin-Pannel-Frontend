

// import React, { useState, useEffect } from "react";
// import Box from "@mui/material/Box";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Typography from "@mui/material/Typography";
// import CardActionArea from "@mui/material/CardActionArea";
// import axios from "axios";
// import { API_URL } from "../../../config";

// function SalaryPage() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [selectedCard, setSelectedCard] = useState(0);

//   const [cards, setCards] = useState([
//     { id: 1, title: "Total Salary", number: 0 },
//     { id: 2, title: "Total Deductions", number: 0 },
//     { id: 3, title: "Net Pay", number: 0 },
//   ]);

//   const [salaryDetails, setSalaryDetails] = useState([]);

//   useEffect(() => {
//     if (user?._id) {
//       const currentMonth = new Date().toLocaleString("default", { month: "long" });
//       const currentYear = new Date().getFullYear();

      
//       axios
//         .get(`${API_URL}/api/getSalaryStats/${user._id}/${currentMonth}/${currentYear}`)
//         .then((res) => {
//           const stats = res.data;

//           // ✅ Make sure we wrap object into an array for table
//           const tableData = Array.isArray(stats) ? stats : [stats];

//           // ✅ Update top cards with first element
//           const first = tableData[0] || {};
//           setCards([
//             { id: 1, title: "Total Salary", number: first.totalSalary || 0 },
//             { id: 2, title: "Total Deductions", number: first.totalDeductions || 0 },
//             { id: 3, title: "Net Pay", number: first.netPay || 0 },
//           ]);

//           // ✅ Update salary table
//           setSalaryDetails(
//             tableData.map((item) => ({
//               month: item.month,
//               year: item.year,
//               basicPay: item.basicPay,
//               allowances: item.allowances,
//               deductions: item.totalDeductions || item.deductions || 0,
//               netPay: item.netPay,
//               status: item.status,
//             }))
//           );
//         })
//         .catch((err) => {
//           console.error("Error fetching salary stats:", err);
//           setCards([
//             { id: 1, title: "Total Salary", number: 0 },
//             { id: 2, title: "Total Deductions", number: 0 },
//             { id: 3, title: "Net Pay", number: 0 },
//           ]);
//           setSalaryDetails([]);
//         });
//            }
//       }, [user]);

//       console.log(salaryDetails)
//       return (
//         <div className="container-fluid">
//           {/* Employee Info Header */}
//           <div style={{ marginBottom: "1.5rem", marginTop: "1rem" }}>
//             <span style={{ fontWeight: 500, fontSize: "1.1rem" }}>
//               Employee ID: {user?.empId || "—"}
//             </span>
//             <span style={{ marginLeft: "2em", fontWeight: 500, fontSize: "1.1rem" }}>
//               Employee Name: {user?.ename || user?.name || "—"}
//             </span>
//           </div>

//           {/* Top Cards */}
//           <div className="p-4">
//             <Box
//               sx={{
//                 width: "100%",
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
//                 gap: 2,
//               }}
//             >
//               {cards.map((card, index) => (
//                 <Card key={card.id}>
//                   <CardActionArea
//                     onClick={() => setSelectedCard(index)}
//                     data-active={selectedCard === index ? "" : undefined}
//                     sx={{
//                       height: "100%",
//                       "&[data-active]": {
//                         backgroundColor: "action.selected",
//                         "&:hover": { backgroundColor: "action.selectedHover" },
//                       },
//                     }}
//                   >
//                     <CardContent sx={{ height: "100%" }}>
//                       <Typography variant="h6" component="div">
//                         {card.title}
//                       </Typography>
//                       <Typography variant="h5" color="text.primary" fontWeight="bold">
//                         ₹{card.number.toFixed(2)}
//                       </Typography>
//                     </CardContent>
//                   </CardActionArea>
//                 </Card>
//               ))}
//             </Box>
//           </div>

//           {/* Salary Details Table */}
//           <h2 className="text-center">Salary Details</h2>
//           <table className="table table-bordered table-striped">
//             <thead>
//               <tr>
//                 <th>Month</th>
//                 <th>Year</th>
//                 <th>Basic Pay</th>
//                 <th>Allowances</th>
//                 <th>Deductions</th>
//                 <th>Net Salary</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {salaryDetails.length > 0 ? (
//                 salaryDetails.map((item, idx) => (
//                   <tr key={idx}>
//                     <td>{item.month}</td>
//                     <td>{item.year}</td>
//                     <td>₹{item.basicPay}</td>
//                     <td>₹{item.allowances}</td>
//                     <td>₹{item.deductions}</td>
//                     <td>₹{item.netPay}</td>
//                     <td>
//                       {item.status === "Paid" ? (
//                         <span className="badge bg-success">Paid</span>
//                       ) : (
//                         <span className="badge bg-warning text-dark">Pending</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={7} className="text-center">
//                     No salary records found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       );
//     }

//     export default SalaryPage;

import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import axios from "axios";
import { API_URL } from "../../../config";

function SalaryPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCard, setSelectedCard] = useState(0);

  const [cards, setCards] = useState([
    { id: 1, title: "Total Salary", number: 0 },
    { id: 2, title: "Total Deductions", number: 0 },
    { id: 3, title: "Net Pay", number: 0 },
  ]);

  const [salaryDetails, setSalaryDetails] = useState([]);

  // useEffect(() => {
  //   if (!user?._id) return;

  //   const currentMonth = new Date().toLocaleString("default", { month: "long" });
  //   const currentYear = new Date().getFullYear();

  //   // ✅ Fetch summary for top cards
  //   axios
  //     .get(`${API_URL}/api/getSalaryStats/${user._id}/${currentMonth}/${currentYear}`)
  //     .then((res) => {
  //       const stats = res.data;
  //       setCards([
  //         { id: 1, title: "Total Salary", number: stats.totalSalary || 0 },
  //         { id: 2, title: "Total Deductions", number: stats.totalDeductions || 0 },
  //         { id: 3, title: "Net Pay", number: stats.netPay || 0 },
  //       ]);
  //     })
  //     .catch((err) => console.error("Error fetching salary stats:", err));

  //   // ✅ Fetch all salary details for table
  //   axios
  //     .get(`${API_URL}/api/getSalaryDetails/${user._id}`)
  //     .then((res) => {
  //       const data = res.data;
  //       if (Array.isArray(data) && data.length > 0) {
  //         setSalaryDetails(
  //           data.map((item) => ({
  //             month: item.month,
  //             year: item.year,
  //             basicPay: item.basicPay,
  //             allowances: item.allowances,
  //             deductions: item.deductions || item.totalDeductions || 0,
  //             netPay: item.netPay,
  //             status: item.status,
  //           }))
  //         );
  //       } else {
  //         setSalaryDetails([]);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching salary details:", err);
  //       setSalaryDetails([]);
  //     });
  // }, [user]);


  useEffect(() => {
  if (user?._id) {
    const currentMonth = new Date().toLocaleString("default", { month: "long" });
    const currentYear = new Date().getFullYear();

    // 1️⃣ Fetch summary for top cards
    axios.get(`${API_URL}/api/getSalaryStats/${user._id}/${currentMonth}/${currentYear}`)
      .then(res => {
        const stats = res.data;
        setCards([
          { id: 1, title: "Total Salary", number: stats.totalSalary || 0 },
          { id: 2, title: "Total Deductions", number: stats.totalDeductions || 0 },
          { id: 3, title: "Net Pay", number: stats.netPay || 0 },
        ]);
      })
      .catch(err => console.error(err));

    // 2️⃣ Fetch salary table data
    axios.get(`${API_URL}/api/getSalaryDetails/${user._id}`)
      .then(res => {
        setSalaryDetails(res.data || []);
      })
      .catch(err => console.error(err));
  }
}, [user]);

  return (
    <div className="container-fluid">
      {/* Employee Info */}
      <div style={{ marginBottom: "1.5rem", marginTop: "1rem" }}>
        <span style={{ fontWeight: 500, fontSize: "1.1rem" }}>
          Employee ID: {user?.empId || "—"}
        </span>
        <span style={{ marginLeft: "2em", fontWeight: 500, fontSize: "1.1rem" }}>
          Employee Name: {user?.ename || user?.name || "—"}
        </span>
      </div>

      {/* Top Cards */}
      <div className="p-4">
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
            gap: 2,
          }}
        >
          {cards.map((card, index) => (
            <Card key={card.id}>
              <CardActionArea
                onClick={() => setSelectedCard(index)}
                data-active={selectedCard === index ? "" : undefined}
                sx={{
                  height: "100%",
                  "&[data-active]": {
                    backgroundColor: "action.selected",
                    "&:hover": { backgroundColor: "action.selectedHover" },
                  },
                }}
              >
                <CardContent sx={{ height: "100%" }}>
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography variant="h5" color="text.primary" fontWeight="bold">
                    ₹{card.number.toFixed(2)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </div>

      {/* Salary Table */}
      <h2 className="text-center">Salary Details</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Month</th>
            <th>Year</th>
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
                <td>{item.year}</td>
                <td>₹{item.basicPay}</td>
                <td>₹{item.allowances}</td>
                <td>₹{item.deductions}</td>
                <td>₹{item.netPay}</td>
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
              <td colSpan={7} className="text-center">
                No salary records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalaryPage;
