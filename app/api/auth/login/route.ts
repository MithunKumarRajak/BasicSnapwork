import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { dbConnect } from "@/lib/db"
import { User } from "@/models/User"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Return user without password
    const userWithoutPassword = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    }

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
