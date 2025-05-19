"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Navigation, X, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

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

// Map of major cities to their approximate coordinates
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
}

export default function LocationSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobile, setIsMobile] = useState(false)

  const [city, setCity] = useState(searchParams.get("city") || "")
  const [state, setState] = useState(searchParams.get("state") || "")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [locationSelected, setLocationSelected] = useState(Boolean(city || state))
  const [nearbyCities, setNearbyCities] = useState<string[]>([])
  const [isLocating, setIsLocating] = useState(false)
  const [showFullSearch, setShowFullSearch] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocationSelected(true)
    setShowFullSearch(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const params = new URLSearchParams()
    if (city) params.append("city", city)
    if (state) params.append("state", state)
    if (searchQuery) params.append("q", searchQuery)

    router.push(`/jobs?${params.toString()}`)
    setShowFullSearch(false)
  }

  const handleReset = () => {
    setCity("")
    setState("")
    setSearchQuery("")
    setLocationSelected(false)
    router.push("/jobs")
  }

  const detectUserLocation = () => {
    setIsLocating(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          // Find nearby cities based on coordinates
          const nearby = findNearbyCities(userCoords)
          setNearbyCities(nearby)

          if (nearby.length > 0) {
            setCity(nearby[0]) // Set the closest city
          }

          setIsLocating(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocating(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser")
      setIsLocating(false)
    }
  }

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Radius of the earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in km
  }

  // Find nearby cities based on user coordinates
  const findNearbyCities = (coords: { lat: number; lng: number }) => {
    const cities = Object.entries(cityCoordinates)
      .map(([city, cityCoords]) => ({
        city,
        distance: calculateDistance(coords.lat, coords.lng, cityCoords.lat, cityCoords.lng),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3) // Get 3 closest cities
      .map((item) => item.city)

    return cities
  }

  // Mobile collapsed view
  if (isMobile && !showFullSearch && !locationSelected) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-between py-6"
            onClick={() => setShowFullSearch(true)}
          >
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-primary" />
              <span>Select your location</span>
            </div>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Mobile collapsed view with location selected
  if (isMobile && !showFullSearch && locationSelected) {
    return (
      <Card className="shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              <span className="font-medium truncate max-w-[150px]">
                {city}
                {city && state && ", "}
                {state}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => setShowFullSearch(true)}>
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-8 w-8" onClick={() => setLocationSelected(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Change location</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("shadow-md", isMobile && "fixed inset-0 z-50 rounded-none")}>
      <CardContent className={cn("p-4", isMobile && "h-full overflow-auto pb-20")}>
        {isMobile && (
          <div className="sticky top-0 z-10 flex items-center justify-between bg-background pb-2 mb-4">
            <h2 className="text-lg font-semibold">{locationSelected ? "Search Jobs" : "Select Location"}</h2>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8"
              onClick={() => {
                setShowFullSearch(false)
                if (!locationSelected) {
                  router.push("/jobs")
                }
              }}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        )}

        <div className="space-y-4">
          {!locationSelected ? (
            <div className="space-y-4">
              {!isMobile && (
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold">Where are you looking for work?</h2>
                  <p className="text-muted-foreground">Select your location to find relevant jobs</p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mb-4 py-6"
                onClick={detectUserLocation}
                disabled={isLocating}
              >
                {isLocating ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                    <span>Detecting location...</span>
                  </div>
                ) : (
                  <>
                    <Navigation className="h-5 w-5" />
                    <span>Use my current location</span>
                  </>
                )}
              </Button>

              {nearbyCities.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Nearby cities:</p>
                  <div className="flex flex-wrap gap-2">
                    {nearbyCities.map((c) => (
                      <Badge
                        key={c}
                        className="cursor-pointer py-2 px-3 text-base"
                        onClick={() => {
                          setCity(c)
                          setLocationSelected(true)
                        }}
                      >
                        <MapPin className="mr-1 h-4 w-4" />
                        {c}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              <form onSubmit={handleLocationSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="city" className="text-base">
                    City
                  </Label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="city" className={isMobile ? "h-12" : ""}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {popularCities.map((c) => (
                        <SelectItem key={c} value={c} className={isMobile ? "text-base py-3" : ""}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="state" className="text-base">
                    State
                  </Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger id="state" className={isMobile ? "h-12" : ""}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((s) => (
                        <SelectItem key={s} value={s} className={isMobile ? "text-base py-3" : ""}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6"
                  disabled={!city && !state}
                  size={isMobile ? "lg" : "default"}
                >
                  Continue
                </Button>
              </form>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Popular cities:</p>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
                  {popularCities.slice(0, 6).map((c) => (
                    <Button
                      key={c}
                      variant="outline"
                      size={isMobile ? "lg" : "sm"}
                      className={isMobile ? "justify-start py-6" : ""}
                      onClick={() => {
                        setCity(c)
                        setLocationSelected(true)
                      }}
                    >
                      <MapPin className="mr-1 h-4 w-4" />
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
                  <MapPin className="mr-2 h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {city}
                    {city && state && ", "}
                    {state}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocationSelected(false)}
                  className={isMobile ? "h-10 px-3" : ""}
                >
                  <X className="h-4 w-4 mr-1" />
                  Change
                </Button>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search for jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn("pl-9", isMobile && "h-12 text-base")}
                    />
                  </div>
                  <Button type="submit" size={isMobile ? "lg" : "default"}>
                    Search
                  </Button>
                </div>
              </form>

              <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
                Reset Filters
              </Button>
            </div>
          )}
        </div>

        {/* Fixed bottom button for mobile */}
        {isMobile && locationSelected && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
            <Button onClick={handleSearchSubmit} className="w-full py-6" size="lg">
              Search Jobs
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
