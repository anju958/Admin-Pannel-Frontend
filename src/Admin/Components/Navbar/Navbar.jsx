import React from 'react'
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
    return (
        <nav className="navbar  bg-success p-3 text-dark bg-opacity-25 px-3">
            <span className="navbar-brand">
                <form className="d-flex" role="search">
                    <input
                        className="form-control me-2 searchBar"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-success" type="submit">
                        Search
                    </button>
                </form>
            </span>
            
            <div className="ms-auto dropdown">
                <button
                    className="btn btn-dark dropdown-toggle d-flex align-items-center"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <FaUserCircle size={28} className="me-2" />
                    <span>John Doe</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end shadow">
                    <li><a className="dropdown-item" href="/profile">👤 Profile</a></li>
                    <li><a className="dropdown-item" href="/settings">⚙️ Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item text-danger" href="/logout">🚪 Logout</a></li>
                </ul>
            </div>


        </nav>
    )
}

export default Navbar
