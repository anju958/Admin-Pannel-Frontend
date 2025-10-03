

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function PayPage() {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.id = "razorpay-script";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/getSingleInvoice/${invoiceId}`);
        if (!res.data) {
          setError("Invoice not found");
        } else {
          setInvoice(res.data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch invoice. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handlePayment = async () => {
    if (!invoice) {
      alert("Invoice data not available.");
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Failed to load Razorpay SDK. Check your internet connection.");
      return;
    }

    try {
      // Create order on backend
      const { data } = await axios.post(`http://localhost:5000/api/sendInvoice/${invoice._id}`);
      const order = data.order;

      if (!order) {
        alert("Failed to create payment order.");
        return;
      }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Your Company Name",
        description: `Invoice #${invoice.invoiceNumber}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            await axios.post("http://localhost:5000/api/verifyPayment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              invoiceId: invoice._id,
            });
            alert("Payment Successful!");
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: invoice.clientName,
          email: invoice.clientEmail,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) return <p>Loading invoice...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!invoice) return <p>Invoice not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Pay Invoice #{invoice.invoiceNumber}</h2>
      <p>Total Amount: ₹{invoice.totalAmount}</p>
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Pay Now
      </button>
    </div>
  );
}

export default PayPage;
