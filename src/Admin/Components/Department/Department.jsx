import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
function Department() {
    const [Dept, setDept] = useState([])
    useEffect(() => {
        axios('http://localhost:5000/api/get_Department')
            .then(res => {
                if (res.data) {
                    setDept(res.data)
                }
                else {
                    alert(res.data.Error)
                }

            })

    }, [])
    return (
        <>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-12'>
                        <form>
                            <h3 className='text-center'>View  Departments</h3>
                            <div className='form-input m-3'>
                                <Link to="/admin/addDepartment"
                                    type="submit"
                                    className="btn bg-dark-subtle  w-10 rounded-pill fw-bold">
                                    Add Department
                                </Link>
                            </div>
                        </form>
                        <div className="container mt-4">
                            <table className="table table-bordered table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Dept. ID</th>
                                        <th>Department Name</th>
                                        <th>Designation</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        Dept.map(dept => (
                                            <tr>
                                                <td>{dept.deptId}</td>
                                                <td>{dept.deptName}</td>
                                                <td><ul>
                                                    {dept.designation?.map((d, index) => (
                                                        <li  className="list1" key={index}>{d}</li>
                                                    ))}
                                                </ul></td>
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

export default Department