const PickupRequest = require("../models/PickupRequest");
const cloudinary = require("cloudinary").v2;

exports.getAssignedPickups = async (req, res) => {
  try {
    const pickups = await PickupRequest.find({
      workerId: req.user.id,
    }).populate("userId", "name address");
    res.json(pickups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePickupStatus = async (req, res) => {
  const { pickupId, status, imageUrl } = req.body;
  try {
    const pickup = await PickupRequest.findById(pickupId);
    if (!pickup || pickup.workerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let uploadedImage = ""

    if (imageUrl) {
      if (pickup.image) {
        await cloudinary.uploader.destroy(
          pickup.image.split("/").pop().split(".")[0]
        );
      }
      const result = await cloudinary.uploader.upload(imageUrl);
      uploadedImage = result.secure_url;
    }

    pickup.status = status;
    pickup.image = uploadedImage;
    await pickup.save();
    res.json(pickup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
