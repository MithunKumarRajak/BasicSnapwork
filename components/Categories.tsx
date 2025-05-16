"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Home, Wrench, Zap, Paintbrush, Truck, Hammer, Droplet, Wifi, Utensils, Shirt } from "lucide-react"

const categories = [
  { name: "Household Help", icon: Home, color: "from-blue-500 to-blue-600" },
  { name: "Plumbing", icon: Droplet, color: "from-cyan-500 to-cyan-600" },
  { name: "Electrical", icon: Zap, color: "from-amber-500 to-amber-600" },
  { name: "Carpentry", icon: Hammer, color: "from-orange-500 to-orange-600" },
  { name: "Painting", icon: Paintbrush, color: "from-purple-500 to-purple-600" },
  { name: "Appliance Repair", icon: Wrench, color: "from-red-500 to-red-600" },
  { name: "Moving", icon: Truck, color: "from-green-500 to-green-600" },
  { name: "Internet", icon: Wifi, color: "from-indigo-500 to-indigo-600" },
  { name: "Cooking", icon: Utensils, color: "from-pink-500 to-pink-600" },
  { name: "Laundry", icon: Shirt, color: "from-teal-500 to-teal-600" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Categories() {
  const router = useRouter()

  const handleCategoryClick = (category: string) => {
    router.push(`/jobs?category=${encodeURIComponent(category.toLowerCase())}`)
  }

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
            <span className="text-gradient">Popular Categories</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse through the most in-demand service categories across India. Find skilled professionals for all your
            needs.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {categories.map((category) => (
            <motion.div
              key={category.name}
              variants={item}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="card-hover cursor-pointer"
              onClick={() => handleCategoryClick(category.name)}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden h-full">
                <div className={`bg-gradient-to-r ${category.color} p-4 flex justify-center`}>
                  <category.icon className="h-8 w-8 text-white" />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-center">{category.name}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
