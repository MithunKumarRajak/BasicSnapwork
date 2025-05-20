// Client-safe type definitions for models (NO database imports)

export interface User {
  _id: string
  name: string
  email: string
  profileImage?: string
  bio?: string
  skills?: string[]
  location?: {
    city?: string
    state?: string
    address?: string
  }
  phone?: string
  isVerified: boolean
  verificationStatus?: string
  rating?: number
  reviewCount?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Job {
  _id: string
  title: string
  description: string
  category: string
  budget: {
    min: number
    max: number
  }
  location: {
    city: string
    state: string
    address?: string
  }
  skills: string[]
  postedBy: string | User
  status: string
  applications?: string[]
  hiredApplicant?: string | User
  createdAt?: Date
  updatedAt?: Date
}

export interface Application {
  _id: string
  jobId: string | Job
  applicantId: string | User
  coverLetter: string
  expectedRate: number
  availability: string
  status: string
  employerNotes?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Service {
  _id: string
  title: string
  description: string
  price: number
  category: string
  images: string[]
  location: string
  provider: string | User
  rating?: number
  reviewCount?: number
  reviews?: Array<{
    user: string | User
    rating: number
    comment: string
    createdAt: Date
  }>
  availability?: {
    days: string[]
    timeSlots: string[]
  }
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}
