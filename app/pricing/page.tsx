import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Pricing - SnapWork",
  description: "SnapWork is completely free for all users - post and find jobs at no cost",
}

const pricingPlans = [
  {
    name: "Free",
    price: "₹0",
    duration: "forever",
    description: "Everything you need to get started",
    features: [
      "Post unlimited jobs",
      "Apply to unlimited jobs",
      "Basic worker verification",
      "Standard support",
      "30-day job listings",
      "Email notifications",
      "Create detailed profiles",
    ],
    highlighted: true,
    buttonText: "Get Started",
    buttonVariant: "default",
  },
  {
    name: "Premium Worker",
    price: "Coming Soon",
    duration: "optional",
    description: "Enhanced features for serious workers",
    features: [
      "Verified badge on profile",
      "Priority in search results",
      "Advanced analytics",
      "Priority support",
      "Featured profile",
      "Early access to new jobs",
      "Professional profile templates",
    ],
    highlighted: false,
    buttonText: "Join Waitlist",
    buttonVariant: "outline",
  },
  {
    name: "Premium Employer",
    price: "Coming Soon",
    duration: "optional",
    description: "For businesses with high volume needs",
    features: [
      "Featured job listings",
      "Premium worker access",
      "Advanced filtering",
      "Priority support",
      "Dedicated account manager",
      "Custom branding options",
      "Detailed analytics",
    ],
    highlighted: false,
    buttonText: "Join Waitlist",
    buttonVariant: "outline",
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          SnapWork is 100% Free
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
          Connect workers and employers without any fees or commissions
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          We believe in providing equal opportunities for everyone. That's why SnapWork is and will always remain free
          for all users.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl overflow-hidden border ${
              plan.highlighted
                ? "border-primary shadow-lg shadow-primary/20 relative"
                : "border-gray-200 dark:border-gray-700"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
              </div>
            )}

            <div className="p-6 bg-white dark:bg-gray-800">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-extrabold">{plan.price}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">{plan.duration}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>

              <ul className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  asChild
                  className={`w-full ${plan.highlighted ? "button-gradient" : ""}`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href="/register">{plan.buttonText}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">How do we keep SnapWork free?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          SnapWork is committed to providing a free platform for all users. We're currently exploring optional premium
          features that will help sustain our platform while keeping the core functionality completely free.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Have Questions? Contact Us</Link>
        </Button>
      </div>
    </div>
  )
}
