

import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../../../config";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [show, setShow] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: "",
    description: "",
    category: "General",
  });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/getAllNotifications`);
      // Remove duplicates by NotificationId
      const uniqueNotices = Array.from(
        new Map(res.data.notifications.map(n => [n.NotificationId, n])).values()
      );
      setNotices(uniqueNotices);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // 🔹 Fetch all employees
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/getemployeeData`);
      setUsers(res.data.employees || res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  // 🔹 Send Notification
  const handleSaveNotice = async () => {
    const { title, description, category } = newNotice;
    if (!title || !description) return alert("Title and Message are required");

    const body = {
      title,
      body: description,
      category,
      allUsers: sendToAll,
      userIds: selectedUsers.map(u => u.value), // send selected user IDs
    };
    // try {
    //   setLoading(true);
    //   await axios.post(`${API_URL}/api/sendNotification`, body);
    //   alert("✅ Notification sent successfully!");
    //   setShow(false);
    //   setNewNotice({ title: "", description: "", category: "General" });
    //   setSelectedUsers([]);
    //   setSendToAll(false);
    //   fetchNotifications();
    // } catch (error) {
    //   if (error.response && error.response.status === 409) {
    //     alert("⚠️ This notification already exists!");
    //   } else {
    //     alert("❌ Failed to send notification");
    //   }
    // } finally {
    //   setLoading(false);
    // }
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/sendNotification`, body);
      alert("✅ Notification sent successfully!");
      setShow(false);
      setNewNotice({ title: "", description: "", category: "General" });
      setSelectedUsers([]);
      setSendToAll(false);
      fetchNotifications();
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("⚠️ This notification already exists!");
      } else {
        alert("❌ Failed to send notification");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Options for react-select
  const userOptions = users.map(user => ({
    value: user._id,
    label: user.ename || user.name, // fallback if ename not available
  }));

  const handleDeleteNotice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;

    try {
      await axios.delete(`${API_URL}/api/deleteNotice/${id}`);
      alert("✅ Notice deleted successfully!");
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notice:", error);
      alert("❌ Failed to delete notice");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📢 Notice Board (Admin)</h2>
        <Button variant="primary" onClick={() => setShow(true)}>➕ Add Notice</Button>
      </div>

      {/* Notices */}
      {notices.map(notice => (
        <Card key={notice.NotificationId} className="mb-3 shadow-sm">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <Card.Title className="mb-1">
                  {notice.title}{" "}
                  <span className="badge bg-info">{notice.category}</span>
                </Card.Title>
                <small className="text-muted">
                  📅 {new Date(notice.createdAt).toLocaleString()}
                </small>
              </div>

              <div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteNotice(notice._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
            <Card.Text className="mt-2">{notice.body}</Card.Text>
          </Card.Body>
        </Card>
      ))}

      {/* Modal */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Notice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Send to All Users"
                checked={sendToAll}
                onChange={(e) => setSendToAll(e.target.checked)}
              />
            </Form.Group>

            {!sendToAll && (
              <Form.Group className="mb-3">
                <Form.Label>Select User(s)</Form.Label>
                <Select
                  options={userOptions}
                  isMulti
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  placeholder="Select Employees..."
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                value={newNotice.title}
                onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newNotice.description}
                onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newNotice.category}
                onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
              >
                <option value="General">General</option>
                <option value="Holiday">Holiday</option>
                <option value="Task">Priority Task</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="success" onClick={handleSaveNotice} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NoticeBoard;
