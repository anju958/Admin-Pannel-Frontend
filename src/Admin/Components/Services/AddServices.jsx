import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddServices() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    deptId: '',    
    serviceName: ''
  });

  
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getDepartment");
        setDepartments(res.data); 
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { deptId, serviceName } = formData;

    if (!deptId || !serviceName) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/addService", formData);
      console.log("Service Added:", res.data);
      alert("Service added successfully");

      
      setFormData({ deptId: '', serviceName: '' });

      navigate('/admin/Service');
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      alert("Failed to submit form");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3 className="text-center">Add Service</h3>
        <div className="form p-3">
       
          <div className="form-input m-3">
            <label>Service Name</label>
            <input 
              type="text" 
              className="form-control"
              value={formData.serviceName}
              onChange={handleChange}
              name="serviceName"
              placeholder="Enter Service Name"
            />
          </div>

          
          <div className="form-input m-3">
            <label>Select Department</label>
            <select 
              className="form-control"
              name="deptId"
              value={formData.deptId}
              onChange={handleChange}
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

         
          <div className="form-input m-3">
            <button
              type="submit"
              className="btn bg-dark-subtle w-100 rounded-pill fw-bold"
            >
              Add Service
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default AddServices;
