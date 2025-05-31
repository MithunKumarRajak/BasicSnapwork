import type { Metadata } from "next"
import RegisterForm from "@/components/RegisterForm"

export const metadata: Metadata = {
  title: "Register - SnapWork",
  description: "Create a new SnapWork account",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <RegisterForm />
    </div>
  )
}
