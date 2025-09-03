import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function AddDepartment() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        deptName: '',
        designation: ''
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('formdata', formData);
        const { deptName, designation } = formData;
        if (!deptName || !designation) {
            alert('All Field Required')
        }
        const data = new FormData()
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key])
        });
    
    try {
        const res = await axios.post('http://localhost:5000/api/add_department', formData)
        console.log('Department Added:', res.data);
        alert(' Department is added');
        setFormData({
            deptName: '',
            designation: ''
        })
        navigate('/admin/department')

    } catch (error) {
            console.error('Error submitting form:', error.response ? error.response.data : error.message);
            alert('Failed to submit form. ');

        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h3 className='text-center'> Add  Departments</h3>
                <div className='form p-3'>
                    <div className='form-input m-3'>
                        <input type='text' className="form-control" value={formData.deptName} onChange={handleChange} name='deptName' placeholder='Enter  Department Name' />
                    </div>
                    <div className='form-input m-3'>
                        <input type='text' className="form-control" value={formData.designation} onChange={handleChange} name="designation" placeholder='Enter Designation ' />
                    </div>
                    <div className='form-input m-3'>
                        <button
                            type="submit"
                            className="btn bg-dark-subtle  w-100 rounded-pill fw-bold">
                            Add Department
                        </button>
                    </div>
                </div>
            </form>


        </>
    )
}

export default AddDepartment