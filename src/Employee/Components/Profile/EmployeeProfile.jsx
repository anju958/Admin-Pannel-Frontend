


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../../../config";
// import { Button, Spinner } from "react-bootstrap";

// function EmployeeProfile() {
//   const [employee, setEmployee] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const user = JSON.parse(localStorage.getItem("user"));

//   // Fetch employee data
//   useEffect(() => {
//     const fetchEmployee = async () => {
//       if (!user?.employeeId) return;
//       try {
//         const res = await axios.get(`${API_URL}/api/getEmplyeeById/${user.employeeId}`);
//         setEmployee(res.data);
//         setFormData(res.data);
//       } catch (err) {
//         console.error("Error fetching employee:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEmployee();
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   }

//   if (!employee) {
//     return <div className="text-center mt-5">No employee data found.</div>;
//   }

//   // Handle text input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle file input changes
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData({ ...formData, [e.target.name]: file });
//     }
//   };

//   // Save changes
//   const handleSave = async () => {
//     try {
//       const data = new FormData();
//       for (const key in formData) {
//         data.append(key, formData[key]);
//       }

//       const res = await axios.put(
//         `${API_URL}/api/updateEmployee/${employee._id}`,
//         data,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       setEmployee(res.data);
//       setEditMode(false);
//       alert("Profile updated successfully!");
//     } catch (err) {
//       console.error("Error updating profile:", err);
//       alert("Failed to update profile.");
//     }
//   };

//   // Helper to safely render values
//   const renderValue = (key) => {
//     const val = employee[key];
//     if (!val) return "N/A";

//     // Handle nested objects
//     if (key === "department") return val?.deptName || "N/A";
//     if (key === "service") return val?.serviceName || "N/A";

//     // Handle dates
//     if (key.toLowerCase().includes("date")) return new Date(val).toLocaleDateString();

//     return val;
//   };

//   return (
//     <div className="profile-page container py-5">
//       <h2 className="text-center text-primary mb-4">Employee Profile</h2>

//       <div className="text-end mb-3">
//         <Button onClick={() => setEditMode(!editMode)}>
//           {editMode ? "Cancel" : "Edit Profile"}
//         </Button>
//         {editMode && (
//           <Button variant="success" className="ms-2" onClick={handleSave}>
//             Save
//           </Button>
//         )}
//       </div>

//       <div className="profile-container d-flex flex-wrap gap-4">
//         {/* Left Panel */}
//         <div className="profile-left flex-shrink-0">
//           <img
//             src={employee.img || "/default-avatar.png"}
//             alt="Profile"
//             className="profile-image mb-3"
//             style={{ width: "150px", borderRadius: "50%" }}
//           />
//           {editMode && (
//             <input
//               type="file"
//               name="img"
//               accept="image/*"
//               onChange={handleFileChange}
//               className="form-control mb-2"
//             />
//           )}

//           <h3>{employee.ename || "N/A"}</h3>
//           {editMode && (
//             <input
//               type="text"
//               name="ename"
//               value={formData.ename || ""}
//               onChange={handleChange}
//               className="form-control mb-2"
//             />
//           )}

//           <p><strong>Employee ID:</strong> {employee.employeeId || "N/A"}</p>
//           <p><strong>User Type:</strong> {employee.userType || "N/A"}</p>
//         </div>

