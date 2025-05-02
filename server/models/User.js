import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    bookmarks: {
      type: [String],
      default: [],
    },
    leetCode: {
      type: String,
      default: null,
    },
    github: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
