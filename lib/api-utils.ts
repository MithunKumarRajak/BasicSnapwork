// Client-safe API utilities

export async function fetchJobs(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const response = await fetch(`/api/jobs?${queryString}`)

  if (!response.ok) {
    throw new Error("Failed to fetch jobs")
  }

  return response.json()
}

export async function fetchJob(id: string) {
  const response = await fetch(`/api/jobs/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch job")
  }

  return response.json()
}

export async function createJob(jobData: any) {
  const response = await fetch("/api/jobs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })

  if (!response.ok) {
    throw new Error("Failed to create job")
  }

  return response.json()
}

export async function updateJob(id: string, jobData: any) {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  })

  if (!response.ok) {
    throw new Error("Failed to update job")
  }

  return response.json()
}

export async function deleteJob(id: string) {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete job")
  }

  return response.json()
}

export async function fetchServices(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const response = await fetch(`/api/services?${queryString}`)

  if (!response.ok) {
    throw new Error("Failed to fetch services")
  }

  return response.json()
}

export async function fetchService(id: string) {
  const response = await fetch(`/api/services/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch service")
  }

  return response.json()
}

export async function createService(serviceData: any) {
  const response = await fetch("/api/services", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  })

  if (!response.ok) {
    throw new Error("Failed to create service")
  }

  return response.json()
}

export async function updateService(id: string, serviceData: any) {
  const response = await fetch(`/api/services/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  })

  if (!response.ok) {
    throw new Error("Failed to update service")
  }

  return response.json()
}

export async function deleteService(id: string) {
  const response = await fetch(`/api/services/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete service")
  }

  return response.json()
}

export async function fetchApplications(params = {}) {
  const queryString = new URLSearchParams(params).toString()
  const response = await fetch(`/api/applications?${queryString}`)

  if (!response.ok) {
    throw new Error("Failed to fetch applications")
  }

  return response.json()
}

export async function fetchApplication(id: string) {
  const response = await fetch(`/api/applications/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch application")
  }

  return response.json()
}

export async function createApplication(applicationData: any) {
  const response = await fetch("/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  })

  if (!response.ok) {
    throw new Error("Failed to create application")
  }

  return response.json()
}

export async function updateApplication(id: string, applicationData: any) {
  const response = await fetch(`/api/applications/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  })

  if (!response.ok) {
    throw new Error("Failed to update application")
  }

  return response.json()
}

export async function deleteApplication(id: string) {
  const response = await fetch(`/api/applications/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("Failed to delete application")
  }

  return response.json()
}

export async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}

export async function updateUser(id: string, userData: any) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })

  if (!response.ok) {
    throw new Error("Failed to update user")
  }

  return response.json()
}
