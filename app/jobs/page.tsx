"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MockDataService, type Job } from "@/lib/mock-data"
import { MapPin, Clock, IndianRupee } from "lucide-react"

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")
  const [city, setCity] = useState("all")
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")

  const fetchJobs = () => {
    setLoading(true)

    // Simulate loading delay
    setTimeout(() => {
      const filters = {
        category: category === "all" ? undefined : category,
        city: city === "all" ? undefined : city,
        minBudget: minBudget ? Number.parseInt(minBudget) : undefined,
        maxBudget: maxBudget ? Number.parseInt(maxBudget) : undefined,
      }

      const filteredJobs = MockDataService.getJobs(filters)
      setJobs(filteredJobs)
      setLoading(false)
    }, 500)
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
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading jobs...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{job.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 line-clamp-3">{job.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <IndianRupee className="h-4 w-4 mr-1" />
                    <span>
                      ₹{job.budget.min} - ₹{job.budget.max}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {job.location.city}, {job.location.state}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Posted by {job.postedByName}</span>
                  </div>
                </div>
                <Button className="w-full mt-4">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center text-muted-foreground py-8">No jobs found matching your criteria.</div>
      )}
    </div>
  )
}
