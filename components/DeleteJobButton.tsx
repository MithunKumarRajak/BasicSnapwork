"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DeleteJobButtonProps {
  jobId: string
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this job?")) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete job")
      }

      toast({
        title: "Success",
        description: "Job deleted successfully",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting job:", error)
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
      <Trash2 className="h-4 w-4 mr-1" />
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  )
}
