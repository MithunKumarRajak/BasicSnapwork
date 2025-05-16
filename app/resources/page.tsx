import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Video, BookOpen, Download, ExternalLink } from "lucide-react"

export const metadata = {
  title: "Resources - SnapWork",
  description: "Helpful resources for workers on the SnapWork platform",
}

const resourceCategories = [
  {
    title: "Getting Started",
    resources: [
      {
        title: "Complete Profile Guide",
        description: "Learn how to create a standout profile that attracts clients",
        icon: <FileText className="h-5 w-5" />,
        link: "#",
        type: "Guide",
      },
      {
        title: "Verification Process Explained",
        description: "Step-by-step guide to getting verified on SnapWork",
        icon: <Video className="h-5 w-5" />,
        link: "#",
        type: "Video",
      },
      {
        title: "Finding Your First Job",
        description: "Tips and strategies for landing your first gig",
        icon: <BookOpen className="h-5 w-5" />,
        link: "#",
        type: "Article",
      },
    ],
  },
  {
    title: "Growing Your Business",
    resources: [
      {
        title: "Setting the Right Rates",
        description: "How to price your services competitively",
        icon: <FileText className="h-5 w-5" />,
        link: "#",
        type: "Guide",
      },
      {
        title: "Marketing Your Services",
        description: "Strategies to stand out in a competitive market",
        icon: <Video className="h-5 w-5" />,
        link: "#",
        type: "Video",
      },
      {
        title: "Building Client Relationships",
        description: "Turn one-time clients into repeat business",
        icon: <BookOpen className="h-5 w-5" />,
        link: "#",
        type: "Article",
      },
    ],
  },
  {
    title: "Tools & Templates",
    resources: [
      {
        title: "Invoice Template",
        description: "Professional invoice template for your services",
        icon: <Download className="h-5 w-5" />,
        link: "#",
        type: "Download",
      },
      {
        title: "Service Agreement Template",
        description: "Protect yourself with a simple service agreement",
        icon: <Download className="h-5 w-5" />,
        link: "#",
        type: "Download",
      },
      {
        title: "Client Communication Scripts",
        description: "Professional templates for client communications",
        icon: <Download className="h-5 w-5" />,
        link: "#",
        type: "Download",
      },
    ],
  },
]

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Worker Resources
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Tools, guides, and resources to help you succeed on SnapWork
          </p>
        </div>

        <div className="space-y-12">
          {resourceCategories.map((category) => (
            <section key={category.title}>
              <h2 className="text-2xl font-semibold mb-6">{category.title}</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {category.resources.map((resource) => (
                  <Card key={resource.title} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                          {resource.type}
                        </span>
                      </div>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link href={resource.link}>
                          <span className="flex items-center">
                            {resource.icon}
                            <span className="ml-2">{resource.type === "Download" ? "Download" : "View Resource"}</span>
                          </span>
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-8 rounded-xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need More Help?</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Our support team is available to answer any questions you might have about working on SnapWork.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="#" className="flex items-center">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Help Center
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
