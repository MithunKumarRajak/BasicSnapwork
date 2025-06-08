export interface User {
  id: string
  name: string
  email: string
  role: "user" | "worker" | "employer"
  createdAt: string
}

export interface Job {
  id: string
  title: string
  description: string
  category: string
  budget: {
    min: number
    max: number
  }
  location: {
    city: string
    state: string
  }
  postedBy: string
  postedByName: string
  status: "open" | "closed"
  createdAt: string
}

// Mock users data
export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "employer",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "worker",
    createdAt: "2024-01-02T00:00:00Z",
  },
]

// Mock jobs data
export const mockJobs: Job[] = [
  {
    id: "1",
    title: "House Cleaning Service",
    description: "Need someone to clean a 3BHK apartment. Should be completed within 4 hours.",
    category: "House Cleaning",
    budget: { min: 1500, max: 2500 },
    location: { city: "Mumbai", state: "Maharashtra" },
    postedBy: "1",
    postedByName: "John Doe",
    status: "open",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    title: "Plumbing Repair",
    description: "Kitchen sink is leaking and needs immediate repair. Urgent requirement.",
    category: "Plumbing",
    budget: { min: 800, max: 1200 },
    location: { city: "Delhi", state: "Delhi" },
    postedBy: "1",
    postedByName: "John Doe",
    status: "open",
    createdAt: "2024-01-01T11:00:00Z",
  },
  {
    id: "3",
    title: "Home Tutoring for Math",
    description: "Need a math tutor for 10th grade student. 3 days a week, 2 hours each day.",
    category: "Tutoring",
    budget: { min: 3000, max: 5000 },
    location: { city: "Bangalore", state: "Karnataka" },
    postedBy: "1",
    postedByName: "John Doe",
    status: "open",
    createdAt: "2024-01-01T12:00:00Z",
  },
  {
    id: "4",
    title: "Electrical Wiring Work",
    description: "Need to install new electrical points in 2 rooms. Should be completed safely.",
    category: "Electrical Work",
    budget: { min: 2000, max: 3500 },
    location: { city: "Pune", state: "Maharashtra" },
    postedBy: "1",
    postedByName: "John Doe",
    status: "open",
    createdAt: "2024-01-01T13:00:00Z",
  },
  {
    id: "5",
    title: "Garden Maintenance",
    description: "Weekly garden maintenance including watering, pruning, and cleaning.",
    category: "Gardening",
    budget: { min: 1000, max: 1500 },
    location: { city: "Chennai", state: "Tamil Nadu" },
    postedBy: "1",
    postedByName: "John Doe",
    status: "open",
    createdAt: "2024-01-01T14:00:00Z",
  },
]

// Mock data service
export class MockDataService {
  static getJobs(filters?: {
    category?: string
    city?: string
    minBudget?: number
    maxBudget?: number
  }): Job[] {
    let filteredJobs = [...mockJobs]

    if (filters?.category && filters.category !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.category === filters.category)
    }

    if (filters?.city && filters.city !== "all") {
      filteredJobs = filteredJobs.filter((job) => job.location.city === filters.city)
    }

    if (filters?.minBudget) {
      filteredJobs = filteredJobs.filter((job) => job.budget.max >= filters.minBudget!)
    }

    if (filters?.maxBudget) {
      filteredJobs = filteredJobs.filter((job) => job.budget.min <= filters.maxBudget!)
    }

    return filteredJobs
  }

  static getJobById(id: string): Job | undefined {
    return mockJobs.find((job) => job.id === id)
  }

  static createJob(jobData: Omit<Job, "id" | "createdAt">): Job {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    mockJobs.push(newJob)
    return newJob
  }

  static authenticateUser(email: string, password: string): User | null {
    // Simple mock authentication
    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "password123") {
      return user
    }
    return null
  }

  static registerUser(userData: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    mockUsers.push(newUser)
    return newUser
  }
}
