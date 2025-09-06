
import {  useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';  

function AddEmployee() {
  const [formData, setFormData] = useState({
    ename: '',
    dateOfBirth: '',
    gender: '',
    phoneNo: '',

    personal_email: '',
    official_email: '',
    password: '',
    fatherName: '',
    motherName: '',
    address: '',
    emergencyContact: '',
    relation: '',

    bankName: '',
    accountNo: '',
    ifscCode: '',
    accountHolderName: '',

    adarCardNo: '',
    panNo: '',
    qualification: '',
    lastExp: '',
    expWithPWT: '',

    deptName: '',
    designation: '',
    interviewDate: '',
    joiningDate: '',
    expectedSalary: '',
    givenSalary: '',
    workingTime: '',
    resumeFile: null,
    userType: '',
    traineeDuration: '',

  });
  const navigate = useNavigate()

  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/getDepartmentNamee')
      .then(res => setDepartments(res.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleDeptChange = async (e) => {
    const deptName = e.target.value;
    setFormData(prev => ({ ...prev, deptName, designation: '' }));
    setDesignations([]);

    if (!deptName) return;

    try {
      const res = await axios.get('http://localhost:5000/api/getDesignation', { params: { deptName } });
      setDesignations(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const requiredFields = [
        "ename", "dateOfBirth", "gender", "phoneNo",
        "personal_email", "official_email", "password", "fatherName",
        "motherName", "address", "emergencyContact", "relation",
        "bankName", "accountNo", "ifscCode", "accountHolderName",
        "adarCardNo", "panNo", "qualification", "lastExp", "expWithPWT",
        "deptName", "designation", "interviewDate", "joiningDate",
        "expectedSalary", "givenSalary", "workingTime",
        "resumeFile", "userType", "traineeDuration"
      ];

      for (let field of requiredFields) {
        if (!formData[field] || formData[field] === "") {

          if (field === "traineeDuration" && formData.userType !== "trainee") {
            continue;
          }

          alert(`${field} is required`);
          return;
        }
      }

      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      const res = await axios.post('http://localhost:5000/api/signUp', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Registration Completed ');
      console.log(res.data);

      setFormData({
        ename: '', dateOfBirth: '', gender: '', phoneNo: '',
        personal_email: '', official_email: '', password: '', fatherName: '',
        motherName: '', address: '', emergencyContact: '',
        relation: '', bankName: '', accountNo: '', ifscCode: '',
        accountHolderName: '', adarCardNo: '',
        panNo: '', qualification: '', lastExp: '', expWithPWT: '', deptName: '',
        designation: '', interviewDate: '', joiningDate: '', expectedSalary: '', givenSalary: '',
        workingTime: '', resumeFile: null, userType: '', traineeDuration: ''
      });
      navigate('/admin/trainee')
    } catch (error) {
      console.error(error);
      alert('Failed to submit form.');
    }
  };
  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-12'>
            <form onSubmit={handleSubmit}>
              <h3 className=" text-center mb-3">Add Employee</h3>
             
              <h5 className="mb-3">Personal Information</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  Employee Full Name
                  <input type="text" className="form-control" name="ename"
                    value={formData.ename} onChange={handleChange} placeholder="Full Emplyee Name" />
                </div>
                <div className="col-md-6">
                  Date of Birth
                  <input type="date" className="form-control" name="dateOfBirth"
                    value={formData.dateOfBirth} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  Gender
                  <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-md-6">
                  Contact Number
                  <input type="text" className="form-control" name="phoneNo"
                    value={formData.phoneNo} onChange={handleChange} placeholder="Phone Number" />
                </div>
              </div>

              
              <h5 className="mb-3">Contact & Login</h5>
              <div className="row mb-3">
                <div className="col-md-6">

                  Personal Email
                  <input type="email" className="form-control" name="personal_email"
                    value={formData.personal_email} onChange={handleChange} placeholder="Personal Email" />
                </div>
                <div className="col-md-6">
                  Official Email
                  <input type="email" className="form-control" name="official_email"
                    value={formData.official_email} onChange={handleChange} placeholder="Official Email" />
                </div>
              </div>

              <div className="mb-3">
                Password
                <input type="password" className="form-control" name="password"
                  value={formData.password} onChange={handleChange} placeholder="Password" />
              </div>

             
              <h5 className="mb-3">Family Information</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  Father name
                  <input type="text" className="form-control" name="fatherName"
                    value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" />
                </div>
                <div className="col-md-6">
                  Mother Name
                  <input type="text" className="form-control" name="motherName"
                    value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" />
                </div>
              </div>

              <div className="mb-3">
                Address
                <input type="text" className="form-control" name="address"
                  value={formData.address} onChange={handleChange} placeholder="Address" />
              </div>
              <div className="mb-3">
                Emergency Contact
                <input type="text" className="form-control" name="emergencyContact"
                  value={formData.emergencyContact} onChange={handleChange} placeholder="emergencyContact" />
              </div>
              <div className="mb-3">
                Relation with Emergency Contact
                <input type="text" className="form-control" name="relation"
                  value={formData.relation} onChange={handleChange} placeholder="Relation with Emergency Contact " />
              </div>


           
              <h5 className="mb-3">Bank Account Information</h5>
              <div className="mb-3">
                Bank Name
                <input type="text" className="form-control" name="bankName"
                  value={formData.bankName} onChange={handleChange} placeholder="Bank Name" />
              </div>
              <div className="mb-3">
                Account Number
                <input type="text" className="form-control" name="accountNo"
                  value={formData.accountNo} onChange={handleChange} placeholder="Account Number" />
              </div>
              <div className="mb-3">
                IFSC Code
                <input type="text" className="form-control" name="ifscCode"
                  value={formData.ifscCode} onChange={handleChange} placeholder="IFSC Code" />
              </div>
              <div className="mb-3">
                Account Holder Name
                <input type="text" className="form-control" name="accountHolderName"
                  value={formData.accountHolderName} onChange={handleChange} placeholder="Account Holder Name" />
              </div>
              <div className="mb-3">
                Addar Card Number
                <input type="text" className="form-control" name="adarCardNo"
                  value={formData.adarCardNo} onChange={handleChange} placeholder="Aadar Card Number" />
              </div>
              <div className="mb-3">
                Pan Card Number
                <input type="text" className="form-control" name="panNo"
                  value={formData.panNo} onChange={handleChange} placeholder="Pan Card Number" />
              </div>

              
              <h5 className="mb-3">Qualification and  Experience</h5>
              <div className="row mb-3">
                <div className="col-md-6">
                  Qualification
                  <input type="text" className="form-control" name="qualification"
                    value={formData.qualification} onChange={handleChange} placeholder="Qualification" />
                </div>
                <div className="col-md-6">
                  Last Experience
                  <input type="text" className="form-control" name="lastExp"
                    value={formData.lastExp} onChange={handleChange} placeholder="Last Experience" />
                </div>
                <div className="col-md-6">
                  Experience  with PWT
                  <input type="text" className="form-control" name="expWithPWT"
                    value={formData.expWithPWT} onChange={handleChange} placeholder=" Experience  with PWT" />
                </div>
              </div>
              
              <h5 className="mb-3">Job Information</h5>
              <div className="form-input m-3">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  name="deptName"
                  value={formData.deptName}
                  onChange={handleDeptChange}
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.deptId} value={d.deptName}>{d.deptName}</option>
                  ))}
                </select>
              </div>

              <div className="form-input m-3">
                <label className="form-label">Designation</label>
                <select
                  className="form-select"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={!designations.length}
                >
                  <option value="">{designations.length ? 'Select Designation' : 'Select a department first'}</option>
                  {designations.map((title, i) => (
                    <option key={i} value={title}>{title}</option>
                  ))}
                </select>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  Interview Date
                  <input type="date" className="form-control" name="interviewDate"
                    value={formData.interviewDate} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  Joining Date
                  <input type="date" className="form-control" name="joiningDate"
                    value={formData.joiningDate} onChange={handleChange} />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  Expected Salary
                  <input type="text" className="form-control" name="expectedSalary"
                    value={formData.expectedSalary} onChange={handleChange} placeholder="Expected Salary" />
                </div>
                <div className="col-md-6">
                  Given Salary
                  <input type="text" className="form-control" name="givenSalary"
                    value={formData.givenSalary} onChange={handleChange} placeholder="Given Salary" />
                </div>

                <div className="col-md-6">
                  Working Hours
                  <input type="text" className="form-control" name="workingTime"
                    value={formData.workingTime} onChange={handleChange} placeholder="Working Hours" />
                </div>
              </div>

            
              <div className="mb-3">
                <label className="form-label">Upload Resume</label>
                <input type="file" className="form-control" name="resumeFile"
                  onChange={handleChange} accept=".pdf,.doc,.docx" />
              </div>

              <div className="mb-3">
                <label className="form-label">Employee Type</label>
                <select className="form-select" name="userType" value={formData.userType} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="employee">Employee</option>
                  <option value="trainee">Trainee</option>
                  <option value='intern'>Intern</option>
                </select>
              </div>

              {formData.userType === 'trainee' && (
                <div className="mb-3">
                  <label className="form-label">Trainee Duration</label>
                  <select className="form-select" name="traineeDuration"
                    value={formData.traineeDuration} onChange={handleChange}>
                    <option value="">Select Duration</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                  </select>
                </div>
              )}

            
              <div className="text-center">
                <button type="submit" className="btn btn-primary px-5">Add Employee</button>
              </div>

            </form>
          </div>
        </div>
      </div>

    </>
  )
}

export default AddEmployee