"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin } from "lucide-react"

const popularCities = [
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
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]

export default function LocationSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [city, setCity] = useState(searchParams.get("city") || "")
  const [state, setState] = useState(searchParams.get("state") || "")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [locationSelected, setLocationSelected] = useState(Boolean(city || state))

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocationSelected(true)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (city) params.append("city", city)
    if (state) params.append("state", state)
    if (searchQuery) params.append("q", searchQuery)

    router.push(`/jobs?${params.toString()}`)
  }

  const handleReset = () => {
    setCity("")
    setState("")
    setSearchQuery("")
    setLocationSelected(false)
    router.push("/jobs")
  }

  return (
    <div className="space-y-4">
      {!locationSelected ? (
        <div className="space-y-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold">Where are you looking for work?</h2>
            <p className="text-muted-foreground">Select your location to find relevant jobs</p>
          </div>

          <form onSubmit={handleLocationSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {popularCities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger id="state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={!city && !state}>
              Continue
            </Button>
          </form>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Popular cities:</p>
            <div className="flex flex-wrap gap-2">
              {popularCities.slice(0, 5).map((c) => (
                <Button
                  key={c}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCity(c)
                    setLocationSelected(true)
                  }}
                >
                  <MapPin className="mr-1 h-3 w-3" />
                  {c}
                </Button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-primary" />
              <span className="font-medium">
                {city}
                {city && state && ", "}
                {state}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setLocationSelected(false)}>
              Change
            </Button>
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>

          <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}
