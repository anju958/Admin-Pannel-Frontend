import React, { useState } from 'react';


function SupportHelp() {
  const [tickets, setTickets] = useState([
    { id: 1, subject: 'Unable to access payroll', status: 'Open' },
    { id: 2, subject: 'System logout issue', status: 'Resolved' },
    { id: 3, subject: 'Request for leave approval', status: 'Pending' },
  ]);

  const [newTicket, setNewTicket] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTicket.trim() === '') return;

    const ticket = {
      id: tickets.length + 1,
      subject: newTicket,
      status: 'Open',
    };
    setTickets([ticket, ...tickets]);
    setNewTicket('');
  };

  return (
    <div className="support-page">
      <h2 className="page-title">Support / Helpdesk</h2>

      <div className="ticket-form">
        <h3>Submit a New Ticket</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Describe your issue..."
            value={newTicket}
            onChange={(e) => setNewTicket(e.target.value)}
          />
          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="ticket-list">
        <h3>Existing Tickets</h3>
        {tickets.map((ticket) => (
          <div key={ticket.id} className={`ticket-card status-${ticket.status.toLowerCase()}`}>
            <p><strong>Ticket #{ticket.id}:</strong> {ticket.subject}</p>
            <span className="ticket-status">{ticket.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SupportHelp;
