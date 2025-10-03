import React from "react";
import { useLocation } from "react-router-dom";

function PaymentSuccess() {
  const query = new URLSearchParams(useLocation().search);
  const paymentId = query.get("razorpay_payment_id");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Payment Successful 🎉</h2>
      <p>Thank you for your payment.</p>
      <p>Payment ID: {paymentId}</p>
    </div>
  );
}

export default PaymentSuccess;
