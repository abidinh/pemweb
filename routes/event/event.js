const Event = require("../../model/Event");
const User = require("../../model/User");
const authenticateToken = require("../../middleware/authenticateToken");
const express = require("express");
const router = express.Router();
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uuidv4() + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage });

router.post("/events", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const newEvent = new Event({
      title,
      description,
      price,
      image: req.file.path,
    });

    await newEvent.save();

    res
      .status(201)
      .json({ message: "Event berhasil ditambahkan", event: newEvent });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal menambahkan event", error: err.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json({ events });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data event", error: err.message });
  }
});

router.get("/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event tidak ditemukan" });
    }

    res.status(200).json({ event });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data event", error: err.message });
  }
});

router.post(
  "/users/:userId/wishlist/:eventId",
  authenticateToken,
  async (req, res) => {
    try {
      const { userId, eventId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan" });
      }

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event tidak ditemukan" });
      }

      if (user.wishlist.includes(eventId)) {
        return res
          .status(400)
          .json({ message: "Event sudah ada dalam wishlist" });
      }

      user.wishlist.push(eventId);
      await user.save();

      res
        .status(200)
        .json({ message: "Event berhasil ditambahkan ke wishlist", user });
    } catch (err) {
      res.status(500).json({
        message: "Gagal menambahkan event ke wishlist",
        error: err.message,
      });
    }
  }
);

module.exports = router;
