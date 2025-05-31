import type { Metadata } from "next"
import LoginForm from "@/components/LoginForm"

export const metadata: Metadata = {
  title: "Login - SnapWork",
  description: "Login to your SnapWork account",
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  )
}
