
// import { useEffect, useState } from "react";
// import { formatDate } from "../../../utils/dateFormatter";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { API_URL } from "../../../config";

// function Trainee() {
//   const [employee, setEmployee] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get(`${API_URL}/api/getTraineeData`)
//       .then((result) => {
//         if (result.data) {
//           setEmployee(result.data);
//         } else {
//           alert(result.data.Error);
//         }
//       });
//   }, []);

//   const handleDelete = async (employeeId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this employee?"
//     );
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(
//         `${API_URL}/api/deleteSignUpUser/${employeeId}`
//       );
//       setEmployee((prev) =>
//         prev.filter((emp) => emp.employeeId !== employeeId)
//       );
//       alert("Employee deleted successfully!");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to delete employee");
//     }
//   };

//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-md-12">
//           <div className="container mt-4">
//             <h3 className="text-center fw-bold">Trainee List</h3>

//             <div className="form-input m-3">
//               <Link
//                 to="/admin/addemployee"
//                 className="btn btn-dark rounded-pill fw-bold"
//               >
//                 ➕ Add Trainee/Intern
//               </Link>
//             </div>

//             {/* ✅ Responsive wrapper */}
//             <div className="table-responsive">
//               <table className="table table-striped table-bordered align-middle text-center">
//                 <thead className="table-dark">
//                   <tr>
//                     <th>Emp_Id</th>
//                     <th>Name</th>
//                     <th>DOB</th>
//                     <th>Gender</th>
//                     <th>Phone No.</th>
//                     <th>Personal Email</th>
//                     <th>Official Email</th>
//                     <th>Father Name</th>
//                     <th>Mother Name</th>
//                     <th>Address</th>
//                     <th>Emergency Contact</th>
//                     <th>Relation</th>
//                     <th>Bank Name</th>
//                     <th>Account Number</th>
//                     <th>IFSC Code</th>
//                     <th>Account Holder Name</th>
//                     <th>Aadhar Card</th>
//                     <th>PAN No.</th>
//                     <th>Qualification</th>
//                     <th>Last Experience</th>
//                     <th>Exp with PWT</th>
//                     <th>Department</th>
//                     <th>Services</th>
//                     <th>Interview Date</th>
//                     <th>Joining Date</th>
//                     <th>Expected Salary</th>
//                     <th>Given Salary</th>
//                     <th>Working Time</th>
//                     <th>Resume</th>
//                     <th>Image</th>
//                     <th>User Type</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {employee.map((emp) => (
//                     <tr key={emp.employeeId}>
//                       <td>{emp.employeeId}</td>
//                       <td>{emp.ename}</td>
//                       <td>{formatDate(emp.dateOfBirth)}</td>
//                       <td>{emp.gender}</td>
//                       <td>{emp.phoneNo}</td>
//                       <td>{emp.personal_email}</td>
//                       <td>{emp.official_email}</td>
//                       <td>{emp.fatherName}</td>
//                       <td>{emp.motherName}</td>
//                       <td>{emp.address}</td>
//                       <td>{emp.emergencyContact}</td>
//                       <td>{emp.relation}</td>
//                       <td>{emp.bankName}</td>
//                       <td>{emp.accountNo}</td>
//                       <td>{emp.ifscCode}</td>
//                       <td>{emp.accountHolderName}</td>
//                       <td>{emp.adarCardNo}</td>
//                       <td>{emp.panNo}</td>
//                       <td>{emp.qualification}</td>
//                       <td>{emp.lastExp}</td>
//                       <td>{emp.expWithPWT}</td>
//                       <td>{emp.department?.deptName}</td>
//                       <td>{emp.service?.serviceName}</td>
//                       <td>
//                         {emp.interviewDate
//                           ? new Date(emp.interviewDate)
//                               .toISOString()
//                               .split("T")[0]
//                           : ""}
//                       </td>
//                       <td>
//                         {emp.joiningDate
//                           ? new Date(emp.joiningDate)
//                               .toISOString()
//                               .split("T")[0]
//                           : ""}
//                       </td>
//                       <td>
//                         <span className="badge bg-warning text-dark px-2">
//                           ₹{emp.expectedSalary}
//                         </span>
//                       </td>
//                       <td>
//                         <span className="badge bg-success px-2">
//                           ₹{emp.givenSalary}
//                         </span>
//                       </td>
//                       <td>{emp.workingTime}</td>
//                       <td>
//                         {emp.resumeFile ? (
//                           <a
//                             href={emp.resumeFile}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="btn btn-outline-primary btn-sm"
//                           >
//                             📄 View
//                           </a>
//                         ) : (
//                           "No Resume"
//                         )}
//                       </td>
//                       <td>
//                         {emp.img ? (
//                           <img
//                             src={emp.img}
//                             alt="Employee"
//                             style={{
//                               width: "50px",
//                               height: "50px",
//                               borderRadius: "50%",
//                               objectFit: "cover",
//                             }}
//                           />
//                         ) : (
//                           "No Image"
//                         )}
//                       </td>
//                       <td>
//                         <span
//                           className={`badge ${
//                             emp.userType === "trainee"
//                               ? "bg-info text-dark"
//                               : "bg-secondary"
//                           }`}
//                         >
//                           {emp.userType}
//                         </span>
//                       </td>
//                       <td>
//                         <button
//                           className="btn btn-success btn-sm me-2"
//                           onClick={() =>
//                             navigate(`/admin/upDateUder/${emp.employeeId}`)
//                           }
//                         >
//                           ✏️ Update
//                         </button>
//                         <button
//                           className="btn btn-primary btn-sm me-2"
//                           onClick={() =>
//                             navigate(`/admin/moveToEmplyee/${emp.employeeId}`)
//                           }
//                         >
//                           👤 Move
//                         </button>
//                         <button
//                           className="btn btn-danger btn-sm"
//                           onClick={() => handleDelete(emp.employeeId)}
//                         >
//                           🗑️ Delete
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//             {/* ✅ End Responsive wrapper */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Trainee;
import { useEffect, useState } from "react";
import { formatDate } from "../../../utils/dateFormatter";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";

function Trainee() {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/getTraineeData`)
      .then((result) => {
        if (result.data) {
          setEmployee(result.data);
        } else {
          alert(result.data.Error);
        }
      });
  }, []);

  const handleDelete = async (employeeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trainee?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/deleteSignUpUser/${employeeId}`);
      setEmployee((prev) =>
        prev.filter((emp) => emp.employeeId !== employeeId)
      );
      alert("Trainee deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete trainee");
    }
  };

  return (
    <div className="container-fluid py-4" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="card shadow-lg border-0 rounded-4">
        {/* Header */}
        <div
          className="card-header text-white text-center py-3 rounded-top-4"
          style={{ background: "linear-gradient(90deg, #1f3b98, #3f65d6)" }}
        >
          <h3 className="mb-0 fw-bold">🎓 Trainee & Intern List</h3>
        </div>

        <div className="card-body">
          {/* Add Button */}
          <div className="d-flex mb-3">
            <Link
              to="/admin/addemployee"
              className="btn btn-primary rounded-pill fw-bold shadow-sm"
            >
              ➕ Add Trainee/Intern
            </Link>
          </div>

          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <table className="table table-hover align-middle table-bordered text-center">
              <thead className="table-dark sticky-top" style={{ zIndex: "1" }}>
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Official Email</th>
                  <th>Last Exp</th>
                  <th>Department</th>
                  <th>Service</th>
                  <th>User Type</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {employee.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.ename}</td>
                    <td>{emp.phoneNo}</td>
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>
                      {emp.official_email}
                    </td>
                    <td>{emp.lastExp}</td>
                    <td>{emp.department?.deptName}</td>
                    <td>{emp.service?.serviceName}</td>
                    <td>
                      <span
                        className={`badge ${
                          emp.userType === "trainee"
                            ? "bg-info text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {emp.userType}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-info btn-sm me-2"
                        onClick={() => navigate(`/admin/viewTrainee/${emp.employeeId}`)}
                      >
                        👁️ View
                      </button>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => navigate(`/admin/upDateUder/${emp.employeeId}`)}
                      >
                        ✏️ Update
                      </button>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/admin/moveToEmplyee/${emp.employeeId}`)}
                      >
                        👤 Move
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(emp.employeeId)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Trainee;