//         {/* Right Panel */}
//         <div className="profile-right flex-grow-1">
//           {/* Personal Information */}
//           <section className="mb-4">
//             <h4>Personal Information</h4>
//             <div className="info-grid row g-2">
//               {[
//                 ["dateOfBirth", "DOB"],
//                 ["gender", "Gender"],
//                 ["phoneNo", "Phone"],
//                 ["personal_email", "Personal Email"],
//                 ["official_email", "Official Email"],
//                 ["fatherName", "Father"],
//                 ["motherName", "Mother"],
//                 ["address", "Address"],
//                 ["emergencyContact", "Emergency Contact"],
//                 ["relation", "Relation"]
//               ].map(([key, label]) => (
//                 <div className="col-md-6" key={key}>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       name={key}
//                       value={formData[key] || ""}
//                       onChange={handleChange}
//                       placeholder={label}
//                       className="form-control"
//                     />
//                   ) : (
//                     <p><strong>{label}:</strong> {renderValue(key)}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Bank Details */}
//           <section className="mb-4">
//             <h4>Bank Details</h4>
//             <div className="info-grid row g-2">
//               {[
//                 ["bankName", "Bank"],
//                 ["accountNo", "Account No"],
//                 ["ifscCode", "IFSC"],
//                 ["accountHolderName", "Holder"]
//               ].map(([key, label]) => (
//                 <div className="col-md-6" key={key}>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       name={key}
//                       value={formData[key] || ""}
//                       onChange={handleChange}
//                       placeholder={label}
//                       className="form-control"
//                     />
//                   ) : (
//                     <p><strong>{label}:</strong> {renderValue(key)}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Identity & Documents */}
//           <section className="mb-4">
//             <h4>Identity & Documents</h4>
//             <div className="info-grid row g-2">
//               {[
//                 ["adarCardNo", "Aadhar"],
//                 ["panNo", "PAN"],
//                 ["qualification", "Qualification"],
//                 ["lastExp", "Last Exp"],
//                 ["expWithPWT", "Exp with PWT"]
//               ].map(([key, label]) => (
//                 <div className="col-md-6" key={key}>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       name={key}
//                       value={formData[key] || ""}
//                       onChange={handleChange}
//                       placeholder={label}
//                       className="form-control"
//                     />
//                   ) : (
//                     <p><strong>{label}:</strong> {renderValue(key)}</p>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Job & Salary */}
//           <section className="mb-4">
//             <h4>Job & Salary Details</h4>
//             <div className="info-grid row g-2">
//               {[
//                 ["department", "Department"],
//                 ["service", "Service"],
//                 ["interviewDate", "Interview Date"],
//                 ["joiningDate", "Joining Date"],
//                 ["expectedSalary", "Expected Salary"],
//                 ["givenSalary", "Given Salary"],
//                 ["workingTime", "Working Time"]
//               ].map(([key, label]) => (
//                 <div className="col-md-6" key={key}>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       name={key}
//                       value={formData[key]?.deptName || formData[key]?.serviceName || formData[key] || ""}
//                       onChange={handleChange}
//                       placeholder={label}
//                       className="form-control"
//                     />
//                   ) : (
//                     <p><strong>{label}:</strong> {renderValue(key)}</p>
//                   )}
//                 </div>
//               ))}

//               {/* Resume */}
//               <div className="col-12">
//                 <p>
//                   <strong>Resume:</strong>{" "}
//                   {employee.resumeFile ? (
//                     <a href={employee.resumeFile} target="_blank" rel="noopener noreferrer">
//                       View
//                     </a>
//                   ) : "N/A"}
//                 </p>
//                 {editMode && (
//                   <input
//                     type="file"
//                     name="resumeFile"
//                     accept=".pdf,.doc,.docx"
//                     onChange={handleFileChange}
//                     className="form-control"
//                   />
//                 )}
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default EmployeeProfile;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { Button, Spinner } from "react-bootstrap";

