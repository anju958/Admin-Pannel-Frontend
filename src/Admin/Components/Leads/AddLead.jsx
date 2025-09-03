
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddLead() {
    const navigate = useNavigate()
    const [Lead, setLead] = useState({
        leadName: '',
        emailId: '',
        phoneNo: '',
        sourse: '',
        service: '',
        date: '',
        status: '',
        assign: '',
        userType:""


    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLead((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { leadName, emailId, phoneNo, sourse, service, date, status, assign ,userType} = Lead;
        if (!leadName || !emailId || !phoneNo || !sourse || !service || !date || !status || !assign || !userType) {
            alert('All fields are required');
            return;
        }
        try {
            const res = await axios.post('http://localhost:5000/api/addLead', Lead)
            alert("Lead Scuessfully Entered")
            navigate('/admin/Leads')
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong, try again");
            }
        }
    }

    return (
        <>
            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-12'>
                        <form encType='multipart-form-data' onSubmit={handleSubmit}>
                            <h3 className='text-center'>Add Leads</h3>
                            <div className='form p-3 '>
                                <div className='form-input m-3'>
                                    <input type='text' onChange={handleChange} value={Lead.leadName} name='leadName' className="form-control" placeholder='Enter Employee  Name' />
                                </div>
                                <div className='form-input m-3'>
                                    <input type='email' onChange={handleChange} value={Lead.emailId} name="emailId" className="form-control" placeholder='Enter Email id' />
                                </div>
                                <div className='form-input m-3'>
                                    <input type='text' onChange={handleChange} value={Lead.phoneNo} name='phoneNo' className="form-control" placeholder='Enter Phone Number' />
                                </div>
                                <div className='form-input m-3'>
                                    <input type='text' onChange={handleChange} value={Lead.sourse} name="sourse" className="form-control" placeholder='Enter Source' />
                                </div>
                                <div className='form-input m-3'>
                                    <input type='text' onChange={handleChange} value={Lead.service} name='service' className="form-control" placeholder='Enter Service' />
                                </div>
                                <div className='form-input m-3'>
                                    Select  Date
                                    <input type='date' onChange={handleChange} value={Lead.date} name='date' className="form-control" placeholder='Select interview Date' />
                                </div>
                                <div className='form-input m-3'>

                                    <input type='text' onChange={handleChange} value={Lead.status} name='status' className="form-control" placeholder='Enter status' />
                                </div>
                                <div className='form-input m-3'>
                                    <label className="form-label">Assigned To</label>
                                    <select
                                        className="form-select"
                                        value={Lead.assign}
                                        name='assign'
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Payal">Payal</option>
                                        <option value="Deepika">Deepika</option>
                                    </select>

                                </div>

                                <div className='form-input m-3'>
                                    <label className="form-label">User Type</label>
                                    <select
                                        className="form-select"
                                        value={Lead.userType}
                                        name='userType'
                                        onChange={handleChange}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="client">Client</option>
                                        <option value="lead">Lead</option>
                                    </select>

                                </div>
                                <div className='form-input m-3'>
                                    <button
                                        type="submit"
                                        className="btn bg-dark-subtle  w-100 rounded-pill fw-bold">
                                        Enter Lead
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AddLead