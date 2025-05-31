import mongoose, { Schema } from "mongoose"

export interface IUser {
  _id: string
  name: string
  email: string
  password?: string
  role: "user" | "worker" | "employer"
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "worker", "employer"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
