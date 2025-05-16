"use client"

import { motion } from "framer-motion"
import { Search, UserCheck, Calendar, ThumbsUp } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Find Workers",
    description: "Search for skilled workers in your area based on the service you need.",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: UserCheck,
    title: "Verify Credentials",
    description: "Check ratings, reviews, and verification status to choose the right person.",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Calendar,
    title: "Schedule Work",
    description: "Book the service at your convenient time and discuss requirements.",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: ThumbsUp,
    title: "Get Work Done",
    description: "Get your work done professionally and pay securely through our platform.",
    color: "from-green-500 to-green-600",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-gradient">How SnapWork Works</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            SnapWork makes it easy to find and hire skilled workers for your daily needs. Follow these simple steps to
            get started.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((step, index) => (
            <motion.div key={step.title} variants={item} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full card-hover">
                <div className={`bg-gradient-to-r ${step.color} p-6 flex justify-center`}>
                  <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-center">{step.description}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
