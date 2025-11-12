// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { API_URL } from "../../../config";

// function InvoiceList() {
//   const [invoices, setInvoices] = useState([]);
//   const [payNow, setPayNow] = useState({});
//   const [payNowMethod, setPayNowMethod] = useState({});
//   const [showPaymentsModal, setShowPaymentsModal] = useState(false);
//   const [activePayments, setActivePayments] = useState([]);
//   const [activeInvoiceNumber, setActiveInvoiceNumber] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();

//   const clientId = location.state?.clientId || null;

//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         let url = `${API_URL}/api/getAllInvoices`;
//         if (clientId) url = `${API_URL}/api/getInvoicesByClient/${clientId}`;
//         const response = await axios.get(url);
//         const data = response.data;
//         if (data.success && Array.isArray(data.invoices)) {
//           setInvoices(data.invoices);
//           const amounts = {};
//           const methods = {};
//           data.invoices.forEach((inv) => {
//             amounts[inv._id] = "";
//             methods[inv._id] = "UPI";
//           });
//           setPayNow(amounts);
//           setPayNowMethod(methods);
//         } else {
//           setInvoices([]);
//         }
//       } catch (err) {
//         setInvoices([]);
//       }
//     };
//     fetchInvoices();
//   }, [clientId]);

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this invoice?")) return;
//     try {
//       await axios.delete(`${API_URL}/api/deleteInvoice/${id}`);
//       setInvoices(invoices.filter((inv) => inv._id !== id));
//     } catch (err) {}
//   };

//   const handlePayNowChange = (id, value) => {
//     setPayNow((prev) => ({ ...prev, [id]: value }));
//   };

//   const handlePayNowMethodChange = (id, value) => {
//     setPayNowMethod((prev) => ({ ...prev, [id]: value }));
//   };

//   const handleMarkPaid = async (invoice) => {
//     const paymentNow = Number(payNow[invoice._id]) || 0;
//     if (paymentNow <= 0) {
//       alert("Please enter payment amount > 0");
//       return;
//     }
//     if ((invoice.paidAmount || 0) + paymentNow > invoice.totalAmount) {
//       alert("Total paid cannot exceed invoice total");
//       return;
//     }
//     try {
//       await axios.post(
//         `${API_URL}/api/invoices/${invoice._id}/addPayment`,
//         {
//           amount: paymentNow,
//           method: payNowMethod[invoice._id] || "UPI",
//           note: "Manual payment"
//         }
//       );
//       alert("Invoice payment added to history!");
//       setPayNow((prev) => ({ ...prev, [invoice._id]: "" }));
//       const response = await axios.get(
//         clientId
//           ? `${API_URL}/api/getInvoicesByClient/${clientId}`
//           : `${API_URL}/api/getAllInvoices`
//       );
//       setInvoices(response.data.invoices || []);
//     } catch (error) {
//       alert("Failed to add payment");
//     }
//   };

//   const handleShowPayments = async (invId, invoiceNumber) => {
//     setShowPaymentsModal(true);
//     setActivePayments([]);
//     setActiveInvoiceNumber(invoiceNumber);
//     try {
//       const res = await axios.get(`${API_URL}/api/getInvoiceById/${invId}`);
//       const arr = res.data.invoice && res.data.invoice.payments
//         ? res.data.invoice.payments
//         : [];
//       setActivePayments(arr);
//     } catch { setActivePayments([]); }
//   };