function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imgPreview, setImgPreview] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Flatten nested objects for FormData
  const flattenData = (data) => {
    return {
      ...data,
      department: data.department?._id || "",
      service: data.service?._id || ""
    };
  };

  // Fetch employee data
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!user?.employeeId) return;
      try {
        const res = await axios.get(`${API_URL}/api/getEmplyeeById/${user.employeeId}`);
        setEmployee(res.data);
        setFormData(flattenData(res.data));
        setImgPreview(res.data.img || null);
      } catch (err) {
        console.error("Error fetching employee:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [user]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="primary" />
    </div>
  );
  if (!employee) return <div className="text-center mt-5">No employee data found.</div>;

  // Handle text input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, [e.target.name]: file });
      if (e.target.name === "img") setImgPreview(URL.createObjectURL(file));
    }
  };

  // Save updated profile
  const handleSave = async () => {
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      const res = await axios.put(`${API_URL}/api/updateSelfId/${employee._id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEmployee(res.data); // update employee with latest data
      setFormData(flattenData(res.data));
      setEditMode(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    }
  };

  const renderValue = (key) => {
    const val = employee[key];
    if (!val) return "N/A";
    if (key === "department") return employee.department?.deptName || "N/A";
    if (key === "service") return employee.service?.serviceName || "N/A";
    if (key.toLowerCase().includes("date")) return new Date(val).toLocaleDateString();
    return val;
  };

  return (
    <div className="profile-page container py-5">
      <h2 className="text-center text-primary mb-4">Employee Profile</h2>

      <div className="text-end mb-3">
        <Button onClick={() => setEditMode(!editMode)}>{editMode ? "Cancel" : "Edit Profile"}</Button>
        {editMode && <Button variant="success" className="ms-2" onClick={handleSave}>Save</Button>}
      </div>

      <div className="profile-container d-flex flex-wrap gap-4">
        {/* Left Panel */}
        <div className="profile-left flex-shrink-0">
          <img src={imgPreview || "/default-avatar.png"} alt="Profile" className="profile-image mb-3" style={{ width: "150px", borderRadius: "50%" }} />
          {editMode && <input type="file" name="img" accept="image/*" onChange={handleFileChange} className="form-control mb-2" />}

          <h3>{employee.ename || "N/A"}</h3>
          {editMode && <input type="text" name="ename" value={formData.ename || ""} onChange={handleChange} className="form-control mb-2" />}

          <p><strong>Employee ID:</strong> {employee.employeeId || "N/A"}</p>
          <p><strong>User Type:</strong> {employee.userType || "N/A"}</p>
        </div>

        {/* Right Panel */}
        <div className="profile-right flex-grow-1">
          {/* Personal Information */}
          <section className="mb-4">
            <h4>Personal Information</h4>
            <div className="info-grid row g-2">
              {[
                ["dateOfBirth", "DOB"],
                ["gender", "Gender"],
                ["phoneNo", "Phone"],
                ["personal_email", "Personal Email"],
                ["official_email", "Official Email"],
                ["fatherName", "Father"],
                ["motherName", "Mother"],
                ["address", "Address"],
                ["emergencyContact", "Emergency Contact"],
                ["relation", "Relation"]
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  {editMode ? <input type="text" name={key} value={formData[key] || ""} onChange={handleChange} placeholder={label} className="form-control" /> : <p><strong>{label}:</strong> {renderValue(key)}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Bank Details */}
          <section className="mb-4">
            <h4>Bank Details</h4>
            <div className="info-grid row g-2">
              {[
                ["bankName", "Bank"],
                ["accountNo", "Account No"],
                ["ifscCode", "IFSC"],
                ["accountHolderName", "Holder"]
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  {editMode ? <input type="text" name={key} value={formData[key] || ""} onChange={handleChange} placeholder={label} className="form-control" /> : <p><strong>{label}:</strong> {renderValue(key)}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Identity & Documents */}
          <section className="mb-4">
            <h4>Identity & Documents</h4>
            <div className="info-grid row g-2">
              {[
                ["adarCardNo", "Aadhar"],
                ["panNo", "PAN"],
                ["qualification", "Qualification"],
                ["lastExp", "Last Exp"],
                ["expWithPWT", "Exp with PWT"]
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  {editMode ? <input type="text" name={key} value={formData[key] || ""} onChange={handleChange} placeholder={label} className="form-control" /> : <p><strong>{label}:</strong> {renderValue(key)}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Job & Salary */}
          <section className="mb-4">
            <h4>Job & Salary Details</h4>
            <div className="info-grid row g-2">
              {[
                ["department", "Department"],
                ["service", "Service"],
                ["interviewDate", "Interview Date"],
                ["joiningDate", "Joining Date"],
                ["expectedSalary", "Expected Salary"],
                ["givenSalary", "Given Salary"],
                ["workingTime", "Working Time"]
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  {editMode ? <input type="text" name={key} value={formData[key] || ""} onChange={handleChange} placeholder={label} className="form-control" /> : <p><strong>{label}:</strong> {renderValue(key)}</p>}
                </div>
              ))}

              {/* Resume */}
              <div className="col-12">
                <p><strong>Resume:</strong> {employee.resumeFile ? <a href={employee.resumeFile} target="_blank" rel="noopener noreferrer">View</a> : "N/A"}</p>
                {editMode && <input type="file" name="resumeFile" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="form-control" />}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
