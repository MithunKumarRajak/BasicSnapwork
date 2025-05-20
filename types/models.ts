// User type definition for client-side
export interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string
  isVerified: boolean
  verificationDocuments?: {
    idProof?: string
    addressProof?: string
    professionalCertificate?: string
  }
  location?: {
    city?: string
    state?: string
    address?: string
  }
  skills?: string[]
  bio?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

// Job type definition for client-side
export interface Job {
  id: string
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
  duration: string
  postedBy: User | string
  status: "open" | "in-progress" | "completed" | "cancelled"
  applications: string[] | Application[]
  hiredApplicant?: User | string
  createdAt: string
  updatedAt: string
}

// Application type definition for client-side
export interface Application {
  id: string
  job: Job | string
  applicant: User | string
  coverLetter: string
  expectedPay: number
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  createdAt: string
  updatedAt: string
}

// Service type definition for client-side
export interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  location: {
    city: string
    state: string
    address?: string
  }
  provider: User | string
  images: string[]
  rating: {
    average: number
    count: number
  }
  reviews: Array<{
    user: User | string
    rating: number
    comment: string
    createdAt: string
  }>
  availability: {
    days: string[]
    hours: {
      start: string
      end: string
    }
  }
  createdAt: string
  updatedAt: string
}