//   const getLastPaymentInfo = (invoice) => {
//     if (
//       invoice.status === "Partial" &&
//       invoice.payments &&
//       invoice.payments.length > 0
//     ) {
//       const lastPayment = [...invoice.payments].sort(
//         (a, b) => new Date(b.date) - new Date(a.date)
//       )[0];
//       return (
//         <span style={{ fontSize: "0.95em", color: "#512da8" }}>
//           <br />
//           Last: {new Date(lastPayment.date).toLocaleString()}
//         </span>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="container mt-4">
//       <h2>🧾 Invoice List {clientId && "(Client Invoices)"}</h2>
//       {/* Only the table (not page) is horizontally scrollable */}
//       <div style={{
//         width: "100%",
//         overflowX: "auto",
//         background: "#fff",
//         borderRadius: "6px",
//         border: "1px solid #eee"
//       }}>
//         <table className="table table-striped table-bordered shadow-sm" style={{ minWidth: "1400px" }}>
//           <thead className="table-dark">
//             <tr>
//               <th>#</th>
//               <th>Invoice No</th>
//               <th>Client</th>
//               <th>Total</th>
//               <th>Paid</th>
//               <th>Unpaid</th>
//               <th>Payment Details</th>
//               <th>Pay Now</th>
//               <th>Status</th>
//               <th>Due Date</th>
//               <th>Created On</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoices.length > 0 ? (
//               invoices.map((invoice, idx) => {
//                 const paid = invoice.paidAmount || 0;
//                 const unpaid = invoice.totalAmount - paid;
//                 return (
//                   <tr key={invoice._id}>
//                     <td>{idx + 1}</td>
//                     <td
//                       className="text-primary text-decoration-underline"
//                       style={{ cursor: "pointer" }}
//                       onClick={() =>
//                         navigate(`/admin/viewInvoice/${invoice._id}`)
//                       }
//                     >
//                       {invoice.invoiceNumber}
//                     </td>
//                     <td>{invoice.clientName}</td>
//                     <td>
//                       <b>₹{invoice.totalAmount.toLocaleString()}</b>
//                     </td>
//                     <td style={{ color: "#2e7d32", fontWeight: 600 }}>
//                       ₹{paid.toLocaleString()}
//                     </td>
//                     <td style={{ color: "#c62828", fontWeight: 600 }}>
//                       ₹{unpaid.toLocaleString()}
//                     </td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-secondary"
//                         style={{
//                           minWidth: "120px",
//                           maxWidth: "170px",
//                           overflow: "hidden"
//                         }}
//                         onClick={() => handleShowPayments(invoice._id, invoice.invoiceNumber)}
//                       >
//                         Payment History
//                       </button>
//                       {getLastPaymentInfo(invoice)}
//                     </td>
//                     {/* Pay Now */}
//                     <td style={{ minWidth: "240px", maxWidth: "360px" }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "row",
//                           gap: "8px",
//                           alignItems: "center",
//                           justifyContent: "flex-start"
//                         }}
//                       >
//                         <select
//                           value={payNowMethod[invoice._id]}
//                           onChange={(e) =>
//                             handlePayNowMethodChange(invoice._id, e.target.value)
//                           }
//                           disabled={invoice.status === "Paid"}
//                           style={{ width: "115px" }}
//                         >
//                           <option value="UPI">UPI</option>
//                           <option value="Bank Account">Bank Account</option>
//                           <option value="Cash">Cash</option>
//                           <option value="Cheque">Cheque</option>
//                           <option value="Other">Other</option>
//                         </select>
//                         <input
//                           type="number"
//                           min="0"
//                           max={unpaid}
//                           value={payNow[invoice._id]}
//                           onChange={(e) =>
//                             handlePayNowChange(invoice._id, e.target.value)
//                           }
//                           style={{ width: "78px" }}
//                           disabled={invoice.status === "Paid"}
//                           placeholder="Enter ₹"
//                         />
//                         <button
//                           className="btn btn-sm btn-success"
//                           onClick={() => handleMarkPaid(invoice)}
//                           disabled={
//                             invoice.status === "Paid" ||
//                             !payNow[invoice._id] ||
//                             Number(payNow[invoice._id]) <= 0
//                           }
//                         >
//                           ✓ Pay
//                         </button>
//                       </div>
//                     </td>
//                     <td>
//                       <span
//                         className={`badge ${
//                           invoice.status === "Paid"
//                             ? "bg-success"
//                             : invoice.status === "Partial"
//                             ? "bg-info text-dark"
//                             : "bg-warning text-dark"
//                         }`}
//                       >
//                         {invoice.status}
//                       </span>
//                     </td>
//                     <td>
//                       {invoice.dueDate
//                         ? new Date(invoice.dueDate).toLocaleDateString()
//                         : "-"}
//                     </td>
//                     <td>
//                       {invoice.date
//                         ? new Date(invoice.date).toLocaleDateString()
//                         : "-"}
//                     </td>
//                     <td>
//                       <button
//                         className="btn btn-sm btn-info me-2"
//                         onClick={() =>
//                           navigate(`/admin/viewInvoice/${invoice._id}`)
//                         }
//                       >
//                         👁️ View
//                       </button>
//                       <button
//                         className="btn btn-sm btn-danger"
//                         onClick={() => handleDelete(invoice._id)}
//                       >
//                         🗑️ Delete
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="12" className="text-center text-muted">
//                   No invoices found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//       {/* Payment History Modal */}
//       {showPaymentsModal && (
//         <div
//           className="modal show fade d-block"
//           tabIndex="-1"
//           style={{ background: "rgba(0,0,0,0.5)" }}
//         >
//           <div className="modal-dialog modal-lg">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">
//                   Payment History: {activeInvoiceNumber}
//                 </h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setShowPaymentsModal(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <table className="table table-bordered table-sm">
//                   <thead>
//                     <tr>
//                       <th>#</th>
//                       <th>Amount</th>
//                       <th>Method</th>
//                       <th>Date</th>
//                       <th>Note</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {activePayments && activePayments.length > 0 ? (
//                       activePayments.map((pay, i) => (
//                         <tr key={i}>
//                           <td>{i + 1}</td>
//                           <td>₹{Number(pay.amount).toLocaleString()}</td>
//                           <td>{pay.method || "-"}</td>
//                           <td>
//                             {pay.date
//                               ? new Date(pay.date).toLocaleString()
//                               : "-"}
//                           </td>
//                           <td>{pay.note || "-"}</td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td colSpan="5" className="text-center">
//                           No payments yet.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default InvoiceList;


