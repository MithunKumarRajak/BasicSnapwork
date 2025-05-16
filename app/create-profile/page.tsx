import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, CheckCircle, Briefcase, MapPin, Star } from "lucide-react"

export const metadata = {
  title: "Create Your Profile - SnapWork",
  description: "Create your worker profile on SnapWork to find jobs in your area",
}

export default async function CreateProfilePage() {
  const session = await getServerSession(authOptions)

  // If user is logged in, redirect to dashboard/profile
  if (session) {
    redirect("/dashboard/profile")
  }

  const benefits = [
    {
      icon: <Briefcase className="h-6 w-6 text-blue-500" />,
      title: "Access to Jobs",
      description: "Get matched with jobs that fit your skills and location",
    },
    {
      icon: <Star className="h-6 w-6 text-yellow-500" />,
      title: "Build Your Reputation",
      description: "Earn reviews and ratings to stand out to potential clients",
    },
    {
      icon: <MapPin className="h-6 w-6 text-red-500" />,
      title: "Local Opportunities",
      description: "Find work in your neighborhood and community",
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Verification Badge",
      description: "Get verified to build trust with potential clients",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Create Your Worker Profile
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join thousands of workers finding flexible jobs and gigs across India
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Get Started Today</CardTitle>
                <CardDescription>Create your profile in minutes and start finding jobs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-6">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3 flex-shrink-0">
                        {step}
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {step === 1 && "Create an account"}
                          {step === 2 && "Complete your profile"}
                          {step === 3 && "Start applying for jobs"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {step === 1 && "Sign up with your email and create a password"}
                          {step === 2 && "Add your skills, experience, and get verified"}
                          {step === 3 && "Browse jobs in your area and start earning"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button asChild size="lg" className="w-full button-gradient">
                    <Link href="/register">
                      Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline">
                      Log in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Why Create a Profile?</h2>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="mr-4 flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="font-medium">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 rounded-lg">
              <p className="text-sm italic">
                "SnapWork has helped me find consistent work in my neighborhood. The verification process gave clients
                confidence in my skills."
                <span className="block mt-2 font-medium">— Rajesh K., Electrician from Bangalore</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
