import { CheckCircle } from "lucide-react"

export const metadata = {
  title: "How It Works - SnapWork",
  description: "Learn how SnapWork connects clients with skilled workers across India",
}

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          How SnapWork Works
        </h1>

        <div className="space-y-16">
          {/* For Clients */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">For Clients</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-blue-600 dark:text-blue-300 font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Post a Job</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Describe your job, set your budget, and specify your location to reach workers in your area.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-purple-600 dark:text-purple-300 font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Review Applications</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Browse profiles of interested workers, check their ratings, and select the best match for your job.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-pink-600 dark:text-pink-300 font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Complete the Job</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Communicate through our platform, get your job done, and pay securely only when you're satisfied.
                </p>
              </div>
            </div>
          </section>

          {/* For Workers */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">For Workers</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-green-600 dark:text-green-300 font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Create Your Profile</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Showcase your skills, experience, and get verified to stand out to potential clients.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-yellow-600 dark:text-yellow-300 font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Find Jobs</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Browse available jobs in your area and skills, and apply to those that match your expertise.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-cyan-600 dark:text-cyan-300 font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Get Paid</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete jobs, build your reputation with good reviews, and receive secure payments through our
                  platform.
                </p>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Why Choose SnapWork?</h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Verified workers with skills validation</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Location-based matching for local services</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Secure payment protection</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">Rating system for quality assurance</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">24/7 customer support</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700 dark:text-gray-300">UPI and multiple payment options</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
