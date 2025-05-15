"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText } from "lucide-react"

export default function VerificationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [idDocument, setIdDocument] = useState<File | null>(null)
  const [addressDocument, setAddressDocument] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!idDocument || !addressDocument) {
      toast({
        title: "Error",
        description: "Please upload both ID and address proof documents",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // In a real app, you would upload these files to a storage service
    // and then update the user's verification status in the database

    // Simulating API call
    setTimeout(() => {
      toast({
        title: "Verification Submitted",
        description: "Your documents have been submitted for verification. This process may take 1-2 business days.",
      })
      setIsSubmitting(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Account</CardTitle>
        <CardDescription>Verified accounts get more job opportunities and higher visibility</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id-proof">ID Proof (Aadhaar, PAN, Voter ID)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="id-proof"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setIdDocument(e.target.files?.[0] || null)}
                className="flex-1"
                required
              />
              {idDocument && (
                <div className="flex items-center text-sm text-green-600">
                  <FileText className="h-4 w-4 mr-1" />
                  {idDocument.name}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address-proof">Address Proof (Utility Bill, Rental Agreement)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="address-proof"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setAddressDocument(e.target.files?.[0] || null)}
                className="flex-1"
                required
              />
              {addressDocument && (
                <div className="flex items-center text-sm text-green-600">
                  <FileText className="h-4 w-4 mr-1" />
                  {addressDocument.name}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
            <p>
              <strong>Important:</strong> Please ensure your documents are clearly visible and all information is
              legible. We only use these documents for verification purposes and they are stored securely.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Submit for Verification"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
