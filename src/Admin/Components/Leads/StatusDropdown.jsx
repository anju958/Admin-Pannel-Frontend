import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

function StatusDropdown({ status, onStatusChange, onMoveToClient }) {
  const statusOptions = [
    { label: "Cold", color: "secondary" },
    { label: "Warm", color: "warning" },
    { label: "Hot", color: "danger" },
    { label: "Proposal Sent", color: "info" },
    { label: "Win", color: "success" },
    { label: "Hold", color: "dark" },
    { label: "Close", color: "secondary" },
   


  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Cold":
        return "secondary";
      case "Warm":
        return "warning";
      case "Hot":
        return "danger";
      case "Proposal Sent":
        return "info";
      case "Win":
        return "success";
      case "Hold":
        return "dark";
      case "Close":
        return "secondary";
     

      default:
        return "primary";
    }
  };

  return (
    <Dropdown>

      <Dropdown.Toggle
        variant="light"
        className="d-flex align-items-center border shadow-sm"
        size="sm"
      >
        <span
          className={`me-2 rounded-circle bg-${getStatusColor(status)}`}
          style={{ width: "12px", height: "12px", display: "inline-block" }}
        ></span>
        {status}
      </Dropdown.Toggle>


      <Dropdown.Menu container="body" className="shadow-sm">
        {statusOptions.map((opt, idx) => (
          <Dropdown.Item
            key={idx}
            onClick={() => onStatusChange(opt.label)}
            className="d-flex align-items-center"
          >
            <span
              className={`me-2 rounded-circle bg-${opt.color}`}
              style={{ width: "12px", height: "12px", display: "inline-block" }}
            ></span>
            {opt.label}
          </Dropdown.Item>
        ))}


        <Dropdown.Divider />

        <Dropdown.Item
          onClick={onMoveToClient}
          className="d-flex align-items-center text-primary fw-bold"
        >
          <span
            className="me-2 rounded-circle bg-primary"
            style={{ width: "12px", height: "12px", display: "inline-block" }}
          ></span>
          Move to Client
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default StatusDropdown;
