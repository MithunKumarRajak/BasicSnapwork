import dbConnect from "@/lib/db"
import User from "@/models/User"
import { hash, compare } from "bcryptjs"

export async function createUser(userData: {
  name: string
  email: string
  password: string
  role?: string
}) {
  await dbConnect()

  // Check if user already exists
  const existingUser = await User.findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await hash(userData.password, 10)

  // Create user
  const user = new User({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || "user",
    verificationStatus: "unverified",
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await user.save()

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export async function getUserByEmail(email: string) {
  await dbConnect()
  return User.findOne({ email }).select("-password")
}

export async function getUserById(id: string) {
  await dbConnect()
  return User.findById(id).select("-password")
}

export async function updateUserProfile(id: string, profileData: any) {
  await dbConnect()

  // Fields that are allowed to be updated
  const allowedFields = ["name", "phone", "location", "bio", "skills", "profileImage"]

  // Filter out fields that are not allowed to be updated
  const updateData = Object.keys(profileData)
    .filter((key) => allowedFields.includes(key))
    .reduce(
      (obj, key) => {
        obj[key] = profileData[key]
        return obj
      },
      {} as Record<string, any>,
    )

  return User.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true },
  ).select("-password")
}

export async function verifyUserCredentials(email: string, password: string) {
  await dbConnect()

  const user = await User.findOne({ email })
  if (!user) {
    return null
  }

  const isPasswordValid = await compare(password, user.password)
  if (!isPasswordValid) {
    return null
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    profileImage: user.profileImage,
    role: user.role || "user",
    verificationStatus: user.verificationStatus,
  }
}
