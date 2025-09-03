import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateEmp() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ename: "",
    dateOfBirth: "",
    gender: "",
    phoneNo: "",
    personal_email: "",
    official_email: "",
    fatherName: "",
    motherName: "",
    address: "",
    emergencyContact: "",
    relation: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    accountHolderName: "",
    adarCardNo: "",
    panNo: "",
    qualification: "",
    lastExp: "",
    expWithPWT: "",
    deptName: "",
    designation: "",
    interviewDate: "",
    joiningDate: "",
    expectedSalary: "",
    givenSalary: "",
    workingTime: "",
    userType: ""
  });

  const [resumeFile, setResumeFile] = useState(null);


  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getEmpDataByID/${employeeId}`)
      .then((res) => {
        // console.log(res.data)
        setFormData(res.data);
      })
      .catch((err) => console.log(err));
  }, [employeeId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });


    if (resumeFile) {
      data.append("resumeFile", resumeFile);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/updateSignUser/${employeeId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Employee updated successfully!");
      if (formData.userType === "employee") {
        navigate("/admin/Employee");
      }
      else {
        navigate("/admin/trainee");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating employee: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Update User</h3>
      <form onSubmit={handleSubmit} className="row g-3">

        <div className="col-md-6">
          <label>Employee Name</label>
          <input
            type="text"
            name="ename"
            value={formData.ename}
            onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="col-md-6">
          <label>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth?.split("T")[0] || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="col-md-6">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="col-md-6">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="col-md-6">
          <label>Personal Email</label>
          <input
            type="email"
            name="personal_email"
            value={formData.personal_email}
            onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="col-md-6">
          <label>Official Email</label>
          <input
            type="email"
            name="official_email"
            value={formData.official_email}
            onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="col-md-6">
          <label>Father Name</label>
          <input
            type="text"
            name="fatherName"
            value={formData.fatherName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Mother Name</label>
          <input
            type="text"
            name="motherName"
            value={formData.motherName}
            onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="col-md-12">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="col-md-6">
          <label>Relation</label>
          <input
            type="text"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Bank Name</label>
          <input
            type="text"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Account No</label>
          <input
            type="text"
            name="accountNo"
            value={formData.accountNo}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>IFSC Code</label>
          <input
            type="text"
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Account Holder Name</label>
          <input
            type="text"
            name="accountHolderName"
            value={formData.accountHolderName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Aadhar Card No</label>
          <input
            type="text"
            name="adarCardNo"
            value={formData.adarCardNo}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>PAN No</label>
          <input
            type="text"
            name="panNo"
            value={formData.panNo}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Qualification</label>
          <input
            type="text"
            name="qualification"
            value={formData.qualification}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Last Experience</label>
          <input
            type="text"
            name="lastExp"
            value={formData.lastExp}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Experience with PWT</label>
          <input
            type="text"
            name="expWithPWT"
            value={formData.expWithPWT}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Department</label>
          <input
            type="text"
            name="deptName"
            value={formData.deptName}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Interview Date</label>
          <input
            type="date"
            name="interviewDate"
            value={formData.interviewDate?.split("T")[0] || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Joining Date</label>
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate?.split("T")[0] || ""}
            onChange={handleChange}
            className="form-control"
          />
        </div>


        <div className="col-md-6">
          <label>Expected Salary</label>
          <input
            type="text"
            name="expectedSalary"
            value={formData.expectedSalary}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Given Salary</label>
          <input
            type="text"
            name="givenSalary"
            value={formData.givenSalary}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label>Working Time</label>
          <input
            type="text"
            name="workingTime"
            value={formData.workingTime}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="col-md-12">
          <label>Upload Resume</label>
          <input
            type="file"
            name="resumeFile"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>

        <div className="col-md-12 text-center mt-3">
          <button type="submit" className="btn btn-success">
            Update User
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEmp;
