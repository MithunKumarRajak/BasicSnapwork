// Mark this file as server-only to prevent client imports
import "server-only"

import mongoose, { Schema } from "mongoose"
import type { IUser } from "@/types/next-auth"

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "worker", "employer", "admin"],
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationDocuments: {
    idProof: String,
    addressProof: String,
    professionalCertificate: String,
  },
  location: {
    city: String,
    state: String,
    address: String,
  },
  skills: [String],
  bio: String,
  phone: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Create the User model
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

// Export as both default and named export
export { User }
export default User
