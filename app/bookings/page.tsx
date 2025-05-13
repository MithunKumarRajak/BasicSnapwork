import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getBookingsByUser, getServiceById } from "@/lib/db-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { updateBookingStatusAction } from "@/app/actions/booking-actions"
import { Calendar, Clock, MapPin } from "lucide-react"

export default async function BookingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/sign-in?callbackUrl=/bookings")
  }

  const bookings = await getBookingsByUser(session.user.id)

  // Get service details for each booking
  const bookingsWithServices = await Promise.all(
    bookings.map(async (booking) => {
      const service = await getServiceById(booking.serviceId.toString())
      return { ...booking, service }
    }),
  )

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookingsWithServices.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No bookings found</h2>
          <p className="text-muted-foreground mb-6">You haven't booked any services yet.</p>
          <Button asChild>
            <a href="/services">Browse Services</a>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookingsWithServices.map((booking) => (
            <Card key={booking._id?.toString()}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{booking.service?.title}</CardTitle>
                    <p className="text-muted-foreground">
                      Booked on {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className={
                      booking.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{new Date(booking.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{booking.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>
                      {booking.city}, {booking.state}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-medium">Price: ₹{booking.price.toLocaleString("en-IN")}</p>
                  {booking.notes && (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm text-muted-foreground">{booking.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                {booking.status === "pending" && (
                  <form
                    action={async () => {
                      "use server"
                      await updateBookingStatusAction(booking._id!.toString(), "cancelled")
                    }}
                  >
                    <Button variant="outline" type="submit">
                      Cancel Booking
                    </Button>
                  </form>
                )}
                {booking.status === "completed" && (
                  <Button asChild variant="outline">
                    <a href={`/service/${booking.serviceId}`}>Book Again</a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
