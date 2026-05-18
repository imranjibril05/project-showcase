const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },

  profilePic: {
    type: String,
    default: "https://i.imgur.com/HeIi0wU.png"
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  }

}, { timestamps: true });

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);