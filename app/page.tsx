import Hero from "@/components/Hero"
import FeaturedJobs from "@/components/FeaturedJobs"
import HowItWorks from "@/components/HowItWorks"
import Categories from "@/components/Categories"
import FeaturedServices from "@/components/FeaturedServices"

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedServices />
      <FeaturedJobs />
      <HowItWorks />
    </div>
  )
}
