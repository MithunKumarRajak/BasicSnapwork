"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createBookingAction } from "@/app/actions/booking-actions"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin } from "lucide-react"
import { format } from "date-fns"

interface BookingFormProps {
  serviceId: string
}

export default function BookingForm({ serviceId }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const today = new Date()
  const minDate = format(today, "yyyy-MM-dd")
  const maxDate = format(new Date(today.setMonth(today.getMonth() + 3)), "yyyy-MM-dd")

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
      } else {
        setIsSuccess(true)
        toast({
          title: "Booking Successful",
          description: "Your booking has been submitted successfully!",
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

  if (isSuccess) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-green-600 dark:text-green-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold">Booking Confirmed!</h3>
        <p className="text-muted-foreground">Your booking has been submitted successfully.</p>
        <p className="text-sm">You will receive a confirmation shortly.</p>
        <Button variant="outline" className="mt-4" onClick={() => setIsSuccess(false)}>
          Book Again
        </Button>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="space-y-2">
        <label htmlFor="date" className="text-sm font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Select Date
        </label>
        <Input id="date" name="date" type="date" required min={minDate} max={maxDate} />
      </div>

      <div className="space-y-2">
        <label htmlFor="time" className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Select Time
        </label>
        <Input id="time" name="time" type="time" required />
      </div>

      <div className="space-y-2">
        <label htmlFor="address" className="text-sm font-medium flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Service Address
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
        {isLoading ? "Processing..." : "Book Now"}
      </Button>
    </form>
  )
}
