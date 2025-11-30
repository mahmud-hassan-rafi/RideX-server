import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [3, "Firstname must be at least 3 characters"],
  },
  lastName: {
    type: String,
    minlength: [3, "Lastname must be at least 3 characters"],
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  socketID: { type: String },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};
