import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VerificationBadgeProps {
  status: "unverified" | "pending" | "verified"
  size?: "sm" | "md" | "lg"
}

export default function VerificationBadge({ status, size = "md" }: VerificationBadgeProps) {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const getStatusInfo = () => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle className={`${sizeClass[size]} text-green-500 fill-green-500`} />,
          text: "Verified Account",
          description: "This user has been verified by SnapWork",
        }
      case "pending":
        return {
          icon: <Clock className={`${sizeClass[size]} text-amber-500`} />,
          text: "Verification Pending",
          description: "Verification documents are under review",
        }
      default:
        return {
          icon: <AlertCircle className={`${sizeClass[size]} text-gray-400`} />,
          text: "Not Verified",
          description: "This user has not been verified yet",
        }
    }
  }

  const { icon, text, description } = getStatusInfo()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help">{icon}</span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{text}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
