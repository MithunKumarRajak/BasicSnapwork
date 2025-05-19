import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"

interface ServiceCardProps {
  id: string
  title: string
  description: string
  price: number
  rating: number
  provider: string
  image: string
  category: string
  location?: string
}

export default function ServiceCard({
  id,
  title,
  description,
  price,
  rating,
  provider,
  image,
  category,
  location,
}: ServiceCardProps) {
  // Format price in Indian Rupees
  const formattedPrice = `₹${price.toLocaleString("en-IN")}`

  return (
    <Link href={`/service/${id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md h-full flex flex-col">
        <div className="aspect-video relative">
          <Image
            src={image || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          <Badge className="absolute top-2 right-2 z-10">{category}</Badge>
          {rating > 4.5 && (
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 z-10 bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
            >
              Top Rated
            </Badge>
          )}
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="text-lg font-bold line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1 mb-2">{description}</p>
          {location && (
            <div className="flex items-center text-xs text-muted-foreground mb-2">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{location}</span>
            </div>
          )}
          <div className="flex items-center mt-auto">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{rating > 0 ? rating.toFixed(1) : "New"}</span>
            </div>
            <span className="mx-2 text-muted-foreground">•</span>
            <span className="text-sm text-muted-foreground truncate">by {provider}</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-auto">
          <span className="font-bold text-lg">{formattedPrice}/hr</span>
          <Badge variant="outline" className="hover:bg-primary hover:text-primary-foreground transition-colors">
            View Details
          </Badge>
        </CardFooter>
      </Card>
    </Link>
  )
}
