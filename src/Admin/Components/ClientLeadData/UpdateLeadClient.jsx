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
    useEffect(() => {
        axios
            .get(`http://localhost:5000/api/getEmpDataByID/${leadId}`)
            .then((res) => {
                // console.log(res.data)
                setFormData(res.data);
            })
            .catch((err) => console.log(err));
    }, [leadId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            await axios.put(
                `http://localhost:5000/api/updateClientLead/${leadId}`,
                data,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            alert("Employee updated successfully!");
            if (formData.userType === "employee") {
                navigate("/admin/Employee");
            }
            else {
                navigate("/admin/clients");
            }
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
                    />
                </div>


                <div className="col-md-6">
                    <label>Date of Birth</label>
                    <input
                        type="email"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleChange}
                        className="form-control"
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
                    />
                </div>


                <div className="col-md-6">
                    <label>Personal Email</label>
                    <input
                        type="text"
                        name="sourse"
                        value={formData.sourse}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>


                <div className="col-md-6">
                    <label>Service</label>
                    <input
                        type="email"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>


                <div className="col-md-6">
                    <label>Project Type</label>
                    <input
                        type="text"
                        name="project_type"
                        value={formData.project_type}
                        onChange={handleChange}
                        className="form-control"
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
                    />
                </div>


                <div className="col-md-12">
                    <label>Start Date</label>
                    <input type="date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-6">
                    <label>DeadLine</label>
                    <input
                        type="text"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>


                <div className="col-md-6">
                    <label>Project Start Date</label>
                    <input
                        type="text"
                        name="startProjectDate"
                        value={formData.startProjectDate}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-6">
                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-6">
                    <label>Status</label>
                    <input
                        type="text"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-6">
                    <label>Assign</label>
                    <input
                        type="text"
                        name="assign"
                        value={formData.assign}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="col-md-6">
                    <label>User Type</label>
                    <input
                        type="text"
                        name="userType"
                        value={formData.userType}
                        onChange={handleChange}
                        className="form-control"
                    />
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
