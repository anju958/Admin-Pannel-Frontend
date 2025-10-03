
import React from 'react';


function EmployeeProfile({ employee = {} }) {
  return (
    <div className="profile-page">
      <h2 className="page-title">Employee Profile</h2>

      <div className="profile-container">
        {/* Left panel: image and basic info */}
        <div className="profile-left">
          <img
            src={employee.image || '/default-avatar.png'}
            alt="Profile"
            className="profile-image"
          />
          <h3>{employee.name || 'N/A'}</h3>
          <p><strong>Employee ID:</strong> {employee.empId || 'N/A'}</p>
          <p><strong>User Type:</strong> {employee.userType || 'N/A'}</p>
        </div>

        {/* Right panel: all detailed sections */}
        <div className="profile-right">

          {/* Personal Information */}
          <section>
            <h3>Personal Information</h3>
            <div className="info-grid">
              <p><strong>DOB:</strong> {employee.dob || 'N/A'}</p>
              <p><strong>Gender:</strong> {employee.gender || 'N/A'}</p>
              <p><strong>Phone:</strong> {employee.phone || 'N/A'}</p>
              <p><strong>Personal Email:</strong> {employee.personalEmail || 'N/A'}</p>
              <p><strong>Official Email:</strong> {employee.officialEmail || 'N/A'}</p>
              <p><strong>Father:</strong> {employee.father || 'N/A'}</p>
              <p><strong>Mother:</strong> {employee.mother || 'N/A'}</p>
              <p><strong>Address:</strong> {employee.address || 'N/A'}</p>
              <p><strong>Emergency Contact:</strong> {employee.emergencyContact || 'N/A'}</p>
              <p><strong>Relation:</strong> {employee.relation || 'N/A'}</p>
            </div>
          </section>

          {/* Bank Details */}
          <section>
            <h3>Bank Details</h3>
            <div className="info-grid">
              <p><strong>Bank:</strong> {employee.bank || 'N/A'}</p>
              <p><strong>Account No:</strong> {employee.accountNo || 'N/A'}</p>
              <p><strong>IFSC:</strong> {employee.ifsc || 'N/A'}</p>
              <p><strong>Holder:</strong> {employee.holder || 'N/A'}</p>
            </div>
          </section>

          {/* Identity & Documents */}
          <section>
            <h3>Identity & Documents</h3>
            <div className="info-grid">
              <p><strong>Aadhar:</strong> {employee.aadhar || 'N/A'}</p>
              <p><strong>PAN:</strong> {employee.pan || 'N/A'}</p>
              <p><strong>Qualification:</strong> {employee.qualification || 'N/A'}</p>
              <p><strong>Last Exp:</strong> {employee.lastExp || 'N/A'}</p>
              <p><strong>Exp with PWT:</strong> {employee.expWithPWT || 'N/A'}</p>
            </div>
          </section>

          {/* Job & Salary */}
          <section>
            <h3>Job & Salary Details</h3>
            <div className="info-grid">
              <p><strong>Department:</strong> {employee.department || 'N/A'}</p>
              <p><strong>Service:</strong> {employee.service || 'N/A'}</p>
              <p><strong>Interview Date:</strong> {employee.interviewDate || 'N/A'}</p>
              <p><strong>Joining Date:</strong> {employee.joiningDate || 'N/A'}</p>
              <p><strong>Expected Salary:</strong> {employee.expectedSalary || 'N/A'}</p>
              <p><strong>Given Salary:</strong> {employee.givenSalary || 'N/A'}</p>
              <p><strong>Working Time:</strong> {employee.workingTime || 'N/A'}</p>
              <p>
                <strong>Resume:</strong> {employee.resume ? (
                  <a href={employee.resume} target="_blank" rel="noopener noreferrer">View</a>
                ) : 'N/A'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
