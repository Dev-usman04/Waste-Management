import { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Button from "../common/Button.jsx";
import { AuthContext } from "../../context/AuthContext.jsx";
import Card from "../common/Card.jsx";
import Spinner from "../common/Spinner.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../common/Modal.jsx";
import api from "../../config/api.js";

const PickupForm = () => {
  const { user } = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    pickupType: "",
    dateTime: "",
    image: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [missedModalOpen, setMissedModalOpen] = useState(false);
  const [pickups, setPickups] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [missedReason, setMissedReason] = useState("");
  const [missedLoading, setMissedLoading] = useState(false);

  useEffect(() => {
    if (missedModalOpen) {
      api
        .get("/api/user/pickup/history", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        })
        .then((res) => setPickups(res.data))
        .catch(() => setPickups([]));
    }
  }, [missedModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   const payload = {
      address: formData.address,
      pickupType: formData.pickupType,
      dateTime: formData.dateTime,
      image: imagePreview, // base64 string
    };

    try {
      await api.post("/api/user/pickup", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFormData({ address: "", pickupType: "", dateTime: "", image: null });
      setImagePreview(null);
      setError("");
      toast.success("Pickup scheduled successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Error scheduling pickup");
      toast.error(error.response?.data?.message || "Error scheduling pickup");
    } finally {
      setLoading(false);
    }
  };

  const handleMissedSubmit = async (e) => {
    e.preventDefault();
    setMissedLoading(true);
    try {
      await api.post(
        "/api/user/missed",
        {
          pickupId: selectedPickup,
          reason: missedReason,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      toast.success("Missed pickup reported!");
      setMissedModalOpen(false);
      setSelectedPickup("");
      setMissedReason("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error reporting missed pickup"
      );
    } finally {
      setMissedLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-slate-800 mb-4">
        Schedule Pickup
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-slate-700">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-700">Pickup Type</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={formData.pickupType}
            onChange={(e) =>
              setFormData({ ...formData, pickupType: e.target.value })
            }
          >
            <option value="">Select Type</option>
            <option value="Recyclable">Recyclable</option>
            <option value="Organic">Organic</option>
            <option value="Hazardous">Hazardous</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-slate-700">Date & Time</label>
          <input
            type="datetime-local"
            className="w-full p-2 border rounded-lg"
            value={formData.dateTime}
            onChange={(e) =>
              setFormData({ ...formData, dateTime: e.target.value })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-slate-700">
            Upload Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-lg"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-full h-32 object-cover rounded"
            />
          )}
        </div>
        {loading ? <Spinner /> : <Button type="submit">Schedule Pickup</Button>}
      </form>
      <Button
        type="button"
        className="mt-4 bg-red-500 hover:bg-red-600"
        onClick={() => setMissedModalOpen(true)}
      >
        Report Missed Pickup
      </Button>
      <Modal
        isOpen={missedModalOpen}
        onClose={() => setMissedModalOpen(false)}
        title="Report Missed Pickup"
      >
        <form onSubmit={handleMissedSubmit}>
          <div className="mb-4">
            <label className="block text-slate-700">Select Pickup</label>
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedPickup}
              onChange={(e) => setSelectedPickup(e.target.value)}
              required
            >
              <option value="">Select a pickup</option>
              {pickups.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.address} - {new Date(p.dateTime).toLocaleString()} (
                  {p.status})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-slate-700">Reason</label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={missedReason}
              onChange={(e) => setMissedReason(e.target.value)}
              required
            />
          </div>
          {missedLoading ? (
            <Spinner />
          ) : (
            <Button type="submit">Submit Report</Button>
          )}
        </form>
      </Modal>
      <ToastContainer />
    </Card>
  );
};

export default PickupForm;
