"use client"

import type { User } from "@/types/models"

// Jobs API
export async function fetchJobs(params?: Record<string, string>) {
  const queryString = params ? new URLSearchParams(params).toString() : ""
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

// Services API
export async function fetchServices(params?: Record<string, string>) {
  const queryString = params ? new URLSearchParams(params).toString() : ""
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

// Applications API
export async function fetchApplications(params?: Record<string, string>) {
  const queryString = params ? new URLSearchParams(params).toString() : ""
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

// Users API
export async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch user")
  }

  return response.json()
}

export async function updateUser(id: string, data: Partial<User>) {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to update user")
  }

  return response.json()
}
