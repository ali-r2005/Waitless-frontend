import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface StatsCardProps {
  title: string
  value: number
  description?: string
  max?: number
}

export function StatsCard({ title, value, description, max = 100 }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <path d="M12 2v20M2 12h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}%</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        <Progress
          value={value}
          max={max}
          className="mt-4"
        />
      </CardContent>
    </Card>
  )
} 