import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ClientLeadData() {
    const navigate = useNavigate();
    const [Lead, setLead] = useState({
        leadName: '',
        emailId: '',
        phoneNo: '',
        sourse: '',
        service: '',
        project_type: '',
        project_price: '',
        start_date: '',
        deadline: '',
        startProjectDate: '',
        date: '',
        status: '',
        assign: '',
        userType: ''
    });
    const [employee, setEmployee] = useState([])
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLead((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...Lead,
            sourse: Lead.sourse === "Other" ? Lead.customSource : Lead.sourse,
            service: Lead.service === "Other" ? Lead.customService : Lead.service,
            status: Lead.status === "Other" ? Lead.customStatus : Lead.status
        };


        const { leadName, emailId, phoneNo, sourse, service, project_type, project_price, start_date, deadline, startProjectDate, date, status, assign, userType } = payload;
        if (!leadName || !emailId || !phoneNo || !sourse || !service || !project_type || !project_price || !start_date || !deadline || !startProjectDate || !date || !status || !assign || !userType) {
            alert('All fields are required');
            return;
        }
        try {
            await axios.post('http://localhost:5000/api/genClientLead', Lead);
            alert("Lead Successfully Entered");
            navigate('/admin/client');
        } catch (error) {
            if (error.response && error.response.status === 400) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong, try again");
            }
        }
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-12'>
                    <form encType='multipart/form-data' onSubmit={handleSubmit}>
                        <h3 className='text-center'>Add Client/Lead</h3>
                        <div className='form p-3'>
                            <div className='form-group m-3'>
                                <label>Employee Name</label>
                                <input
                                    type='text'
                                    name='leadName'
                                    value={Lead.leadName}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder='Enter Employee Name'
                                />
                            </div>
                            <div className='form-group m-3'>
                                <label>Email ID</label>
                                <input
                                    type='email'
                                    name='emailId'
                                    value={Lead.emailId}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder='Enter Email ID'
                                />
                            </div>
                            <div className='form-group m-3'>
                                <label>Phone Number</label>
                                <input
                                    type='text'
                                    name='phoneNo'
                                    value={Lead.phoneNo}
                                    onChange={handleChange}
                                    className="form-control"
                                    placeholder='Enter Phone Number'
                                />
                            </div>
                            <div className="form-group m-3">
                                <label>Source</label>
                                <select
                                    name="sourse"
                                    value={Lead.sourse}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Source</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Website">Website</option>
                                    <option value="LinkedIn">LinkedIn</option>
                                    <option value="Other">Other</option>
                                </select>
                                {Lead.sourse === "Other" && (
                                    <input
                                        type="text"
                                        name="customSource"
                                        value={Lead.customSource}
                                        onChange={handleChange}
                                        className="form-control mt-2"
                                        placeholder="Enter custom source"
                                    />
                                )}
                            </div>
                            <div className="form-group m-3">
                                <label>Service</label>
                                <select
                                    name="service"
                                    value={Lead.service}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Service</option>
                                    <option value="Web Development">Web Development</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="SEO">SEO</option>
                                    <option value="Other">Other</option>
                                </select>
                                {Lead.service === "Other" && (
                                    <input
                                        type="text"
                                        name="customService"
                                        value={Lead.customService}
                                        onChange={handleChange}
                                        className="form-control mt-2"
                                        placeholder="Enter custom service"
                                    />
                                )}
                            </div>
                            <div className='form-group m-3'>
                                <label>Project Type</label>
                                <input
                                    type='text'
                                    name='project_type'
                                    value={Lead.project_type}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className='form-group m-3'>
                                <label>Project Price</label>
                                <input
                                    type='text'
                                    name='project_price'
                                    value={Lead.project_price}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>

                            <div className='form-group m-3'>
                                <label>Start Date</label>
                                <input
                                    type='date'
                                    name='start_date'
                                    value={Lead.start_date}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className='form-group m-3'>
                                <label>Deadline</label>
                                <input
                                    type='date'
                                    name='deadline'
                                    value={Lead.deadline}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className='form-group m-3'>
                                <label>When Start Project</label>
                                <input
                                    type='date'
                                    name='startProjectDate'
                                    value={Lead.startProjectDate}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className='form-group m-3'>
                                <label>Enquery Date</label>
                                <input
                                    type='date'
                                    name='date'
                                    value={Lead.date}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group m-3">
                                <label>Status</label>
                                <select
                                    name="status"
                                    value={Lead.status}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Other">Other</option>
                                </select>
                                {Lead.status === "Other" && (
                                    <input
                                        type="text"
                                        name="customStatus"
                                        value={Lead.customStatus}
                                        onChange={handleChange}
                                        className="form-control mt-2"
                                        placeholder="Enter custom status"
                                    />
                                )}
                            </div>

                            <div className="form-group m-3">
                                <label>Assigned To</label>
                                <select
                                    name="assign"
                                    value={Lead.assign}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Employee</option>
                                    {employee.map((emp) => (
                                        <option key={emp._id} value={emp.ename}>
                                            {emp.ename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='form-group m-3'>
                                <label>User Type</label>
                                <select
                                    name='userType'
                                    value={Lead.userType}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="">Select Type</option>
                                    <option value="client">Client</option>
                                    <option value="lead">Lead</option>
                                </select>
                            </div>
                            <div className='form-group m-3'>
                                <button type="submit" className="btn bg-dark-subtle w-100 rounded-pill fw-bold">
                                    Enter Lead
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ClientLeadData;
