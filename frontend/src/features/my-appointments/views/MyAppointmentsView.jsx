import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "@/store/AppContext";
import { appointmentsService } from "@/features/my-appointments/services/appointments.service";
import { paymentsService } from "@/features/payments/services/payments.service";
import { toast } from "react-toastify";
import { assets } from "@/assets/assets";
import RescheduleModal from "@/features/my-appointments/components/RescheduleModal";
import ReviewModal from "@/features/my-appointments/components/ReviewModal";
import { formatSlotDate } from "@/shared/utils/slots.utils";
import useDocumentTitle from "@/shared/hooks/useDocumentTitle";

const MyAppointmentsView = () => {
  const { token } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");
  const [loading, setLoading] = useState(true);
  useDocumentTitle("My appointments");
  const [rescheduling, setRescheduling] = useState(null);
  const [reviewing, setReviewing] = useState(null);

  const slotDateFormat = formatSlotDate;

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {
      const data = await appointmentsService.list();
      setAppointments(data.appointments.reverse());
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const data = await appointmentsService.cancel(appointmentId);

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);

        try {
          const data = await paymentsService.verifyRazorpay(response);
          if (data.success) {
            navigate("/my-appointments");
            getUserAppointments();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Function to make payment using razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const data = await paymentsService.createRazorpayOrder(appointmentId);
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to make payment using stripe
  const appointmentStripe = async (appointmentId) => {
    try {
      const data = await paymentsService.createStripeSession(appointmentId);
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  const statusOf = (item) => {
    if (item.cancelled) return { label: "Cancelled", cls: "bg-red-50 text-red-600" };
    if (item.isCompleted) return { label: "Completed", cls: "bg-emerald-50 text-emerald-600" };
    if (item.payment) return { label: "Paid", cls: "bg-primary-50 text-primary-600" };
    return { label: "Payment pending", cls: "bg-amber-50 text-amber-600" };
  };

  const actionBtn =
    "w-full rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-ink-soft transition-all duration-200 sm:min-w-48";

  return (
    <div className="animate-fade-up">
      <h1 className="text-3xl font-bold tracking-tight">My appointments</h1>
      <p className="mt-1 text-ink-soft">Manage, pay for or reschedule your visits.</p>

      <div className="mt-8 flex flex-col gap-4">
        {loading &&
          [0, 1].map((i) => (
            <div key={i} className="card flex animate-pulse gap-5 p-5">
              <div className="h-32 w-32 rounded-2xl bg-slate-100" />
              <div className="flex-1 space-y-3 py-2">
                <div className="h-5 w-1/3 rounded bg-slate-100" />
                <div className="h-4 w-1/4 rounded bg-slate-100" />
                <div className="h-4 w-1/2 rounded bg-slate-100" />
              </div>
            </div>
          ))}

        {!loading && appointments.length === 0 && (
          <div className="card mx-auto max-w-md p-10 text-center">
            <p className="text-lg font-semibold">No appointments yet</p>
            <p className="mt-1 text-sm text-ink-soft">Find a doctor and book your first visit.</p>
            <button onClick={() => navigate("/doctors")} className="btn-primary mt-5">
              Find a doctor
            </button>
          </div>
        )}

        {appointments.map((item) => {
          const status = statusOf(item);
          const open = !item.cancelled && !item.isCompleted;
          return (
            <div
              key={item._id}
              className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center"
            >
              <img
                className="h-32 w-32 flex-shrink-0 rounded-2xl bg-primary-50 object-cover object-top"
                src={item.docData.image}
                alt=""
              />

              <div className="flex-1 text-sm text-ink-soft">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-lg font-semibold text-ink">{item.docData.name}</p>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.cls}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p>{item.docData.speciality}</p>
                <p className="mt-2 font-medium text-ink">
                  🗓 {slotDateFormat(item.slotDate)} · {item.slotTime}
                </p>
                <p className="mt-1">
                  📍 {item.docData.address?.line1}
                  {item.docData.address?.line2 ? `, ${item.docData.address.line2}` : ""}
                </p>
              </div>

              <div className="flex flex-col gap-2 text-center sm:w-52">
                {open && !item.payment && payment !== item._id && (
                  <button onClick={() => setPayment(item._id)} className="btn-primary !py-2.5">
                    Pay online
                  </button>
                )}
                {open && !item.payment && payment === item._id && (
                  <>
                    <button
                      onClick={() => appointmentStripe(item._id)}
                      className={`${actionBtn} flex items-center justify-center hover:border-primary`}
                    >
                      <img
                        className="max-h-5 max-w-20"
                        src={assets.stripe_logo}
                        alt="Pay with Stripe"
                      />
                    </button>
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className={`${actionBtn} flex items-center justify-center hover:border-primary`}
                    >
                      <img
                        className="max-h-5 max-w-20"
                        src={assets.razorpay_logo}
                        alt="Pay with Razorpay"
                      />
                    </button>
                  </>
                )}

                {item.isCompleted && !item.reviewed && (
                  <button onClick={() => setReviewing(item)} className="btn-primary !py-2.5">
                    ★ Rate doctor
                  </button>
                )}
                {item.isCompleted && item.reviewed && (
                  <p className="py-2 text-sm font-medium text-amber-500">★ Reviewed</p>
                )}

                {open && (
                  <button
                    onClick={() => setRescheduling(item)}
                    className={`${actionBtn} hover:border-primary hover:text-primary`}
                  >
                    Reschedule
                  </button>
                )}
                {open && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className={`${actionBtn} hover:border-red-300 hover:bg-red-50 hover:text-red-600`}
                  >
                    Cancel appointment
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {rescheduling && (
        <RescheduleModal
          appointment={rescheduling}
          onClose={() => setRescheduling(null)}
          onDone={() => {
            setRescheduling(null);
            getUserAppointments();
          }}
        />
      )}
      {reviewing && (
        <ReviewModal
          appointment={reviewing}
          onClose={() => setReviewing(null)}
          onDone={() => {
            setReviewing(null);
            getUserAppointments();
          }}
        />
      )}
    </div>
  );
};

export default MyAppointmentsView;
