import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import ServiceCard from "@/components/service-card"
import { Search } from "lucide-react"

export default function ServicesPage() {
  return (
    <main className="container py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Find Services</h1>
        <p className="text-muted-foreground">Browse through our wide range of services</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="md:col-span-1 space-y-6">
          <div className="border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold text-lg">Filters</h2>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Category</h3>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="household">Household</SelectItem>
                  <SelectItem value="tech">Tech Help</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="gardening">Gardening</SelectItem>
                  <SelectItem value="tutoring">Tutoring</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Price Range</h3>
              <Slider defaultValue={[50]} max={100} step={1} />
              <div className="flex items-center justify-between">
                <span className="text-sm">$0</span>
                <span className="text-sm">$100+</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Rating</h3>
              <Select defaultValue="any">
                <SelectTrigger>
                  <SelectValue placeholder="Any Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="4plus">4+ Stars</SelectItem>
                  <SelectItem value="3plus">3+ Stars</SelectItem>
                  <SelectItem value="2plus">2+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full">Apply Filters</Button>
          </div>
        </div>

        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center space-x-2">
            <Input placeholder="Search services..." className="flex-1" />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard
              title="Home Cleaning"
              description="Professional home cleaning services at affordable rates"
              price="$25/hr"
              rating={4.8}
              provider="Maria S."
              image="/placeholder.svg?height=200&width=300"
              category="Household"
            />
            <ServiceCard
              title="Computer Repair"
              description="Fix any computer issues with same-day service"
              price="$40/hr"
              rating={4.9}
              provider="Alex T."
              image="/placeholder.svg?height=200&width=300"
              category="Tech Help"
            />
            <ServiceCard
              title="Furniture Assembly"
              description="Quick and reliable furniture assembly service"
              price="$30/hr"
              rating={4.7}
              provider="John D."
              image="/placeholder.svg?height=200&width=300"
              category="Labor"
            />
            <ServiceCard
              title="Lawn Mowing"
              description="Keep your lawn looking great with regular maintenance"
              price="$35/hr"
              rating={4.5}
              provider="Robert K."
              image="/placeholder.svg?height=200&width=300"
              category="Gardening"
            />
            <ServiceCard
              title="Math Tutoring"
              description="Expert math tutoring for all grade levels"
              price="$45/hr"
              rating={4.9}
              provider="Sarah L."
              image="/placeholder.svg?height=200&width=300"
              category="Tutoring"
            />
            <ServiceCard
              title="Food Delivery"
              description="Fast and reliable food delivery service"
              price="$15/delivery"
              rating={4.6}
              provider="Michael P."
              image="/placeholder.svg?height=200&width=300"
              category="Delivery"
            />
          </div>
        </div>
      </div>
    </main>
  )
}
