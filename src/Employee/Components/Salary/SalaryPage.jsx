import React, { useState } from "react";

function SalaryPage() {
  const [salaryData, setSalaryData] = useState({
    basicSalary: "",
    deduction: "",
  });

  const handleChange = (e) => {
    setSalaryData({ ...salaryData, [e.target.name]: e.target.value });
  };

  // Convert to numbers & calculate Net Salary
  const basic = parseFloat(salaryData.basicSalary) || 0;
  const deduction = parseFloat(salaryData.deduction) || 0;
  const netSalary = basic - deduction;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Salary Details
        </h2>

        <div className="space-y-4">
          {/* Basic Salary */}
          <div>
            
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalaryPage;
