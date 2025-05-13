import clientPromise from "../lib/mongodb"
import { hash } from "bcryptjs"

async function seedDatabase() {
  console.log("Connecting to MongoDB...")
  const client = await clientPromise
  const db = client.db("snapwork")

  // Clear existing data
  await db.collection("users").deleteMany({})
  await db.collection("services").deleteMany({})
  await db.collection("categories").deleteMany({})
  await db.collection("reviews").deleteMany({})
  await db.collection("bookings").deleteMany({})

  console.log("Creating categories...")
  const categories = [
    {
      name: "Household",
      slug: "household",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>',
      description: "Services for your home including cleaning, repairs, and maintenance",
    },
    {
      name: "Tech Help",
      slug: "tech-help",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><rect width="14" height="8" x="5" y="2" rx="2" /><rect width="20" height="8" x="2" y="14" rx="2" /><path d="M6 18h2" /><path d="M12 18h6" /></svg>',
      description: "Technical support for computers, phones, and other devices",
    },
    {
      name: "Labor",
      slug: "labor",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>',
      description: "Physical labor services including moving, lifting, and construction",
    },
    {
      name: "Gardening",
      slug: "gardening",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M12 19c0-4.2-2.8-7-7-7" /><path d="M12 19c0-4.2 2.8-7 7-7" /><path d="M12 19V5" /></svg>',
      description: "Garden maintenance, landscaping, and plant care",
    },
    {
      name: "Tutoring",
      slug: "tutoring",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>',
      description: "Educational tutoring for students of all ages",
    },
    {
      name: "Delivery",
      slug: "delivery",
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6"><circle cx="12" cy="12" r="10" /><line x1="2" x2="22" y1="12" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>',
      description: "Delivery services for food, packages, and more",
    },
  ]

  const categoryResult = await db.collection("categories").insertMany(categories)
  console.log(`${categoryResult.insertedCount} categories created`)

  console.log("Creating users...")
  const hashedPassword = await hash("password123", 10)

  const users = [
    {
      name: "Provider User",
      email: "provider@example.com",
      password: hashedPassword,
      phone: "9876543210",
      role: "provider",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Customer User",
      email: "customer@example.com",
      password: hashedPassword,
      phone: "9876543211",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  const userResult = await db.collection("users").insertMany(users)
  console.log(`${userResult.insertedCount} users created`)

  const providerId = userResult.insertedIds[0]

  console.log("Creating services...")
  const services = [
    {
      title: "Professional Home Cleaning",
      description:
        "Complete home cleaning service including dusting, vacuuming, mopping, and bathroom cleaning. I use eco-friendly cleaning products and provide all cleaning supplies.",
      price: 500,
      category: "household",
      providerId,
      location: "Mumbai, Maharashtra",
      images: ["/placeholder.svg?height=400&width=600"],
      rating: 4.8,
      reviewCount: 24,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    {
      title: "Computer Repair and Troubleshooting",
      description:
        "Expert computer repair and troubleshooting services. I can help with hardware issues, software problems, virus removal, data recovery, and system optimization.",
      price: 800,
      category: "tech-help",
      providerId,
      location: "Mumbai, Maharashtra",
      images: ["/placeholder.svg?height=400&width=600"],
      rating: 4.9,
      reviewCount: 18,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
    {
      title: "Furniture Assembly",
      description:
        "Quick and reliable furniture assembly service. I can assemble all types of furniture including beds, tables, chairs, wardrobes, and more from any brand.",
      price: 600,
      category: "labor",
      providerId,
      location: "Mumbai, Maharashtra",
      images: ["/placeholder.svg?height=400&width=600"],
      rating: 4.7,
      reviewCount: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    },
  ]

  const serviceResult = await db.collection("services").insertMany(services)
  console.log(`${serviceResult.insertedCount} services created`)

  console.log("Database seeded successfully!")
  process.exit(0)
}

seedDatabase().catch((error) => {
  console.error("Error seeding database:", error)
  process.exit(1)
})
