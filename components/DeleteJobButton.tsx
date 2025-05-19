"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { deleteJob } from "@/app/actions/job-actions"
import { useToast } from "@/hooks/use-toast"

interface DeleteJobButtonProps {
  jobId: string
}

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this job? This action cannot be undone.")) {
      setIsDeleting(true)

      try {
        const result = await deleteJob(jobId)

        if (result.success) {
          toast({
            title: "Job deleted",
            description: "The job has been successfully deleted.",
          })
          router.push("/dashboard/jobs")
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete job. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-1"
    >
      <Trash2 className="h-4 w-4" />
      {isDeleting ? "Deleting..." : "Delete Job"}
    </Button>
  )
}
