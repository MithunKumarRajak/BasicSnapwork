import { Check } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Pricing - SnapWork",
  description: "Affordable pricing plans for posting jobs on SnapWork",
}

const pricingPlans = [
  {
    name: "Basic",
    price: "₹499",
    duration: "per month",
    description: "Perfect for occasional job postings",
    features: [
      "Post up to 5 jobs per month",
      "Basic worker verification",
      "Standard support",
      "7-day job listings",
      "Email notifications",
    ],
    highlighted: false,
    buttonText: "Get Started",
    buttonVariant: "outline",
  },
  {
    name: "Professional",
    price: "₹1,499",
    duration: "per month",
    description: "Ideal for regular employers",
    features: [
      "Post up to 20 jobs per month",
      "Advanced worker verification",
      "Priority support",
      "14-day job listings",
      "Featured job listings",
      "Email and SMS notifications",
      "Access to premium workers",
    ],
    highlighted: true,
    buttonText: "Most Popular",
    buttonVariant: "default",
  },
  {
    name: "Enterprise",
    price: "₹3,999",
    duration: "per month",
    description: "For businesses with high volume needs",
    features: [
      "Unlimited job postings",
      "Premium worker verification",
      "24/7 dedicated support",
      "30-day job listings",
      "Featured and promoted listings",
      "All notification channels",
      "Dedicated account manager",
      "Custom branding options",
    ],
    highlighted: false,
    buttonText: "Contact Sales",
    buttonVariant: "outline",
  },
]

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Choose the plan that works best for your hiring needs
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
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          We offer tailored packages for businesses with specific requirements. Our team will work with you to create a
          custom plan that fits your needs.
        </p>
        <Button asChild size="lg">
          <Link href="/contact">Contact Our Sales Team</Link>
        </Button>
      </div>
    </div>
  )
}
