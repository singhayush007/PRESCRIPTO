import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import useDocumentTitle from "../utils/useDocumentTitle";

// Landing page after Stripe checkout: verifies the payment with the server, then shows the result
const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const appointmentId = searchParams.get("appointmentId");
  const sessionId = searchParams.get("session_id");

  const { backendUrl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | failed
  const [message, setMessage] = useState("");
  const started = useRef(false);
  useDocumentTitle("Confirming payment");

  useEffect(() => {
    if (started.current || !token) return;
    started.current = true;

    const verify = async () => {
      if (success !== "true" || !sessionId || !appointmentId) {
        setMessage("The payment was cancelled or could not be confirmed.");
        return setStatus("failed");
      }
      try {
        // the server re-checks the payment with Stripe using the session id
        const { data } = await axios.post(
          backendUrl + "/api/user/verifyStripe",
          { appointmentId, session_id: sessionId },
          { headers: { token } }
        );
        setMessage(data.message);
        setStatus(data.success ? "success" : "failed");
        if (data.success) setTimeout(() => navigate("/my-appointments", { replace: true }), 2200);
      } catch (error) {
        setMessage(error.message);
        setStatus("failed");
      }
    };
    verify();
  }, [token]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center animate-fade-up">
      {status === "loading" && (
        <>
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          <p className="mt-5 font-semibold">Confirming your payment…</p>
          <p className="mt-1 text-sm text-ink-soft">Please don't close this page.</p>
        </>
      )}
      {status === "success" && (
        <>
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lift">
            <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.500 4.500L19 7.500" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "draw .6s .2s ease-out forwards" }} />
            </svg>
          </span>
          <h1 className="mt-6 text-2xl font-extrabold">Payment successful</h1>
          <p className="mt-2 text-sm text-ink-soft">{message || "Your appointment is confirmed."} Taking you to your visits…</p>
        </>
      )}
      {status === "failed" && (
        <>
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-5xl">✕</span>
          <h1 className="mt-6 text-2xl font-extrabold">Payment not completed</h1>
          <p className="mt-2 text-sm text-ink-soft">{message}</p>
          <Link to="/my-appointments" className="btn-primary mt-6">Back to my visits</Link>
        </>
      )}
    </div>
  );
};

export default Verify;
