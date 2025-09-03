import React, { Children } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'

function AdminLayout() {
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

export default AdminLayout