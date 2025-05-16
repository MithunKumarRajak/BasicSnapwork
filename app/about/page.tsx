import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const metadata = {
  title: "About Us - SnapWork",
  description: "Learn about SnapWork's mission to connect workers and clients across India",
}

const teamMembers = [
  {
    name: "Arjun Sharma",
    role: "Founder & CEO",
    bio: "Former tech executive with a passion for creating economic opportunities",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Priya Patel",
    role: "Chief Operating Officer",
    bio: "Operations expert with experience scaling marketplaces across India",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Vikram Mehta",
    role: "Chief Technology Officer",
    bio: "Tech leader with 15+ years building platforms that connect people",
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    name: "Neha Gupta",
    role: "Head of Worker Success",
    bio: "Dedicated to helping workers build sustainable careers on SnapWork",
    image: "/placeholder.svg?height=300&width=300",
  },
]

const stats = [
  { value: "50,000+", label: "Registered Workers" },
  { value: "100,000+", label: "Jobs Completed" },
  { value: "4.8/5", label: "Average Rating" },
  { value: "200+", label: "Cities Covered" },
]

const values = [
  {
    title: "Opportunity for All",
    description: "Creating economic opportunities for workers across all skill levels and backgrounds",
  },
  {
    title: "Trust & Safety",
    description: "Building a platform where both workers and clients feel secure and protected",
  },
  {
    title: "Community First",
    description: "Supporting local communities by connecting neighbors for services and jobs",
  },
  {
    title: "Continuous Improvement",
    description: "Always listening to feedback and enhancing our platform for better experiences",
  },
]

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            About SnapWork
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Connecting skilled workers with clients across India to create economic opportunities and build stronger
            communities
          </p>
        </div>

        {/* Our Story */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                SnapWork was founded in 2022 with a simple mission: to make it easier for skilled workers to find jobs
                and for clients to find reliable help.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our founder, Arjun Sharma, saw how difficult it was for his father, an electrician, to find consistent
                work despite his skills. At the same time, he noticed how people in his neighborhood struggled to find
                reliable workers for their needs.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                SnapWork was born to bridge this gap, creating a platform that values workers' skills and helps clients
                find the right person for every job. Today, we're proud to connect thousands of workers and clients
                across India every day.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 p-6 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <div key={index} className="flex items-start space-x-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Team */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{member.name}</h3>
                  <p className="text-sm text-primary">{member.role}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
