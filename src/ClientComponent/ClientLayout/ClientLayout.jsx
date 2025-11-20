import React from "react";
import ClientNavBar from "../../ClientComponent/Navbar/ClientNavBar";
import ClientSideBar from "../../ClientComponent/SideBar/ClientSideBar";
import { Outlet, useLocation } from "react-router-dom";
import ChatButtonAndPopup from "../../Admin/Components/Admin/ChatButtonAndPopup";

function ClientLayout() {
  const location = useLocation();
  // Hide sidebar/navbar on login, create password, or other auth pages
  const shouldHideNav = (
    location.pathname === "/client/ClientPage" ||
    location.pathname === "/client/CreatePassword"
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!shouldHideNav && <ClientNavBar />}
      <div style={{ display: "flex", flex: 1, minHeight: "0" }}>
        {!shouldHideNav && (
          <div style={{ width: 260, minWidth: 220 }}>
            <ClientSideBar />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Outlet />
        </div>
        {/* <ChatButtonAndPopup/> */}
      </div>
    </div>
  );
}

export default ClientLayout;
