// Mark this file as server-only to prevent client imports
import "server-only"
import mongoose, { Schema, type Document } from "mongoose"
import type { ObjectId } from "mongodb"

export interface IService extends Document {
  title: string
  description: string
  category: string
  price: number
  location: {
    city: string
    state: string
    address?: string
  }
  provider: ObjectId
  images: string[]
  rating: {
    average: number
    count: number
  }
  reviews: Array<{
    user: ObjectId
    rating: number
    comment: string
    createdAt: Date
  }>
  availability: {
    days: string[]
    hours: {
      start: string
      end: string
    }
  }
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema<IService>({
  title: {
    type: String,
    required: [true, "Please provide a service title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a service description"],
  },
  category: {
    type: String,
    required: [true, "Please provide a service category"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a price"],
  },
  location: {
    city: {
      type: String,
      required: [true, "Please provide a city"],
    },
    state: {
      type: String,
      required: [true, "Please provide a state"],
    },
    address: String,
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide a provider ID"],
  },
  images: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  reviews: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      rating: Number,
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  availability: {
    days: [String],
    hours: {
      start: String,
      end: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Pre-save hook to calculate average rating
ServiceSchema.pre("save", function (next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0)
    this.rating.average = totalRating / this.reviews.length
    this.rating.count = this.reviews.length
  }
  next()
})

// Create the Service model
const Service = mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema)

export default Service
