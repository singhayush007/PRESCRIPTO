import React, { useContext, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import Modal from "./Modal";
import { buildSlots, toSlotDate, formatSlotDate, DAYS_OF_WEEK } from "../utils/slots";

const RescheduleModal = ({ appointment, onClose, onDone }) => {
  const { backendUrl, token, doctors, getDoctosData } = useContext(AppContext);
  const doctor = doctors.find((d) => d._id === appointment.docId);

  const days = useMemo(() => (doctor ? buildSlots(doctor.slots_booked) : []), [doctor]);
  const [dayIndex, setDayIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const day = days[dayIndex];
    if (!slotTime || !day?.length) return toast.warning("Please select a time slot");
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/reschedule-appointment",
        {
          appointmentId: appointment._id,
          slotDate: toSlotDate(day[0].datetime),
          slotTime,
        },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        onDone();
      } else {
        toast.error(data.message);
        getDoctosData(); // slot may have just been taken - refresh availability
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Reschedule appointment" onClose={onClose}>
      <p className="text-sm text-ink-soft mb-4">
        Current: {formatSlotDate(appointment.slotDate)} | {appointment.slotTime}
      </p>
      {!doctor ? (
        <p className="text-sm text-ink-soft">Doctor details unavailable.</p>
      ) : (
        <>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {days.map((day, index) => (
              <div
                key={index}
                onClick={() => {
                  setDayIndex(index);
                  setSlotTime("");
                }}
                className={`text-center py-4 min-w-14 rounded-full cursor-pointer text-sm ${
                  dayIndex === index ? "bg-primary text-white" : "border border-[#DDDDDD]"
                }`}
              >
                <p>{day[0] && DAYS_OF_WEEK[day[0].datetime.getDay()]}</p>
                <p>{day[0] && day[0].datetime.getDate()}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {days[dayIndex]?.length ? (
              days[dayIndex].map((item) => (
                <p
                  key={item.time}
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm px-4 py-1.5 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-[#949494] border border-[#B4B4B4]"
                  }`}
                >
                  {item.time.toLowerCase()}
                </p>
              ))
            ) : (
              <p className="text-sm text-ink-soft">No slots left on this day.</p>
            )}
          </div>
          <button
            onClick={submit}
            disabled={loading}
            className="btn-primary mt-6 w-full"
          >
            {loading ? "Rescheduling..." : "Confirm new slot"}
          </button>
        </>
      )}
    </Modal>
  );
};

export default RescheduleModal;
