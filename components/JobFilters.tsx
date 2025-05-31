"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Filter, Search, MapPin, IndianRupee } from "lucide-react"

const categories = [
  { name: "All Categories", value: "" },
  { name: "Household Help", value: "household-help" },
  { name: "Electrician", value: "electrician" },
  { name: "Plumber", value: "plumber" },
  { name: "Carpenter", value: "carpenter" },
  { name: "Painter", value: "painter" },
  { name: "Cleaner", value: "cleaner" },
  { name: "Cook", value: "cook" },
  { name: "Driver", value: "driver" },
  { name: "Gardener", value: "gardener" },
  { name: "Security Guard", value: "security-guard" },
  { name: "Delivery", value: "delivery" },
  { name: "Construction", value: "construction" },
  { name: "Salon Services", value: "salon-services" },
  { name: "Web Development", value: "web-development" },
  { name: "Design", value: "design" },
  { name: "Writing", value: "writing" },
  { name: "Admin Support", value: "admin-support" },
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
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
  "Ghaziabad",
  "Ludhiana",
]

const jobTypes = [
  { name: "Full-time", value: "full-time" },
  { name: "Part-time", value: "part-time" },
  { name: "Contract", value: "contract" },
  { name: "Freelance", value: "freelance" },
  { name: "One-time", value: "one-time" },
]

const experienceLevels = [
  { name: "Entry Level", value: "entry" },
  { name: "Mid Level", value: "mid" },
  { name: "Senior Level", value: "senior" },
  { name: "Expert", value: "expert" },
]

export default function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Filter states
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "")
  const [city, setCity] = useState(searchParams.get("city") || "")
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "")
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get("experience") || "")
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 500,
    Number(searchParams.get("maxPrice")) || 50000,
  ])
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get("skills")?.split(",").filter(Boolean) || [],
  )
  const [isRemote, setIsRemote] = useState(searchParams.get("remote") === "true")
  const [isUrgent, setIsUrgent] = useState(searchParams.get("urgent") === "true")
  const [isVerifiedOnly, setIsVerifiedOnly] = useState(searchParams.get("verified") === "true")

  const commonSkills = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "HTML/CSS",
    "MongoDB",
    "SQL",
    "Electrical Work",
    "Plumbing",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Cooking",
    "Driving",
    "Gardening",
    "Security",
    "Delivery",
  ]

  const activeFiltersCount = [
    search,
    category,
    city,
    jobType,
    experienceLevel,
    selectedSkills.length > 0,
    isRemote,
    isUrgent,
    isVerifiedOnly,
    priceRange[0] !== 500 || priceRange[1] !== 50000,
  ].filter(Boolean).length

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleApplyFilters = () => {
    const params = new URLSearchParams()

    if (search) params.append("search", search)
    if (category) params.append("category", category)
    if (city) params.append("city", city)
    if (jobType) params.append("jobType", jobType)
    if (experienceLevel) params.append("experience", experienceLevel)
    if (priceRange[0] !== 500) params.append("minPrice", priceRange[0].toString())
    if (priceRange[1] !== 50000) params.append("maxPrice", priceRange[1].toString())
    if (selectedSkills.length > 0) params.append("skills", selectedSkills.join(","))
    if (isRemote) params.append("remote", "true")
    if (isUrgent) params.append("urgent", "true")
    if (isVerifiedOnly) params.append("verified", "true")

    router.push(`/jobs${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleReset = () => {
    setSearch("")
    setCategory("")
    setCity("")
    setJobType("")
    setExperienceLevel("")
    setPriceRange([500, 50000])
    setSelectedSkills([])
    setIsRemote(false)
    setIsUrgent(false)
    setIsVerifiedOnly(false)
    router.push("/jobs")
  }

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {activeFiltersCount}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Jobs
          </Label>
          <Input
            id="search"
            placeholder="Keywords, job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
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

        {/* Location */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            City
          </Label>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cities.map((cityName) => (
                <SelectItem key={cityName} value={cityName}>
                  {cityName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Budget Range
          </Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              min={500}
              max={50000}
              step={500}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{priceRange[0].toLocaleString()}</span>
            <span>₹{priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        {/* Job Type */}
        <div className="space-y-2">
          <Label>Job Type</Label>
          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger>
              <SelectValue placeholder="Select job type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {jobTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Experience Level */}
        <div className="space-y-2">
          <Label>Experience Level</Label>
          <Select value={experienceLevel} onValueChange={setExperienceLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skills */}
        <div className="space-y-3">
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2">
            {commonSkills.map((skill) => (
              <Badge
                key={skill}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => handleSkillToggle(skill)}
              >
                {skill}
                {selectedSkills.includes(skill) && <X className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div className="space-y-3">
          <Label>Additional Filters</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="remote" checked={isRemote} onCheckedChange={setIsRemote} />
              <Label htmlFor="remote" className="text-sm">
                Remote Work
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="urgent" checked={isUrgent} onCheckedChange={setIsUrgent} />
              <Label htmlFor="urgent" className="text-sm">
                Urgent Jobs
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="verified" checked={isVerifiedOnly} onCheckedChange={setIsVerifiedOnly} />
              <Label htmlFor="verified" className="text-sm">
                Verified Employers Only
              </Label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t">
          <Button onClick={handleApplyFilters} className="w-full">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" className="w-full">
            Reset All
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
