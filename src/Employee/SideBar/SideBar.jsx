import React from 'react'
import { Link } from 'react-router-dom'

function SideBar() {
  return (
    <>
         <div className='sidebar'>
                <div className="d-flex">
                    <div className="bg-success p-2 text-dark bg-opacity-25 text-black p-3 vh-100" style={{ width: "250px" }}>
                        <h4 className='p-3'>Employee DashBoard</h4>
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link to="" className="nav-link text-black list" href="#">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/employee/employeeattendance" className="nav-link text-black list" href="#">Attendance</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="" className="nav-link text-black list" href="#">Leaves</Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link to="" className="nav-link text-black list" href="#">Salary</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="" className="nav-link text-black list" href="#">Task</Link>
                            </li>
                             <li className="nav-item">
                                <Link to="" className="nav-link text-black list" href="#">Performance</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="" className="nav-link text-black  list" href="#">Support/Helpdesk</Link>
                            </li>
                            
                            <li className="nav-item">
                                <Link to="" className="nav-link text-black list" href="#">Profile</Link>
                            </li>
                            
                            
                        </ul>
                    </div>
                </div>
            </div>
    
    
    
    </>
  )
}

export default SideBar