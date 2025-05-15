"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

const categories = [
  { name: "All Categories", value: "" },
  { name: "Household Help", value: "household-help" },
  { name: "Electrician", value: "electrician" },
  { name: "Plumbing", value: "plumbing" },
  { name: "Delivery", value: "delivery" },
  { name: "Cooking", value: "cooking" },
  { name: "Painting", value: "painting" },
  { name: "Construction", value: "construction" },
  { name: "Salon Services", value: "salon-services" },
  { name: "Web Development", value: "web-development" },
  { name: "Design", value: "design" },
  { name: "Writing", value: "writing" },
  { name: "Admin Support", value: "admin-support" },
]

export default function JobFilters() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [budget, setBudget] = useState([5000])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (search) {
      params.append("search", search)
    }

    if (category) {
      params.append("category", category)
    }

    if (budget[0] !== 5000) {
      params.append("budget", budget[0].toString())
    }

    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleReset = () => {
    setSearch("")
    setCategory("")
    setBudget([5000])
    router.push("/jobs")
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" placeholder="Keywords..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Budget (up to ₹{budget[0]})</Label>
            <Slider value={budget} min={500} max={50000} step={500} onValueChange={setBudget} />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹500</span>
              <span>₹50,000+</span>
            </div>
          </div>

          <Button type="submit" className="w-full">
            Apply Filters
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={handleReset}>
            Reset Filters
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
