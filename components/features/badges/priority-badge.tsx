import { Badge } from "@/components/ui/badge"

type PriorityType = "normal" | "high" | "urgent"

interface PriorityBadgeProps {
  priority: PriorityType
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  switch (priority) {
    case "high":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          High Priority
        </Badge>
      )
    case "urgent":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          Urgent
        </Badge>
      )
    default:
      return null
  }
}
