const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  price: Number,
});

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
