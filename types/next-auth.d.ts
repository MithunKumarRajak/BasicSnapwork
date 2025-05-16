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
