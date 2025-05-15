import clientPromise from "../lib/mongodb"

const categories = [
  "household-help",
  "electrician",
  "plumbing",
  "delivery",
  "cooking",
  "painting",
  "construction",
  "salon-services",
]

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
]

const states = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Telangana",
  "Tamil Nadu",
  "West Bengal",
  "Maharashtra",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
]

const jobTitles = {
  "household-help": [
    "Need house cleaning help for 3BHK apartment",
    "Looking for a part-time maid for daily chores",
    "Require domestic help for elderly care",
    "Need help with laundry and ironing",
    "Seeking household help for weekend cleaning",
  ],
  electrician: [
    "Electrician needed for home wiring repair",
    "Need to install ceiling fans in 3 rooms",
    "Electrician required for switchboard replacement",
    "Looking for electrician to fix power fluctuation issue",
    "Need help with electrical appliance installation",
  ],
  plumbing: [
    "Plumber needed for bathroom leak repair",
    "Looking for plumber to fix kitchen sink",
    "Need plumbing work for new water purifier installation",
    "Plumber required for toilet repair",
    "Seeking experienced plumber for pipe fitting",
  ],
  delivery: [
    "Need courier delivery from Mumbai to Pune",
    "Looking for someone to deliver documents within city",
    "Food delivery partner needed for restaurant",
    "Require delivery person for small packages",
    "Need delivery help for online store orders",
  ],
  cooking: [
    "Cook needed for family of four",
    "Looking for chef to prepare meals for party",
    "Need cook for South Indian cuisine",
    "Require part-time cook for breakfast and dinner",
    "Seeking experienced cook for vegetarian meals",
  ],
  painting: [
    "Painter needed for 2BHK apartment",
    "Looking for wall painting service",
    "Need to paint exterior of house",
    "Require painter for touch-up work",
    "Seeking professional painter for office space",
  ],
  construction: [
    "Mason needed for bathroom renovation",
    "Looking for construction worker for small repairs",
    "Need help with building compound wall",
    "Require labor for house construction",
    "Seeking skilled worker for tile laying",
  ],
  "salon-services": [
    "Need home salon service for haircut",
    "Looking for beautician for bridal makeup",
    "Require home manicure and pedicure service",
    "Need makeup artist for event",
    "Seeking hair stylist for family function",
  ],
}

const descriptions = {
  "household-help": [
    "I need someone reliable to help with daily household chores including cleaning, dusting, and mopping. The house is a 3BHK apartment and would require about 2-3 hours of work daily.",
    "Looking for a dependable person to help with household work. Tasks include cleaning, washing dishes, and general upkeep. Timing would be flexible based on mutual convenience.",
    "Need assistance with taking care of an elderly family member. Responsibilities include helping with meals, medication reminders, and light cleaning. Experience with elderly care preferred.",
  ],
  electrician: [
    "There are some electrical issues in my home that need fixing. The main problem is with the wiring in the living room where the lights flicker occasionally. Need someone experienced to diagnose and fix the issue.",
    "I need to install ceiling fans in three bedrooms. The wiring is already in place, but the fans need to be mounted and connected. Please bring necessary tools for the job.",
    "Looking for an electrician to replace old switchboards in the entire house. There are about 8 switchboards that need replacement with modern ones. Materials will be provided.",
  ],
  plumbing: [
    "There's a leak in the bathroom that needs urgent repair. The water is seeping through the wall and causing damage. Need an experienced plumber to fix this issue.",
    "The kitchen sink is clogged and water drains very slowly. Need a plumber to unclog the pipes and ensure proper drainage. Please bring necessary tools.",
    "Need help with installing a new water purifier in the kitchen. The connection needs to be made to the main water line. Looking for someone with experience in such installations.",
  ],
  delivery: [
    "I need someone to deliver a small package from Mumbai to Pune. The package contains documents and is not heavy. Delivery should be made within 2 days.",
    "Looking for someone to deliver important documents within the city. The pickup and delivery locations are about 15 km apart. Need delivery on the same day.",
    "Our restaurant needs a delivery partner for food deliveries within a 5 km radius. This would be a regular arrangement with multiple deliveries per day.",
  ],
  cooking: [
    "Need a cook for a family of four. The requirement is for preparing breakfast and dinner daily. Should be able to cook both North and South Indian cuisine.",
    "Looking for a chef to prepare meals for a house party of 20 people. The menu would include appetizers, main course, and desserts. Event is scheduled for next weekend.",
    "Need someone who can cook authentic South Indian dishes. The requirement is for lunch and dinner for a family of three. Should be able to prepare items like dosa, idli, and sambar.",
  ],
  painting: [
    "Need to get my 2BHK apartment painted. All walls need fresh paint, and there are some areas that need repair before painting. Paint will be provided.",
    "Looking for wall painting service for the living room and two bedrooms. The walls are in good condition and just need a fresh coat of paint. Prefer someone who can complete the job within 3-4 days.",
    "Need to paint the exterior of my house before the monsoon season. The house is a single-story building with approximately 1500 sq ft of exterior wall area.",
  ],
  construction: [
    "Need a mason for bathroom renovation. The work includes replacing tiles, fixing the shower area, and some plumbing work. Materials will be provided.",
    "Looking for a construction worker for small repairs around the house. Tasks include fixing cracks in walls, repairing a broken step, and some plastering work.",
    "Need help with building a compound wall around my plot. The perimeter is approximately 200 feet. Need someone experienced in brick laying and plastering.",
  ],
  "salon-services": [
    "Need home salon service for haircut and styling. Looking for someone who can come to my home this weekend. Prefer experienced professionals only.",
    "Looking for a beautician for bridal makeup. The wedding is next month, and a trial session would be required before the actual day. Need someone who specializes in Indian bridal makeup.",
    "Require home manicure and pedicure service. Looking for a professional who can bring their own tools and materials. Service needed for two people.",
  ],
}

