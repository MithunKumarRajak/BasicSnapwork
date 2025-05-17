"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown } from "lucide-react"

interface ApplicationStatusButtonProps {
  applicationId: string
  currentStatus: string
  jobStatus: string
}

export default function ApplicationStatusButton({
  applicationId,
  currentStatus,
  jobStatus,
}: ApplicationStatusButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status)
    setIsDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!selectedStatus) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: selectedStatus,
          notes: notes.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update application status")
      }

      toast({
        title: "Status Updated",
        description: `Application status has been updated to ${selectedStatus}.`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update application status",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
      setIsDialogOpen(false)
      setNotes("")
    }
  }

  // Disable status changes if job is not open, except for already accepted applications
  const isDisabled = jobStatus !== "open" && currentStatus !== "accepted"

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={isDisabled}>
            Update Status <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleStatusSelect("pending")} disabled={currentStatus === "pending"}>
            Mark as Pending
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleStatusSelect("shortlisted")}
            disabled={currentStatus === "shortlisted"}
          >
            Shortlist Candidate
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusSelect("accepted")} disabled={currentStatus === "accepted"}>
            Accept Application
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleStatusSelect("rejected")} disabled={currentStatus === "rejected"}>
            Reject Application
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStatus === "accepted"
                ? "Accept Application"
                : selectedStatus === "rejected"
                  ? "Reject Application"
                  : selectedStatus === "shortlisted"
                    ? "Shortlist Candidate"
                    : "Update Status"}
            </DialogTitle>
            <DialogDescription>
              {selectedStatus === "accepted"
                ? "This will mark the job as in-progress and notify the applicant. All other applications will be automatically rejected."
                : selectedStatus === "rejected"
                  ? "The applicant will be notified that their application was not selected."
                  : selectedStatus === "shortlisted"
                    ? "The applicant will be notified that they have been shortlisted for this position."
                    : "Update the status of this application."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or feedback for the applicant..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">These notes will be visible to the applicant.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
