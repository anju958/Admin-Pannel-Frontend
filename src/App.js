import Admin from '../src/Admin/Components/Admin/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css';

import Login from './Login/Login';
import Opening from './Admin/Components/Job Opening/Opening';
import AdminLayout from './Admin/Components/AdminLayout/AdminLayout';
import Department from './Admin/Components/Department/Department';
import AddEmployee from './Admin/Components/Employee/AddEmployee';
import RegisterationForm from './RegisterForm/RegisterationForm';
import Attendance from './Admin/Components/Attendance/Attendance';
import Lead from './Admin/Components/Leads/Lead';
import AddDepartment from './Admin/Components/Department/AddDepartment';
import AddJobs from './Admin/Components/Job Opening/AddJobs';
import Employee from './Admin/Components/Employee/Employee';
import Clients from './Admin/Components/Client/Clients';
import AddLead from './Admin/Components/Leads/AddLead';
import Trainee from './Admin/Components/Traniee/Traniee';
import RolesAndResponsibilities from './Admin/Components/Roles and Responsibility/RolesAndResponsibilities';
import UpdateEmp from './Admin/Components/Employee/UpdateEmp';
// import AddClient from './Admin/Components/Attendance/AddClient';
import ClientLead from './Admin/Components/ClientLeadData/ClientLeadData';
// import AddAttendance from './Admin/Components/Attendance/AddAttendance';
import UpdateLeadClient from './Admin/Components/ClientLeadData/UpdateLeadClient';
import EmployeeLayout from './Employee/Components/EmployeeLayout/EmployeeLayout';
import EmployeeHome from './Employee/Components/EmployeeHome/EmployeeHome';
import EmployeeAttendance from './Employee/Components/Attendance/EmployeeAttendance';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/RegisterationForm' element={<RegisterationForm />} />
          <Route path="/Login" element={<Login />} />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Admin />} />
            <Route path="home" element={<Admin />} />
            <Route path="jobopening" element={<Opening />} />
            <Route path='department' element={<Department />} />
            <Route path='addemployee' element={<AddEmployee />} />
            <Route path='designation' />
            <Route path="Attendance" element={<Attendance />} />
            <Route path="leads" element={<Lead />} />
            <Route path='addDepartment' element={<AddDepartment />} />
            <Route path='addJobs' element={<AddJobs />} />
            <Route path='Employee' element={<Employee />} />
            <Route path='client' element={<Clients />} />
            <Route path='Lead' element={<AddLead />} />
            <Route path='trainee' element={<Trainee />} />
            <Route path='Roles' element={<RolesAndResponsibilities />} />
            <Route path='upDateUder/:employeeId' element={<UpdateEmp />} />
            {/* <Route path='addClient' element={<AddClient/>}/> */}
            <Route path='addClientLead' element={<ClientLead />} />
            {/* <Route path='add_attendance' element={<AddAttendance />} /> */}
            <Route path='updateLeadClient' element={<UpdateLeadClient />} />
          </Route>
          {/* Employee Routes */}
          <Route path='employee' element={<EmployeeLayout />}>
          <Route index element={<EmployeeHome />} />
        <Route path='employeeattendance' element={<EmployeeAttendance/>}/>



          </Route>


        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
