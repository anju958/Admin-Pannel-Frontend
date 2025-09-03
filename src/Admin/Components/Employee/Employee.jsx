
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import UpdateEmp from './UpdateEmp'


function Employee() {
    const [employee, setEmployee] = useState([])
    const navigate = useNavigate()
    console.log(employee)

    const handleDelete = async (employeeId) => {
        const answer = prompt("type Yes if you want to delete user");
        if (!answer || answer.toLowerCase() !== "yes") {
            alert("Delete cancelled!");
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/deleteSignUpUser/${employeeId}`);
            setEmployee(employee.filter(emp => emp.employeeId !== employeeId));
            alert("Employee deleted successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to delete employee");
        }
    };

    useEffect(() => {
        axios.get('http://localhost:5000/api/getemployeeData').
            then(result => {
                if (result.data) {
                    setEmployee(result.data)
                }
                else {
                    alert(result.data.Error)
                }
            })

    }, [])

   


    return (
        <>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-12'>
                        <div className="container mt-4">
                            <h3 className="text-center">Employee List</h3>
                            <div className='form-input m-3'>
                                <Link to="/admin/addemployee"
                                    type="submit"
                                    className="btn bg-dark-subtle  w-10 rounded-pill fw-bold">
                                    Add Employee
                                </Link>
                            </div>
                            <table className="table table-striped table-bordered mt-3">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Emp_Id</th>
                                        <th>Name</th>
                                        <th>DOB</th>
                                        <th>Gender</th>
                                        <th>Phone No.</th>
                                        <th>Personal Email</th>
                                        <th>Official Email</th>
                                        <th>Father Name</th>
                                        <th>Mother Name</th>
                                        <th>Address</th>
                                        <th>Emergency Contact</th>
                                        <th>Relation</th>
                                        <th>Bank Name</th>
                                        <th>Account Number</th>
                                        <th>IFSC Code</th>
                                        <th>Account Holder Name</th>
                                        <th>Aadar Card No.</th>
                                        <th>PAN No.</th>
                                        <th>Qualification</th>
                                        <th>Last Experience</th>
                                        <th>Experience with PWT</th>
                                        <th>Department</th>
                                        <th>Designation</th>
                                        <th>Interview Date</th>
                                        <th>Joining Date</th>
                                        <th>Expected Salary</th>
                                        <th>Given Salary</th>
                                        <th>Woking Time</th>
                                        <th>Resume</th>
                                        <th> User Type</th>
                                        <th>Action</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        employee.map(emp => (
                                            <tr>
                                                <td>{emp.employeeId}</td>
                                                <td>{emp.ename}</td>
                                                <td>{emp.dateOfBirth}</td>
                                                <td>{emp.gender}</td>
                                                <td>{emp.phoneNo}</td>
                                                <td>{emp.personal_email}</td>
                                                <td>{emp.official_email}</td>
                                                {/* <td>{emp.password}</td> */}
                                                <td>{emp.fatherName}</td>
                                                <td>{emp.motherName}</td>
                                                <td>{emp.address}</td>
                                                <td>{emp.emergencyContact}</td>
                                                <td>{emp.relation}</td>
                                                <td>{emp.bankName}</td>
                                                <td>{emp.accountNo}</td>
                                                <td>{emp.ifscCode}</td>
                                                <td>{emp.accountHolderName}</td>
                                                <td>{emp.adarCardNo}</td>
                                                <td>{emp.panNo}</td>
                                                <td>{emp.qualification}</td>
                                                <td>{emp.lastExp}</td>
                                                <td>{emp.expWithPWT}</td>
                                                <td>{emp.deptName}</td>
                                                <td>{emp.designation}</td>
                                                <td>{emp.interviewDate ? new Date(emp.interviewDate).toISOString().split("T")[0] : ""}</td>
                                                <td>{emp.joiningDate ? new Date(emp.joiningDate).toISOString().split("T")[0] : ""}</td>
                                                <td>{emp.expectedSalary}</td>
                                                <td>{emp.givenSalary}</td>
                                                <td>{emp.workingTime}</td>
                                                <td>
                                                    {emp.resumeFile ? (<a href={`http://localhost:5000/uploads/resumes/${emp.resumeFile}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer">
                                                        View Resume
                                                    </a>

                                                    ) : (
                                                        "No Resume"
                                                    )}
                                                </td>
                                                <td>{emp.userType}</td>
                                                <td>
                                                    <button class="btn btn-success btn-sm me-2"
                                                        onClick={() => navigate(`/admin/upDateUder/${emp.employeeId}`)}
                                                    >
                                                        Update
                                                    </button>
                                                    <button class="btn btn-danger btn-sm" onClick={() => { handleDelete(emp.employeeId) }}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}

export default Employee