import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import type { User, Service, Review, Booking, Category } from "./models"

export async function getCollection(collectionName: string) {
  try {
    const client = await clientPromise
    const db = client.db("snapwork")
    return db.collection(collectionName)
  } catch (error) {
    console.error(`Error connecting to ${collectionName} collection:`, error)
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// User operations
export async function getUserByEmail(email: string) {
  try {
    const collection = await getCollection("users")
    return collection.findOne({ email }) as Promise<User | null>
  } catch (error) {
    console.error("Error in getUserByEmail:", error)
    return null
  }
}

export async function getUserById(id: string) {
  try {
    const collection = await getCollection("users")
    return collection.findOne({ _id: new ObjectId(id) }) as Promise<User | null>
  } catch (error) {
    console.error("Error in getUserById:", error)
    return null
  }
}

export async function createUser(user: Omit<User, "_id">) {
  try {
    const collection = await getCollection("users")
    const result = await collection.insertOne(user as any)
    return { ...user, _id: result.insertedId }
  } catch (error) {
    console.error("Error in createUser:", error)
    throw new Error(`Failed to create user: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Service operations
export async function getServices(limit = 10, category?: string) {
  try {
    const collection = await getCollection("services")
    const query = category ? { category, isActive: true } : { isActive: true }
    return collection.find(query).limit(limit).sort({ createdAt: -1 }).toArray() as Promise<Service[]>
  } catch (error) {
    console.error("Error in getServices:", error)
    return []
  }
}

export async function getServiceById(id: string) {
  try {
    const collection = await getCollection("services")
    return collection.findOne({ _id: new ObjectId(id) }) as Promise<Service | null>
  } catch (error) {
    console.error("Error in getServiceById:", error)
    return null
  }
}

export async function getServicesByProvider(providerId: string) {
  try {
    const collection = await getCollection("services")
    return collection.find({ providerId: new ObjectId(providerId), isActive: true }).toArray() as Promise<Service[]>
  } catch (error) {
    console.error("Error in getServicesByProvider:", error)
    return []
  }
}

export async function createService(service: Omit<Service, "_id">) {
  try {
    const collection = await getCollection("services")
    const result = await collection.insertOne(service as any)
    return { ...service, _id: result.insertedId }
  } catch (error) {
    console.error("Error in createService:", error)
    throw new Error(`Failed to create service: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function updateService(id: string, service: Partial<Service>) {
  try {
    const collection = await getCollection("services")
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...service, updatedAt: new Date() } })
    return getServiceById(id)
  } catch (error) {
    console.error("Error in updateService:", error)
    throw new Error(`Failed to update service: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Review operations
export async function getReviewsByService(serviceId: string) {
  try {
    const collection = await getCollection("reviews")
    return collection
      .find({ serviceId: new ObjectId(serviceId) })
      .sort({ createdAt: -1 })
      .toArray() as Promise<Review[]>
  } catch (error) {
    console.error("Error in getReviewsByService:", error)
    return []
  }
}

export async function createReview(review: Omit<Review, "_id">) {
  try {
    const collection = await getCollection("reviews")
    const result = await collection.insertOne(review as any)

    // Update service rating
    const reviews = await getReviewsByService(review.serviceId.toString())
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = totalRating / reviews.length

    const serviceCollection = await getCollection("services")
    await serviceCollection.updateOne(
      { _id: review.serviceId },
      { $set: { rating: avgRating, reviewCount: reviews.length } },
    )

    return { ...review, _id: result.insertedId }
  } catch (error) {
    console.error("Error in createReview:", error)
    throw new Error(`Failed to create review: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Booking operations
export async function createBooking(booking: Omit<Booking, "_id">) {
  try {
    const collection = await getCollection("bookings")
    const result = await collection.insertOne(booking as any)
    return { ...booking, _id: result.insertedId }
  } catch (error) {
    console.error("Error in createBooking:", error)
    throw new Error(`Failed to create booking: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export async function getBookingsByUser(userId: string) {
  try {
    const collection = await getCollection("bookings")
    return collection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray() as Promise<Booking[]>
  } catch (error) {
    console.error("Error in getBookingsByUser:", error)
    return []
  }
}

export async function getBookingsByProvider(providerId: string) {
  try {
    const collection = await getCollection("bookings")
    return collection
      .find({ providerId: new ObjectId(providerId) })
      .sort({ createdAt: -1 })
      .toArray() as Promise<Booking[]>
  } catch (error) {
    console.error("Error in getBookingsByProvider:", error)
    return []
  }
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  try {
    const collection = await getCollection("bookings")
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } })
    return collection.findOne({ _id: new ObjectId(id) }) as Promise<Booking | null>
  } catch (error) {
    console.error("Error in updateBookingStatus:", error)
    throw new Error(`Failed to update booking status: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Category operations
export async function getCategories() {
  try {
    const collection = await getCollection("categories")
    return collection.find().toArray() as Promise<Category[]>
  } catch (error) {
    console.error("Error in getCategories:", error)
    return []
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const collection = await getCollection("categories")
    return collection.findOne({ slug }) as Promise<Category | null>
  } catch (error) {
    console.error("Error in getCategoryBySlug:", error)
    return null
  }
}
