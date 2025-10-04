
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from "../../../config";

function AddDepartment() {
  const [deptName, setDeptName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/addDepartment`, { deptName });
      alert(res.data.message);
      navigate('/admin/department');
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong!");
      }
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f9faff" }}>
      <div className="col-lg-6">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">

            {/* Heading */}
            <h3 className="fw-bold text-center mb-4" style={{ color: "#1f3b98" }}>
              ➕ Add New Department
            </h3>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="form-label fw-semibold">Department Name</label>
                <input
                  type="text"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="Enter Department Name"
                  className="form-control rounded-3 py-2"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100 py-2 fw-bold rounded-pill"
                style={{
                  background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                  color: "white",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.15)"
                }}
              >
                Add Department
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDepartment;
