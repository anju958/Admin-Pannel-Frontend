import React from 'react'
import Sidebar from '../../../Employee/SideBar/SideBar'
import Navbar from '../../Navbar/Navbar'
import { Outlet } from 'react-router-dom'



function EmployeeLayout() {
  return (
    <>
       <div className='d-flex'>
            <Sidebar/>
            <div className='flex-grow-1'>
                <Navbar/>
                <div className='p-4'><Outlet/></div>
            </div>
        </div>
    </>
  )
}

export default EmployeeLayout