const skillsByCategory = {
  "household-help": ["Cleaning", "Cooking", "Laundry", "Dusting", "Mopping"],
  electrician: ["Wiring", "Appliance Repair", "Circuit Installation", "Lighting", "Troubleshooting"],
  plumbing: ["Pipe Fitting", "Leak Repair", "Drainage", "Fixture Installation", "Water Heater"],
  delivery: ["Driving", "Navigation", "Time Management", "Customer Service", "Package Handling"],
  cooking: ["Vegetarian", "Non-Vegetarian", "Baking", "North Indian", "South Indian"],
  painting: ["Wall Painting", "Texture Painting", "Primer Application", "Paint Mixing", "Surface Preparation"],
  construction: ["Masonry", "Tiling", "Plastering", "Concrete Work", "Carpentry"],
  "salon-services": ["Haircut", "Styling", "Makeup", "Manicure", "Pedicure"],
}

async function seedDemoJobs() {
  console.log("Connecting to MongoDB...")
  const client = await clientPromise
  const db = client.db("snapwork")

  // Get a provider user to assign as the job poster
  const provider = await db.collection("users").findOne({ role: "provider" })

  if (!provider) {
    console.error("No provider user found. Please seed users first.")
    process.exit(1)
  }

  const providerId = provider._id

  console.log("Creating demo jobs...")

  const demoJobs = []

  // Create 5 jobs for each category
  for (const category of categories) {
    for (let i = 0; i < 5; i++) {
      const cityIndex = Math.floor(Math.random() * cities.length)
      const city = cities[cityIndex]
      const state = states[cityIndex]
      const location = `${city}, ${state}`

      const titles = jobTitles[category as keyof typeof jobTitles]
      const title = titles[i % titles.length]

      const categoryDescriptions = descriptions[category as keyof typeof descriptions]
      const description = categoryDescriptions[i % categoryDescriptions.length]

      const skills = skillsByCategory[category as keyof typeof skillsByCategory]
      const jobSkills = skills.slice(0, Math.floor(Math.random() * 3) + 2) // Random 2-4 skills

      const budget = Math.floor(Math.random() * 4000) + 1000 // Random budget between 1000-5000

      demoJobs.push({
        title,
        description,
        category,
        budget,
        location,
        city,
        state,
        skills: jobSkills,
        postedBy: providerId,
        status: "open",
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)), // Random date within last week
        updatedAt: new Date(),
      })
    }
  }

  // Insert all demo jobs
  const result = await db.collection("jobs").insertMany(demoJobs)
  console.log(`${result.insertedCount} demo jobs created`)

  console.log("Demo jobs seeded successfully!")
  process.exit(0)
}

seedDemoJobs().catch((error) => {
  console.error("Error seeding demo jobs:", error)
  process.exit(1)
})
