import mongoose from "mongoose"

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    images: [{ type: String }],
    availability: {
      days: [{ type: String }],
      timeSlots: [{ type: String }],
    },
  },
  { timestamps: true },
)

// Calculate average rating when reviews are modified
ServiceSchema.pre("save", function (next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating = totalRating / this.reviews.length
  }
  next()
})

// Create the Service model
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema)

// Export as default
export default Service
// Also export as named export
export { Service }
