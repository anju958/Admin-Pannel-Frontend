import React, { useState } from "react";
import UserList from "./UserList";
import ChatBox from "./ChatBox";

export default function AdminAllChats() {
  const [activeUser, setActiveUser] = useState(null);

  return (
    <div style={{ display: "flex", height: "80vh", background: "#fff" }}>
      <div style={{ width: 320, borderRight: "1px solid #eee" }}>
        <UserList onSelectUser={(u) => setActiveUser(u)} />
      </div>
      <div style={{ flex: 1 }}>
        <ChatBox peerId={activeUser?._id} peerName={activeUser?.name} />
      </div>
    </div>
  );
}
