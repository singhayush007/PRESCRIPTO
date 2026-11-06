import React, { useContext, useState } from "react";
import { appointmentsService } from "@/features/my-appointments/services/appointments.service";
import { toast } from "react-toastify";
import { AppContext } from "@/store/AppContext";
import Modal from "@/components/common/Modal";
import StarRating from "@/components/common/StarRating";

const ReviewModal = ({ appointment, onClose, onDone }) => {
  const { getDoctosData } = useContext(AppContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating) return toast.warning("Please select a star rating");
    setLoading(true);
    try {
      const data = await appointmentsService.addReview({
        appointmentId: appointment._id,
        rating,
        comment,
      });
      if (data.success) {
        toast.success(data.message);
        getDoctosData(); // refresh doctor's average rating
        onDone();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Rate ${appointment.docData.name}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <StarRating value={rating} onChange={setRating} size="text-4xl" />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={4}
          placeholder="Share your experience (optional)"
          className="input"
        />
        <button onClick={submit} disabled={loading} className="btn-primary">
          {loading ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </Modal>
  );
};

export default ReviewModal;
