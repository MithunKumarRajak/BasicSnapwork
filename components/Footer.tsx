import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">SnapWork</h3>
            <p className="mt-2 text-sm text-muted-foreground">Find and post quick jobs and gigs in your area.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">For Clients</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/post-job" className="text-sm text-muted-foreground hover:text-primary">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">For Freelancers</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/jobs" className="text-sm text-muted-foreground hover:text-primary">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link href="/create-profile" className="text-sm text-muted-foreground hover:text-primary">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-sm text-muted-foreground hover:text-primary">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-2 space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SnapWork. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
