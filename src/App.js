import Admin from '../src/Admin/Components/Admin/Home';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "bootstrap/dist/js/bootstrap.bundle.min.js"; 
import "bootstrap/dist/css/bootstrap.min.css";
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
import Trainee from './Admin/Components/Traniee/Traniee';
import RolesAndResponsibilities from './Admin/Components/Roles and Responsibility/RolesAndResponsibilities';
import UpdateEmp from './Admin/Components/Employee/UpdateEmp';
import ClientLead from './Admin/Components/ClientLeadData/ClientLeadData';
import UpdateLeadClient from './Admin/Components/ClientLeadData/UpdateLeadClient';
import EmployeeLayout from './Employee/Components/EmployeeLayout/EmployeeLayout';
import EmployeeHome from './Employee/Components/EmployeeHome/EmployeeHome';
import EmployeeAttendance from './Employee/Components/Attendance/EmployeeAttendance';
import MoveToEmp from './Admin/Components/Employee/MoveToEmp';
import LeavePage from './Employee/Components/Leaves/LeavePage';
import SalaryPage from './Employee/Components/Salary/SalaryPage';
import AddServices from './Admin/Components/Services/AddServices';
import Service from './Admin/Components/Services/Service';
import ViewClientPage from './Admin/Components/Client/ViewClientPage';
import AddProject from './Admin/Components/Client/AddProject';
import StatusDropdown from './Admin/Components/Leads/StatusDropdown';
import ClientProjects from './Admin/Components/Client/ClientProjects';
import Proposal from './Admin/Components/Client/Proposal';
import ViewProjects from './Admin/Components/Client/ViewProjects';
import ProjectDetails from './Admin/Components/Client/ProjectDetails';

import InvoiceGenerator from './Admin/Components/Client/InvoiceGenerator';
import UpdateDepartment from './Admin/Components/Department/UpdateDepartment';
import UpdateService from './Admin/Components/Services/UpdateService';
import PayPage from './Admin/Components/Client/PayPage';
import PaymentSuccess from './Admin/Components/Client/PaymentSuccess';
import ViewInvoice from './Admin/Components/Client/ViewInvoice';
import TaskList from './Admin/Components/Task/TaskList';
import AssignTask from './Admin/Components/Task/Task';
import ProposalList from './Admin/Components/PurposalList/PurposalList';
import InvoiceList from './Admin/Components/PurposalList/InvoicesList';
import ReportsDashboard from './Admin/Components/Reports/ReportsDashboard';
import NoticeBoard from './Admin/Components/NoticeBoard/NoticeBoard';
import EmployeeTask from './Employee/Components/Task/EmployeeTask';
import PerformancePage from './Employee/Components/Performance/PerformancePage';
import SupportHelp from './Employee/Components/Support/SupportHelp';
import EmployeeProfile from './Employee/Components/Profile/EmployeeProfile';
import ViewLeadPage from './Admin/Components/Leads/ViewLeadPage';
import ShowProject from './Admin/Components/Projects/Projects';
import ProjectList from './Admin/Components/Projects/ProjectList';
import UpdateProject from './Admin/Components/Projects/UpdateProject';
import EditProposal from './Admin/Components/PurposalList/UpdateAndSentPurposal';
import CompanyProjectsPage from './Admin/Components/Details/Details';
import CompanyDetailsPage from './Admin/Components/Details/Details';


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
            <Route path="addService" element={<AddServices />} />
            <Route path='addProject/:clientId' element={<AddProject />} />
            <Route path='ClientProjects' element={<ClientProjects />} />
            <Route path='addproposal' element={<Proposal />} />
            <Route path='updateDepartment/:id' element={<UpdateDepartment />} />
            <Route path='updateService/:id' element={<UpdateService />} />

            <Route path='Service' element={<Service />} />
            <Route path='addemployee' element={<AddEmployee />} />
            <Route path='designation' />
            <Route path="Attendance" element={<Attendance />} />
            <Route path="leads" element={<Lead />} />
            <Route path='dropdown' element={<StatusDropdown />} />
            <Route path='addDepartment' element={<AddDepartment />} />
            <Route path='addJobs' element={<AddJobs />} />
            <Route path='Employee' element={<Employee />} />
            <Route path='client' element={<Clients />} />
            <Route path='leadPage/:leadId' element={<ViewLeadPage/>}/>
            <Route path='viewclientpage/:leadId' element={<ViewClientPage />} />
            <Route path='projects' element={<ViewProjects />} />
            <Route path='project/:clientId/:projectId' element={<ProjectDetails />} />
            <Route path="invoice/:clientId" element={<InvoiceGenerator />} />
            <Route path='PayPage/:invoiceId' element={<PayPage />} />
            <Route path='viewInvoice/:id' element={<ViewInvoice/>}/>
            <Route path='TaskList' element={<TaskList/>}/>
            <Route path='TaskList/assignTask'  element={<AssignTask/>}/>
            <Route path='PurposalList' element={<ProposalList/>}/>
            <Route path='getAllprojects/edit/:id' element={<UpdateProject/>}/>
            <Route path='InvoicesList' element={<InvoiceList/>}/>
          <Route path='Reports' element={<ReportsDashboard/>}/>
          <Route path='getAllprojects/:id' element={<ShowProject/>}/>
          <Route path='getProjectList' element={<ProjectList/>}/>
          <Route path='updateProposal/:id' element={<EditProposal/>}/>

            <Route path='trainee' element={<Trainee />} />
            <Route path='Roles' element={<RolesAndResponsibilities />} />
            <Route path='upDateUder/:employeeId' element={<UpdateEmp />} />
            <Route path='addClientLead' element={<ClientLead />} />
            <Route path='moveToEmplyee/:employeeId' element={<MoveToEmp />} />
            <Route path='NoticeBoard' element={<NoticeBoard/>}/>

            <Route path='updateLeadClient/:leadId' element={<UpdateLeadClient />} />
            <Route path='companyDetails' element={<CompanyDetailsPage/>}/>
          </Route>
          {/* Employee Routes */}
          <Route path='employee' element={<EmployeeLayout />}>
            <Route index element={<EmployeeHome />} />
            <Route path='employeeattendance' element={<EmployeeAttendance />} />
            <Route path='LeavePage' element={<LeavePage />} />
            <Route path='salaryPage' element={<SalaryPage />} />
            <Route path='employeeTask' element={<EmployeeTask/>}/>
            <Route path='performance' element={<PerformancePage/>}/>
            <Route path='supportHelp' element={<SupportHelp/>}/>
            <Route path='profile' element={<EmployeeProfile/>}/>



          </Route>

          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;
