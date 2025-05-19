import "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    profileImage?: string
    role?: string
    verificationStatus?: string
  }

  interface Session {
    user: {
      id: string
      name: string
      email: string
      profileImage?: string
      role?: string
      verificationStatus?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    profileImage?: string
  }
}

export interface IUser {
  name: string
  email: string
  password?: string
  image?: string
  role: "user" | "worker" | "employer" | "admin"
  isVerified: boolean
  verificationDocuments: {
    idProof: string
    addressProof: string
    professionalCertificate: string
  }
  location: {
    city: string
    state: string
    address: string
  }
  skills: string[]
  bio: string
  phone: string
  createdAt: Date
  updatedAt: Date
  profileImage?: string
  verificationStatus?: string
  _id?: any
}
