import { Badge } from "@/components/ui/badge"
import type { QueueStatus } from "@/types/queue"

interface QueueStatusBadgeProps {
  status: QueueStatus
}

export function QueueStatusBadge({ status }: QueueStatusBadgeProps) {
  if (status === "active") {
    return <Badge className="bg-green-500 text-white">Active</Badge>
  } else if (status === "paused") {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
        Paused
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-slate-100 text-slate-700 dark:bg-slate-800/20 dark:text-slate-400">
        Closed
      </Badge>
    )
  }
}
