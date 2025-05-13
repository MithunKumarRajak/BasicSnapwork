"use server"

import { hash } from "bcrypt"
import { createUser, getUserByEmail } from "@/lib/db-service"
import { redirect } from "next/navigation"
import type { User } from "@/lib/models"

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const role = formData.get("role") as "user" | "provider"
  const phone = formData.get("phone") as string

  if (!name || !email || !password || !role) {
    return { error: "All fields are required" }
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email)
  if (existingUser) {
    return { error: "Email already in use" }
  }

  // Hash password
  const hashedPassword = await hash(password, 10)

  // Create user
  const newUser: Omit<User, "_id"> = {
    name,
    email,
    password: hashedPassword,
    role,
    phone,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await createUser(newUser)

  redirect("/sign-in?success=Account created successfully")
}
