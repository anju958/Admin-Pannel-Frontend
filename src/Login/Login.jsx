import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { MdEmail, MdLock } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        official_email: '',
        password: ''
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        let res;
        try {
            if (formData.official_email === 'admin@gmail.com') {
                res = await axios.post('http://localhost:5000/api/adminLogin', formData)
            }
            else {
                res = await axios.post("http://localhost:5000/api/userLogin", formData);
            }
            localStorage.setItem("token", res.data.token);
            const user = {
                employeeId: res.data.employeeId,
                ename: res.data.ename,
                role: res.data.role,
                official_email: res.data.official_email,
            };
            localStorage.setItem("user", JSON.stringify(user));

            if (formData.official_email === 'admin@gmail.com') {
                navigate("/admin");
            } else {
                navigate("/employee");
            }
        } catch (err) {
            alert("Invalid login");
        }
    }

    return (
        <div className='container-fluid bg-body-secondary'>
            <div className='row'>
                <div className='col-md-6'>
                    <div className='register'>
                        <h1>Welcome ,Company Name!</h1>
                        <h5>Don't have an account?</h5>
                        <Link to="/RegisterationForm" class="btn btn-light" type='submit'>Register</Link>
                    </div>
                </div>
                <div className='col-md-6'>
                    <div className='  d-flex justify-content-center align-items-center vh-100 bg-light login'>
                        <div className='formData card shadow-lg p-4 ' style={{ width: "600px", height: '500px' }}>
                            <div className=' heading  text-center mb-4 fw-bold'>Login</div>
                            <form onSubmit={handleSubmit}>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">
                                        <MdEmail />
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name='official_email'
                                        placeholder="Enter your Email id"
                                        onChange={handleChange}

                                    />
                                </div>
                                <div className="input-group mb-3">
                                    <span className="input-group-text">
                                        <MdLock />
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name='password'
                                        placeholder="Enter your Password"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="input-group mb-3">
                                    <span>Forget Password ? </span>
                                </div>
                                <button
                                    type="submit"
                                    className="btn bg-dark-subtle  w-100 rounded-pill fw-bold">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Login