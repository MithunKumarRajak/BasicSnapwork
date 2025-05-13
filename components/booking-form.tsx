"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createBookingAction } from "@/app/actions/booking-actions"
import { useToast } from "@/hooks/use-toast"

interface BookingFormProps {
  serviceId: string
}

export default function BookingForm({ serviceId }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)

    try {
      const result = await createBookingAction(formData)

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
      setIsLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="date" className="text-sm font-medium">
            Date
          </label>
          <Input id="date" name="date" type="date" required min={new Date().toISOString().split("T")[0]} />
        </div>
        <div className="space-y-2">
          <label htmlFor="time" className="text-sm font-medium">
            Time
          </label>
          <Input id="time" name="time" type="time" required />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium">
          Address
        </label>
        <Input id="address" name="address" placeholder="Enter your address" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="city" className="text-sm font-medium">
            City
          </label>
          <Input id="city" name="city" placeholder="City" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="state" className="text-sm font-medium">
            State
          </label>
          <Input id="state" name="state" placeholder="State" required />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="pincode" className="text-sm font-medium">
          PIN Code
        </label>
        <Input id="pincode" name="pincode" placeholder="PIN Code" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Additional Notes
        </label>
        <Textarea id="notes" name="notes" placeholder="Any specific requirements or instructions" rows={3} />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Booking..." : "Book Now"}
      </Button>
    </form>
  )
}
