import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function EmployeeListPage() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ⏳ Debounce Search for smooth typing
  useEffect(() => {
    const delay = setTimeout(() => setDebouncedSearch(search), 200);
    return () => clearTimeout(delay);
  }, [search]);

  // Fetch Employee & Project list
  useEffect(() => {
    axios
      .get(`${API_URL}/api/employeeListProject`)
      .then((res) => setList(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔍 Search EXACTLY like Employee table logic
  const filteredList = list.filter((emp) => {
  const q = debouncedSearch.toLowerCase();

  return (
    emp.employeeName?.toLowerCase().includes(q) ||
    emp.projectName?.toLowerCase().includes(q) ||
    emp.clientName?.toLowerCase().includes(q) ||
    emp.status?.toLowerCase().includes(q) ||
    String(emp.startDate)?.toLowerCase().includes(q) ||
    String(emp.endDate)?.toLowerCase().includes(q)
  );
});

  // ⬇️ Export Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(file, `Employee_Project_List.xlsx`);
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-3">Employees & Projects</h3>

      {/* Search + Export */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search employee, project, client, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-success" onClick={exportToExcel}>
          ⬇️ Export Excel
        </button>
      </div>

      {/* Table */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Project</th>
            <th>Client</th>
            <th>Status</th>
            <th>Start</th>
            <th>End</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {filteredList.map((emp) => (
            <tr key={emp.employeeId}>
              <td>{emp.employeeName}</td>
              <td>{emp.projectName}</td>
              <td>{emp.clientName}</td>
              <td>{emp.status}</td>
              <td>{emp.startDate}</td>
              <td>{emp.endDate}</td>

              <td>
                <Link
                  to={`/admin/EmployeeTasks/${emp.employeeId}`}
                  className="btn btn-primary btn-sm"
                >
                  View Tasks
                </Link>
              </td>
            </tr>
          ))}

          {/* No Results */}
          {filteredList.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">No matching records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}