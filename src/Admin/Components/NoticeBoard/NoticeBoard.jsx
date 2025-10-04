import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../../../config";

function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [show, setShow] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", description: "", category: "General" });


  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📢 Notice Board (Admin)</h2>
        <Button variant="primary" onClick={() => setShow(true)}>➕ Add Notice</Button>
      </div>

      {/* Notices */}
      {notices.map((notice) => (
        <Card key={notice._id} className="mb-3 shadow-sm">
          <Card.Body>
            <Card.Title>{notice.title} <span className="badge bg-info">{notice.category}</span></Card.Title>
            <Card.Text>{notice.description}</Card.Text>
            <small className="text-muted">📅 {new Date(notice.createdAt).toLocaleDateString()}</small>
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
              <Form.Label>Title</Form.Label>
              <Form.Control value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={newNotice.description} onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}/>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={newNotice.category} onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}>
                <option value="General">General</option>
                <option value="Holiday">Holiday</option>
                <option value="Task">Priority Task</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>Cancel</Button>
          <Button variant="success" >Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default NoticeBoard;
