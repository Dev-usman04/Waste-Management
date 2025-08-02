import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Button from "../common/Button.jsx";
import Modal from "../common/Modal.jsx";
import Spinner from "../common/Spinner.jsx";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../config/api.js";

const PickupStatus = ({ pickup, setPickups }) => {
  const [status, setStatus] = useState(pickup.status);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStatusUpdate = async () => {
    setLoading(true);

    const payload = {
      pickupId: pickup._id,
      status: status,
      imageUrl: imagePreview, // base64 string
    };

    try {
      const res = await api.put("/api/worker/pickup/status", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPickups((prev) =>
        prev.map((p) =>
          p._id === pickup._id
            ? { ...p, status: res.data.status, image: res.data.image }
            : p
        )
      );

      toast.success("Pickup status updated successfully!");
      setIsModalOpen(false);
      setError("");
    } catch (error) {
      const message = error.response?.data?.message || "Error updating status";
      setError(message);

      toast.error(message, {
        autoClose: 4000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-4 rounded-lg shadow-lg"
    >
      <p>
        <strong>Address:</strong> {pickup.address}
      </p>
      <p>
        <strong>Type:</strong> {pickup.pickupType}
      </p>
      <p>
        <strong>Date:</strong> {new Date(pickup.dateTime).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {pickup.status}
      </p>
      {pickup.image && (
        <img
          src={pickup.image}
          alt="Pickup"
          className="w-full h-32 object-cover mt-2 rounded"
        />
      )}
      <Button onClick={() => setIsModalOpen(true)} className="mt-4">
        Update Status
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Update Pickup Status"
      >
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-slate-700">Status</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Collected">Collected</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-slate-700">
            Upload Proof Image (Optional)
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
        {loading ? (
          <Spinner />
        ) : (
          <Button onClick={handleStatusUpdate}>Update</Button>
        )}
      </Modal>

      {/* Include only once per app ideally */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </motion.div>
  );
};

export default PickupStatus;
