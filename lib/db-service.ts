import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import type { User, Service, Review, Booking, Category } from "./models"

export async function getCollection(collectionName: string) {
  const client = await clientPromise
  const db = client.db("snapwork")
  return db.collection(collectionName)
}

// User operations
export async function getUserByEmail(email: string) {
  const collection = await getCollection("users")
  return collection.findOne({ email }) as Promise<User | null>
}

export async function getUserById(id: string) {
  const collection = await getCollection("users")
  return collection.findOne({ _id: new ObjectId(id) }) as Promise<User | null>
}

export async function createUser(user: Omit<User, "_id">) {
  const collection = await getCollection("users")
  const result = await collection.insertOne(user as any)
  return { ...user, _id: result.insertedId }
}

// Service operations
export async function getServices(limit = 10, category?: string) {
  const collection = await getCollection("services")
  const query = category ? { category, isActive: true } : { isActive: true }
  return collection.find(query).limit(limit).sort({ createdAt: -1 }).toArray() as Promise<Service[]>
}

export async function getServiceById(id: string) {
  const collection = await getCollection("services")
  return collection.findOne({ _id: new ObjectId(id) }) as Promise<Service | null>
}

export async function getServicesByProvider(providerId: string) {
  const collection = await getCollection("services")
  return collection.find({ providerId: new ObjectId(providerId), isActive: true }).toArray() as Promise<Service[]>
}

export async function createService(service: Omit<Service, "_id">) {
  const collection = await getCollection("services")
  const result = await collection.insertOne(service as any)
  return { ...service, _id: result.insertedId }
}

export async function updateService(id: string, service: Partial<Service>) {
  const collection = await getCollection("services")
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...service, updatedAt: new Date() } })
  return getServiceById(id)
}

// Review operations
export async function getReviewsByService(serviceId: string) {
  const collection = await getCollection("reviews")
  return collection
    .find({ serviceId: new ObjectId(serviceId) })
    .sort({ createdAt: -1 })
    .toArray() as Promise<Review[]>
}

export async function createReview(review: Omit<Review, "_id">) {
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
}

// Booking operations
export async function createBooking(booking: Omit<Booking, "_id">) {
  const collection = await getCollection("bookings")
  const result = await collection.insertOne(booking as any)
  return { ...booking, _id: result.insertedId }
}

export async function getBookingsByUser(userId: string) {
  const collection = await getCollection("bookings")
  return collection
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray() as Promise<Booking[]>
}

export async function getBookingsByProvider(providerId: string) {
  const collection = await getCollection("bookings")
  return collection
    .find({ providerId: new ObjectId(providerId) })
    .sort({ createdAt: -1 })
    .toArray() as Promise<Booking[]>
}

export async function updateBookingStatus(id: string, status: Booking["status"]) {
  const collection = await getCollection("bookings")
  await collection.updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } })
  return collection.findOne({ _id: new ObjectId(id) }) as Promise<Booking | null>
}

// Category operations
export async function getCategories() {
  const collection = await getCollection("categories")
  return collection.find().toArray() as Promise<Category[]>
}

export async function getCategoryBySlug(slug: string) {
  const collection = await getCollection("categories")
  return collection.findOne({ slug }) as Promise<Category | null>
}
