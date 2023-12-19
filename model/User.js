const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  firstName: String,
  lastName: String,
  password: String,
  wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
