import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getCategories } from "@/lib/db-service"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createServiceAction } from "@/app/actions/service-actions"

export default async function NewServicePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/sign-in?callbackUrl=/provider/services/new")
  }

  if (session.user.role !== "provider") {
    redirect("/")
  }

  const categories = await getCategories()

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Create New Service</h1>

      <Card>
        <form action={createServiceAction}>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Service Title</Label>
              <Input id="title" name="title" placeholder="e.g. Professional Home Cleaning" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your service in detail"
                rows={5}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹ per hour)</Label>
                <Input id="price" name="price" type="number" min="0" step="10" placeholder="e.g. 500" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id?.toString()} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Service Location</Label>
              <Input id="location" name="location" placeholder="e.g. Mumbai, Maharashtra" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" placeholder="https://example.com/image.jpg" required />
              <p className="text-xs text-muted-foreground">
                Enter a URL for your service image. In a real app, you would upload images.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" asChild>
              <a href="/provider/services">Cancel</a>
            </Button>
            <Button type="submit">Create Service</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
