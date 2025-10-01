const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      maxlength: 15,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    bankStatementUrl: {
      type: String, 
      default: null,
    },
    bankStatementId: {
      type: String, //(for deletion/replacement)
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
