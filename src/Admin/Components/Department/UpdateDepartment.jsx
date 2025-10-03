import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function UpdateDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deptName, setDeptName] = useState("");

  // Fetch department details by ID
  useEffect(() => {
    axios.get(`http://localhost:5000/api/getDepartmentById/${id}`)
      .then(res => {
        if (res.data) {
          setDeptName(res.data.deptName);
        }
      })
      .catch(err => {
        console.error(err);
        alert("Error fetching department details");
      });
  }, [id]);

  // Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/updateDepartment/${id}`, { deptName });
      alert("Department updated successfully");
      navigate("/admin/department"); // ✅ go back to list
    } catch (error) {
      console.error(error);
      alert("Error updating department");
    }
  };

  return (
    <div className="container py-5" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4 text-center" style={{ color: "#1f3b98" }}>
                ✏️ Update Department
              </h3>

              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Department Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={deptName}
                    onChange={(e) => setDeptName(e.target.value)}
                    required
                  />
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4 fw-semibold"
                    onClick={() => navigate("/admin/department")}
                  >
                    ⬅️ Back
                  </button>

                  <button
                    type="submit"
                    className="btn px-4 fw-bold rounded-pill"
                    style={{
                      background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                      color: "white",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.15)"
                    }}
                  >
                    💾 Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateDepartment;
