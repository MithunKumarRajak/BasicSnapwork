// This file contains client-safe utility functions for API calls

/**
 * Fetches data from an API endpoint with error handling
 */
export async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API request failed with status ${response.status}`)
    }

    return (await response.json()) as T
  } catch (error) {
    console.error("API fetch error:", error)
    throw error
  }
}

/**
 * Posts data to an API endpoint
 */
export async function postAPI<T, R>(url: string, data: T): Promise<R> {
  return fetchAPI<R>(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

/**
 * Updates data at an API endpoint
 */
export async function updateAPI<T, R>(url: string, data: T): Promise<R> {
  return fetchAPI<R>(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

/**
 * Deletes a resource at an API endpoint
 */
export async function deleteAPI<R>(url: string): Promise<R> {
  return fetchAPI<R>(url, {
    method: "DELETE",
  })
}
