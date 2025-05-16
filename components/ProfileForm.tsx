"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { Upload, MapPin, Phone, Briefcase } from "lucide-react"

interface ProfileFormProps {
  userId: string
}

export default function ProfileForm({ userId }: ProfileFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    profileImage: "",
  })

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }
        const data = await response.json()

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          location: data.location || "",
          bio: data.bio || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
          profileImage: data.profileImage || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [userId, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const updatedProfile = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProfile),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="h-24 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Avatar className="h-24 w-24 border-4 border-primary/20">
          <AvatarImage src={formData.profileImage || "/placeholder.svg"} alt={formData.name} />
          <AvatarFallback className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            {formData.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <Label htmlFor="profileImage" className="block mb-2">
            Profile Picture
          </Label>
          <div className="flex items-center space-x-2">
            <Input
              id="profileImage"
              name="profileImage"
              placeholder="Image URL or upload"
              value={formData.profileImage}
              onChange={handleChange}
              className="flex-1"
            />
            <Button type="button" size="icon" variant="outline" className="shrink-0">
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload</span>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Enter an image URL or upload a profile picture (max 2MB)</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled
          />
          <p className="text-xs text-muted-foreground">Email cannot be changed</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center">
            <Phone className="h-4 w-4 mr-1" />
            Phone Number
          </Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Location
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills" className="flex items-center">
          <Briefcase className="h-4 w-4 mr-1" />
          Skills
        </Label>
        <Input
          id="skills"
          name="skills"
          value={formData.skills}
          onChange={handleChange}
          placeholder="Plumbing, Electrical, Carpentry, etc. (comma separated)"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
        >
          {isLoading ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </motion.form>
  )
}
