import type { Metadata } from "next"
import RegisterForm from "@/components/RegisterForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Register - SnapWork",
  description: "Create a new SnapWork account",
}

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Enter your details to create a new account</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Register</CardTitle>
            <CardDescription>Fill in the form below to create your account</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
