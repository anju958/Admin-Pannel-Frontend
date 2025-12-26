import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function EmployeeTaskPage() {
  const { id } = useParams();
  const [emp, setEmp] = useState({});
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/tasks/employee/${id}`)
      .then((res) => {
        setEmp(res.data.employee);
        setTasks(res.data.tasks);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // 🔍 Filter tasks by search
 const filteredTasks = tasks.filter((t) => {
  const q = search.toLowerCase();

  return (
    (t.title ?? "").toLowerCase().includes(q) ||
    (t.projectId?.projectName ?? "").toLowerCase().includes(q) ||
    (t.status ?? "").toLowerCase().includes(q) ||
    (t.priority ?? "").toLowerCase().includes(q)
  );
});

  // 📤 Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredTasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(file, `${emp?.ename}_tasks.xlsx`);
  };
  useEffect(() => {
  console.log(tasks);
}, [tasks]);

  return (
    <div className="container mt-4">
      <h3>{emp?.ename}'s Task List</h3>
      <hr />

      {/* 🔍 Search + Export Buttons */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search Task, Project, Status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-success" onClick={exportToExcel}>
          ⬇️ Export Excel
        </button>
      </div>

      {/* Task Table */}
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Task</th>
            <th>Project</th>
            <th>Status</th>
            <th>Priority</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {filteredTasks.map((t) => (
            <tr key={t._id}>
              <td>{t.taskName}</td>
              <td>{t.projectName}</td>
              <td>{t.status}</td>
              <td>{t.priority}</td>
              <td>
                <Link
                  to={`/admin/TaskDetails/${t.taskId}`}
                  className="btn btn-info btn-sm"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}

          {filteredTasks.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                No tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}