import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";

// ✅ Permission helpers
const canDo = (user, module, action) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.[action] === true;
};

const canViewPage = (user, module) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.view === true;
};

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [payNow, setPayNow] = useState({});
  const [payNowMethod, setPayNowMethod] = useState({});
  const [showPaymentsModal, setShowPaymentsModal] = useState(false);
  const [activePayments, setActivePayments] = useState([]);
  const [activeInvoiceNumber, setActiveInvoiceNumber] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const clientId = location.state?.clientId || null;

  // ✅ Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        let url = `${API_URL}/api/getAllInvoices`;
        if (clientId) url = `${API_URL}/api/getInvoicesByClient/${clientId}`;

        const res = await axios.get(url);

        if (res.data.success && Array.isArray(res.data.invoices)) {
          const list = res.data.invoices;

          setInvoices(list);

          const defaultAmount = {};
          const defaultMethod = {};

          list.forEach((inv) => {
            defaultAmount[inv._id] = "";
            defaultMethod[inv._id] = "UPI";
          });

          setPayNow(defaultAmount);
          setPayNowMethod(defaultMethod);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        setInvoices([]);
      }
    };

    fetchInvoices();
  }, [clientId]);

  // ✅ Delete invoice (permission controlled)
  const handleDelete = async (id) => {
    if (!canDo(user, "invoices", "delete"))
      return alert("You do not have permission to delete invoices.");

    if (!window.confirm("Are you sure you want to delete this invoice?"))
      return;

    try {
      await axios.delete(`${API_URL}/api/deleteInvoice/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      alert("Invoice deleted successfully!");
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ✅ Mark invoice payment
  const handleMarkPaid = async (invoice) => {
    if (!canDo(user, "invoices", "edit"))
      return alert("You do not have permission to update invoices.");

    const amount = Number(payNow[invoice._id]) || 0;

    if (amount <= 0) return alert("Enter valid amount");

    if ((invoice.paidAmount || 0) + amount > invoice.totalAmount)
      return alert("Total paid cannot exceed invoice total");

    try {
      await axios.post(
        `${API_URL}/api/invoices/${invoice._id}/addPayment`,
        {
          amount,
          method: payNowMethod[invoice._id],
          note: "Manual payment"
        }
      );

      alert("Payment added!");

      // Reset field
      setPayNow((prev) => ({ ...prev, [invoice._id]: "" }));

      // Refresh list
      const res = await axios.get(
        clientId
          ? `${API_URL}/api/getInvoicesByClient/${clientId}`
          : `${API_URL}/api/getAllInvoices`
      );

      setInvoices(res.data.invoices || []);
    } catch (err) {
      alert("Failed to update payment");
    }
  };

  // ✅ Payment history modal
  const handleShowPayments = async (invId, invoiceNumber) => {
    setActiveInvoiceNumber(invoiceNumber);
    setShowPaymentsModal(true);

    try {
      const res = await axios.get(`${API_URL}/api/getInvoiceById/${invId}`);
      setActivePayments(res.data.invoice?.payments || []);
    } catch {
      setActivePayments([]);
    }
  };

  // ✅ PAGE ACCESS CHECK
  if (!canViewPage(user, "invoices")) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">🚫 Access Denied</h2>
        <p>You do not have permission to view invoices.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>🧾 Invoice List {clientId && "(Client Invoices)"}</h2>

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          background: "#fff",
          borderRadius: "6px",
          border: "1px solid #eee"
        }}
      >
        <table
          className="table table-striped table-bordered shadow-sm"
          style={{ minWidth: "1400px" }}
        >
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Invoice No</th>
              <th>Client</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Unpaid</th>
              <th>Payment Details</th>
              <th>Pay Now</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Created On</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.map((invoice, idx) => {
              const paid = invoice.paidAmount || 0;
              const unpaid = invoice.totalAmount - paid;

              return (
                <tr key={invoice._id}>
                  <td>{idx + 1}</td>

                  {/* ✅ View Invoice */}
                  <td
                    className="text-primary text-decoration-underline"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      canDo(user, "invoices", "view") &&
                      navigate(`/admin/viewInvoice/${invoice._id}`)
                    }
                  >
                    {invoice.invoiceNumber}
                  </td>

                  <td>{invoice.clientName}</td>
                  <td><b>₹{invoice.totalAmount.toLocaleString()}</b></td>
                  <td style={{ color: "#2e7d32", fontWeight: 600 }}>
                    ₹{paid.toLocaleString()}
                  </td>
                  <td style={{ color: "#c62828", fontWeight: 600 }}>
                    ₹{unpaid.toLocaleString()}
                  </td>

                  {/* ✅ Payment history */}
                  <td>
                    <button
                      className="btn btn-sm btn-secondary"
                      onClick={() =>
                        handleShowPayments(invoice._id, invoice.invoiceNumber)
                      }
                    >
                      Payment History
                    </button>
                  </td>

                  {/* ✅ Pay Now (Edit permission required) */}
                  <td>
                    {canDo(user, "invoices", "edit") && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <select
                          value={payNowMethod[invoice._id]}
                          onChange={(e) =>
                            setPayNowMethod((prev) => ({
                              ...prev,
                              [invoice._id]: e.target.value
                            }))
                          }
                          disabled={invoice.status === "Paid"}
                        >
                          <option value="UPI">UPI</option>
                          <option value="Bank Account">Bank</option>
                          <option value="Cash">Cash</option>
                          <option value="Cheque">Cheque</option>
                        </select>

                        <input
                          type="number"
                          value={payNow[invoice._id]}
                          disabled={invoice.status === "Paid"}
                          onChange={(e) =>
                            setPayNow((prev) => ({
                              ...prev,
                              [invoice._id]: e.target.value
                            }))
                          }
                          placeholder="₹"
                          style={{ width: "75px" }}
                        />

                        <button
                          className="btn btn-sm btn-success"
                          disabled={invoice.status === "Paid"}
                          onClick={() => handleMarkPaid(invoice)}
                        >
                          ✓ Pay
                        </button>
                      </div>
                    )}
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`badge ${
                        invoice.status === "Paid"
                          ? "bg-success"
                          : invoice.status === "Partial"
                          ? "bg-info text-dark"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>

                  <td>
                    {invoice.dueDate
                      ? new Date(invoice.dueDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    {invoice.date
                      ? new Date(invoice.date).toLocaleDateString()
                      : "-"}
                  </td>

                  {/* ✅ Action Buttons */}
                  <td>
                    {/* View */}
                    {canDo(user, "invoices", "view") && (
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() =>
                          navigate(`/admin/viewInvoice/${invoice._id}`)
                        }
                      >
                        👁️ View
                      </button>
                    )}

                    {/* Delete */}
                    {canDo(user, "invoices", "delete") && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(invoice._id)}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}

            {invoices.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center text-muted">
                  No invoices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ Payment History Modal */}
      {showPaymentsModal && (
        <div
          className="modal show fade d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Payment History: {activeInvoiceNumber}</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowPaymentsModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <table className="table table-bordered table-sm">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Date</th>
                      <th>Note</th>
                    </tr>
                  </thead>

                  <tbody>
                    {activePayments.length > 0 ? (
                      activePayments.map((p, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>₹{p.amount}</td>
                          <td>{p.method || "-"}</td>
                          <td>
                            {p.date
                              ? new Date(p.date).toLocaleString()
                              : "-"}
                          </td>
                          <td>{p.note || "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No payment records
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceList;
