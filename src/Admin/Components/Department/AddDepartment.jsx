import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddDepartment() {
    const [deptName, setDeptName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const res = await axios.post('http://localhost:5000/api/addDepartment', { deptName });
            alert(res.data.message);
            navigate('/admin/department');
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.message); 
            } else {
                alert("Something went wrong!");
            }
        }
    }

    return (
        <div className="container mt-5">
            <h3>Add Department</h3>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    value={deptName} 
                    onChange={(e) => setDeptName(e.target.value)} 
                    placeholder="Department Name" 
                    className="form-control mb-3"
                    required
                />
                <button type="submit" className="btn btn-dark form-control">Add</button>
            </form>
        </div>
    );
}

export default AddDepartment;
