// Environment variables with fallbacks
export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || "",
    dbName: "snapwork",
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
  },
  app: {
    name: "Snapwork",
    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  },
}

// Validate required environment variables
export function validateConfig() {
  const requiredEnvVars = [
    { key: "MONGODB_URI", value: config.mongodb.uri },
    { key: "NEXTAUTH_SECRET", value: config.auth.secret },
  ]

  const missingEnvVars = requiredEnvVars.filter(({ value }) => !value)

  if (missingEnvVars.length > 0) {
    const missingKeys = missingEnvVars.map(({ key }) => key).join(", ")
    throw new Error(`Missing required environment variables: ${missingKeys}`)
  }
}

// Export a function to get MongoDB connection string with proper error handling
export function getMongoDBUri() {
  if (!config.mongodb.uri) {
    console.error("MONGODB_URI environment variable is not set")

    // In development, provide a helpful message
    if (process.env.NODE_ENV === "development") {
      console.error("Make sure you have set the MONGODB_URI in your .env.local file")
      console.error("Format should be: mongodb+srv://<username>:<password>@<cluster-url>/<database>")
    }

    throw new Error("MongoDB URI is not configured")
  }

  return config.mongodb.uri
}
