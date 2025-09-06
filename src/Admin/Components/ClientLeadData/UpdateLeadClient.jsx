import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateLeadClient() {
    const { leadId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
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


    const [customSourse, setCustomSourse] = useState("");
    const [customService, setCustomService] = useState("");
    const [customStatus, setCustomStatus] = useState("");

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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        axios.get(`http://localhost:5000/api/getClientLeadbyId/${leadId}`)
            .then((res) => {
                const user = res.data.user || res.data;
                setFormData(
                    {
                        leadName: user.leadName || "",
                        emailId: user.emailId || "",
                        phoneNo: user.phoneNo || "",
                        sourse: user.sourse || "",
                        service: user.service || "",
                        project_type: user.project_type || "",
                        project_price: user.project_price || "",
                        start_date: user.start_date ? user.start_date.split("T")[0] : "",
                        deadline: user.deadline ? user.deadline.split("T")[0] : "",
                        startProjectDate: user.startProjectDate ? user.startProjectDate.split("T")[0] : "",
                        date: user.date ? user.date.split("T")[0] : "",
                        status: user.status || "",
                        assign: user.assign || "",
                        userType: user.userType || ""
                    }

                );
                console.log("API Response:", res.data);
            })
            .catch((err) => console.log(err));
    }, [leadId]);

  




    const handleSubmit = async (e) => {
        e.preventDefault();


        const updatedData = {
            ...formData,
            sourse: formData.sourse === "Other" ? customSourse : formData.sourse,
            service: formData.service === "Other" ? customService : formData.service,
            status: formData.status === "Other" ? customStatus : formData.status,
        };

        try {
            await axios.put(
                `http://localhost:5000/api/updateClientLead/${leadId}`,
                updatedData
            );

            alert("Client updated successfully!");

            // if (userType === "client") {
            //     navigate("/admin/client");
            // } else if (userType === "lead") {
            //     navigate("/admin/leads");
            // } else {
            //     navigate("/admin"); 
            // }

            navigate("/admin/client");

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
                    <label>Name</label>
                    <input
                        type="text"
                        name="leadName"
                        value={formData.leadName}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label>Email</label>
                    <input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>


                <div className="col-md-6">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label>Source</label>
                    <select
                        name="sourse"
                        value={formData.sourse}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Source</option>
                        <option value="Referral">Referral</option>
                        <option value="Website">Website</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Other">Other</option>
                    </select>
                    {formData.sourse === "Other" && (
                        <input
                            type="text"
                            placeholder="Enter custom source"
                            value={customSourse}
                            onChange={(e) => setCustomSourse(e.target.value)}
                            className="form-control mt-2"
                            required
                        />
                    )}
                </div>


                <div className="col-md-6">
                    <label>Service</label>
                    <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Service</option>
                        <option value="Web Development">Web Development</option>
                        <option value="App Development">App Development</option>
                        <option value="SEO">SEO</option>
                        <option value="Other">Other</option>
                    </select>
                    {formData.service === "Other" && (
                        <input
                            type="text"
                            placeholder="Enter custom service"
                            value={customService}
                            onChange={(e) => setCustomService(e.target.value)}
                            className="form-control mt-2"
                            required
                        />
                    )}
                </div>

                <div className="col-md-6">
                    <label>Project Type</label>
                    <input
                        type="text"
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>


                <div className="col-md-6">
                    <label>Project Price</label>
                    <input
                        type="text"
                        name="project_price"
                        value={formData.project_price}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>


                <div className="col-md-6">
                    <label>Start Date</label>
                    <input
                        type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>


                <div className="col-md-6">
                    <label>Deadline</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>


                <div className="col-md-6">
                    <label>Project Start Date</label>
                    <input
                        type="date"
                        name="startProjectDate"
                        value={formData.startProjectDate}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>


                <div className="col-md-6">
                    <label>Enquiry Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="col-md-6">
                    <label>Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Status</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Other">Other</option>
                    </select>
                    {formData.status === "Other" && (
                        <input
                            type="text"
                            placeholder="Enter custom status"
                            value={customStatus}
                            onChange={(e) => setCustomStatus(e.target.value)}
                            className="form-control mt-2"
                            required
                        />
                    )}
                </div>

                <div className="col-md-6">
                    <label>Assign To</label>
                    <select
                        name="assign"
                        value={formData.assign}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Employee</option>
                        {employee.map((emp) => (
                            <option key={emp._id} value={emp.ename}>
                                {emp.ename}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-md-6">
                    <label>User Type</label>
                    <select
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="client">Client</option>
                        <option value="lead">Lead</option>
                        <option value="employee">Employee</option>
                    </select>
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

export default UpdateLeadClient;
