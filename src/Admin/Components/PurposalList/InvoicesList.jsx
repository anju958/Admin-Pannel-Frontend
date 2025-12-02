import { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
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
  const [search, setSearch] = useState("");

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
  // ✅ Excel Download
  const exportExcel = () => {
    const rows = invoices.map((inv, i) => ({
      S_No: i + 1,
      Invoice_Number: inv.invoiceNumber,
      Client: inv.clientName,
      Total_Amount: inv.totalAmount,
      Paid_Amount: inv.paidAmount || 0,
      Unpaid_Amount: inv.totalAmount - (inv.paidAmount || 0),
      Status: inv.status,
      Due_Date: inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-",
      Created_On: inv.date ? new Date(inv.date).toLocaleDateString() : "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");
    XLSX.writeFile(workbook, "Invoices_List.xlsx");
  };

  return (
    <div className="invoice-page">
     

      {/* Gradient Header */}
      <div className="gradient-header mb-4">
        <h2 className="m-0 text-white fw-bold">🧾 Invoice List {clientId && "(Client Invoices)"}</h2>
      </div>
       <div className="d-flex justify-content-between align-items-center mb-3">

        {/* Search */}
        <input
          type="text"
          className="form-control w-90"
          placeholder="Search invoice..."
          
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Excel Button */}
        <button className="btn btn-success px-3" onClick={exportExcel}>
          ⬇️ Download Excel
        </button>
      </div>

      {/* White Card Container */}
      <div className="card border-0 shadow-sm rounded-4 p-0">

        <div className="table-responsive">
          <table className="table modern-invoice-table align-middle">

            <thead>
              <tr>
                <th>#</th>
                <th>Invoice No</th>
                <th>Client</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Unpaid</th>
                <th>Payments</th>
                <th>Pay Now</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Created On</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.filter((inv) => {
                const q = search.toLowerCase();
                return (
                  inv.invoiceNumber?.toLowerCase().includes(q) ||
                  inv.clientName?.toLowerCase().includes(q) ||
                  inv.status?.toLowerCase().includes(q) ||
                  String(inv.totalAmount).includes(q)
                );
              })
                .
                map((invoice, idx) => {
                  const paid = invoice.paidAmount || 0;
                  const unpaid = invoice.totalAmount - paid;

                  return (
                    <tr key={invoice._id} className="invoice-row">

                      <td>{idx + 1}</td>

                      <td
                        className="invoice-link"
                        onClick={() =>
                          canDo(user, "invoices", "view") &&
                          navigate(`/admin/viewInvoice/${invoice._id}`)
                        }
                      >
                        {invoice.invoiceNumber}
                      </td>

                      <td>{invoice.clientName}</td>

                      <td className="fw-bold">₹{invoice.totalAmount.toLocaleString()}</td>

                      <td className="text-success fw-bold">
                        ₹{paid.toLocaleString()}
                      </td>

                      <td className="text-danger fw-bold">
                        ₹{unpaid.toLocaleString()}
                      </td>

                      {/* Payment History */}
                      <td>
                        <button
                          className="btn btn-sm btn-history"
                          onClick={() =>
                            handleShowPayments(invoice._id, invoice.invoiceNumber)
                          }
                        >
                          View History
                        </button>
                      </td>

                      {/* PAY NOW */}
                      <td style={{ minWidth: "240px" }}>
                        <div className="d-flex gap-2">

                          <select
                            className="form-select form-select-sm"
                            value={payNowMethod[invoice._id]}
                            onChange={(e) =>
                              setPayNowMethod((prev) => ({
                                ...prev,
                                [invoice._id]: e.target.value,
                              }))
                            }
                          >
                            <option value="UPI">UPI</option>
                            <option value="Bank Account">Bank</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                          </select>

                          <input
                            className="form-control form-control-sm"
                            type="number"
                            placeholder="₹"
                            value={payNow[invoice._id]}
                            onChange={(e) =>
                              setPayNow((prev) => ({
                                ...prev,
                                [invoice._id]: e.target.value,
                              }))
                            }
                          />

                          <button
                            className="btn btn-sm btn-gradient"
                            onClick={() => handleMarkPaid(invoice)}
                          >
                            ✓
                          </button>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td>
                        <span
                          className={`status-chip ${invoice.status === "Paid"
                              ? "chip-paid"
                              : invoice.status === "Partial"
                                ? "chip-partial"
                                : "chip-pending"
                            }`}
                        >
                          {invoice.status}
                        </span>
                      </td>

                      <td>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}</td>

                      <td>{invoice.date ? new Date(invoice.date).toLocaleDateString() : "-"}</td>

                      <td className=" flex-column gap-1">

                        <button
                          className="btn btn-sm btn-view"
                          onClick={() =>
                            navigate(`/admin/viewInvoice/${invoice._id}`)
                          }
                        >
                          View
                        </button>

                        <button
                          className="btn btn-sm btn-delete"
                          onClick={() => handleDelete(invoice._id)}
                        >
                          Delete
                        </button>

                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAYMENT HISTORY MODAL (unchanged) */}
      {showPaymentsModal && (
        <div className="modal show fade d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Payment History: {activeInvoiceNumber}</h5>
                <button className="btn-close" onClick={() => setShowPaymentsModal(false)} />
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
                          <td>{p.method}</td>
                          <td>{new Date(p.date).toLocaleString()}</td>
                          <td>{p.note}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No payment records</td>
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
