import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import dbConnect from "@/lib/db"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json({ message: "Name must be at least 2 characters long" }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || "user",
      verificationStatus: "unverified",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await user.save()

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
