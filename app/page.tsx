import Hero from "@/components/Hero"
import FeaturedJobs from "@/components/FeaturedJobs"
import HowItWorks from "@/components/HowItWorks"
import Categories from "@/components/Categories"

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <FeaturedJobs />
      <HowItWorks />
    </div>
  )
}
