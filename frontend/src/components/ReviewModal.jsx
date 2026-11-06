import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import Modal from "./Modal";
import StarRating from "./StarRating";

const ReviewModal = ({ appointment, onClose, onDone }) => {
  const { backendUrl, token, getDoctosData } = useContext(AppContext);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!rating) return toast.warning("Please select a star rating");
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/add-review",
        { appointmentId: appointment._id, rating, comment },
        { headers: { token } }
      );
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
        <button
          onClick={submit}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Submitting..." : "Submit review"}
        </button>
      </div>
    </Modal>
  );
};

export default ReviewModal;
