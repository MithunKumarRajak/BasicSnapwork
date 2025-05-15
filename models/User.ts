import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  name: string
  email: string
  password: string
  profileImage?: string
  bio?: string
  skills?: string[]
  location?: string
  phone?: string
  isVerified: boolean
  verificationDocuments?: string[]
  verificationStatus: "unverified" | "pending" | "verified"
  rating?: number
  reviewCount?: number
  createdAt: Date
  updatedAt: Date
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    bio: { type: String },
    skills: [{ type: String }],
    location: { type: String },
    phone: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{ type: String }],
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified"],
      default: "unverified",
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
