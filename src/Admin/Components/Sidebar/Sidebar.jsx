import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar() {
    return (
        <>
            <div className='sidebar'>
                <div className="d-flex">
                    <div className="bg-success p-2 text-dark bg-opacity-25 text-black p-3 vh-100" style={{ width: "250px" }}>
                        <h4 className='p-3'>Admin DashBoard</h4>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link to="/admin/home" className="nav-link text-black list" href="#">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/jobopening" className="nav-link text-black list" href="#">Job Opening</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/department" className="nav-link text-black list" href="#">Departments</Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link to="/admin/employee" className="nav-link text-black list" href="#">Employees</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/trainee" className="nav-link text-black list" href="#">Trainee and Intern</Link>
                            </li>
                             <li className="nav-item">
                                <Link to="/admin/leads" className="nav-link text-black list" href="#">Leads</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/client" className="nav-link text-black  list" href="#">Clients</Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link to="/admin/attendance" className="nav-link text-black list" href="#">Attendance</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/admin/Roles" className="nav-link text-black list" href="#">Roles and Permissions</Link>
                            </li>
                           
                            <li className="nav-item">
                                <Link className="nav-link text-black list" href="#">Proposals</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-black list" href="#">Invoices</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-black list" href="#">Reports</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-black list" href="#">Notice Board</Link>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Sidebar