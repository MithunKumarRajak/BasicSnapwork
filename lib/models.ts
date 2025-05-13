import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  role: "user" | "provider" | "admin"
  createdAt: Date
  updatedAt: Date
  profileImage?: string
}

export interface Service {
  _id?: ObjectId
  title: string
  description: string
  price: number
  category: string
  providerId: ObjectId
  location: string
  images: string[]
  rating?: number
  reviewCount?: number
  createdAt: Date
  updatedAt: Date
  tags?: string[]
  isActive: boolean
}

export interface Review {
  _id?: ObjectId
  serviceId: ObjectId
  userId: ObjectId
  rating: number
  comment: string
  createdAt: Date
}

export interface Booking {
  _id?: ObjectId
  serviceId: ObjectId
  userId: ObjectId
  providerId: ObjectId
  status: "pending" | "confirmed" | "completed" | "cancelled"
  date: Date
  time: string
  price: number
  address: string
  city: string
  state: string
  pincode: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  _id?: ObjectId
  name: string
  icon: string
  slug: string
  description?: string
}
