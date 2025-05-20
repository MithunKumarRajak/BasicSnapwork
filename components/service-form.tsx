"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import LocationSearch from "@/components/LocationSearch"

const categories = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Painting",
  "Gardening",
  "Cooking",
  "Driving",
  "Tutoring",
  "Babysitting",
  "Elder Care",
  "Pet Care",
  "Computer Repair",
  "Mobile Repair",
  "Home Repair",
  "Beauty Services",
  "Event Planning",
  "Photography",
  "Videography",
  "Graphic Design",
  "Web Development",
  "Content Writing",
  "Translation",
  "Accounting",
  "Legal Services",
  "Marketing",
  "Other",
]

const days = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
]

const timeSlots = [
  { id: "morning", label: "Morning (8AM-12PM)" },
  { id: "afternoon", label: "Afternoon (12PM-4PM)" },
  { id: "evening", label: "Evening (4PM-8PM)" },
  { id: "night", label: "Night (8PM-12AM)" },
]

export default function ServiceForm({
  action,
  initialData = null,
}: {
  action: (formData: FormData) => Promise<any>
  initialData?: any
}) {
  const { toast } = useToast()
  const [location, setLocation] = useState(initialData?.location || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    try {
      setIsSubmitting(true)
      formData.set("location", location)

      const result = await action(formData)

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Service Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Professional Plumbing Services"
              required
              defaultValue={initialData?.title || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your service in detail"
              required
              rows={5}
              defaultValue={initialData?.description || ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              className="w-full p-2 border rounded-md"
              required
              defaultValue={initialData?.category || ""}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="10"
              placeholder="e.g. 500"
              required
              defaultValue={initialData?.price || ""}
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <LocationSearch value={location} onChange={setLocation} placeholder="Enter your service location" />
          </div>

          <div className="space-y-2">
            <Label>Available Days</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {days.map((day) => (
                <div key={day.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={day.id}
                    name="days"
                    value={day.id}
                    defaultChecked={initialData?.availability?.days?.includes(day.id)}
                  />
                  <Label htmlFor={day.id}>{day.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Available Time Slots</Label>
            <div className="grid grid-cols-2 gap-2">
              {timeSlots.map((slot) => (
                <div key={slot.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={slot.id}
                    name="timeSlots"
                    value={slot.id}
                    defaultChecked={initialData?.availability?.timeSlots?.includes(slot.id)}
                  />
                  <Label htmlFor={slot.id}>{slot.label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              placeholder="e.g. https://example.com/image.jpg"
              defaultValue={initialData?.images?.[0] || ""}
            />
            <p className="text-sm text-gray-500">Enter a URL for your service image</p>
          </div>

          {initialData && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="isActive" name="isActive" value="true" defaultChecked={initialData?.isActive} />
                <Label htmlFor="isActive">Service is active and visible to clients</Label>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData ? "Update Service" : "Create Service"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
