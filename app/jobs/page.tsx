"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Job {
  _id: string
  title: string
  description: string
  category: string
  budget: {
    min: number
    max: number
  }
  location: {
    city: string
    state: string
  }
  postedBy: {
    name: string
  }
  createdAt: string
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("")
  const [city, setCity] = useState("")
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.append("category", category)
      if (city) params.append("city", city)
      if (minBudget) params.append("minBudget", minBudget)
      if (maxBudget) params.append("maxBudget", maxBudget)

      const res = await fetch(`/api/jobs?${params.toString()}`)
      const data = await res.json()
      setJobs(data.jobs || [])
    } catch (error) {
      console.error("Error fetching jobs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [category, city, minBudget, maxBudget])

  const categories = [
    "House Cleaning",
    "Plumbing",
    "Electrical Work",
    "Painting",
    "Gardening",
    "Cooking",
    "Tutoring",
    "Delivery",
    "Repair Work",
    "Other",
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Find Jobs</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={city} onValueChange={setCity}>
          <SelectTrigger>
            <SelectValue placeholder="City" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Min Budget (₹)"
          value={minBudget}
          onChange={(e) => setMinBudget(e.target.value)}
        />

        <Input
          type="number"
          placeholder="Max Budget (₹)"
          value={maxBudget}
          onChange={(e) => setMaxBudget(e.target.value)}
        />
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="text-center">Loading jobs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job._id}>
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <p className="text-sm text-gray-600">{job.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{job.description.substring(0, 100)}...</p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Budget:</strong> ₹{job.budget.min} - ₹{job.budget.max}
                  </p>
                  <p className="text-sm">
                    <strong>Location:</strong> {job.location.city}, {job.location.state}
                  </p>
                  <p className="text-sm">
                    <strong>Posted by:</strong> {job.postedBy.name}
                  </p>
                </div>
                <Button className="w-full mt-4">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center text-gray-500">No jobs found matching your criteria.</div>
      )}
    </div>
  )
}
