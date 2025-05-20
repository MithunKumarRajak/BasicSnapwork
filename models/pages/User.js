import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
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

// Check if the model already exists to prevent overwriting
const User = mongoose.models.User || mongoose.model("User", UserSchema)

// Export as default
export default User
// Also export as named export
export { User }
