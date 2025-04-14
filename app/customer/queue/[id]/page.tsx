import Link from "next/link"
import { ArrowLeft, Bell, Clock, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export default function CustomerQueuePage({ params }: { params: { id: string } }) {
  // This would be fetched from your backend based on the queue ID
  const queueData = {
    id: params.id,
    businessName: "Style Studio Salon",
    branchName: "Downtown Branch",
    customerName: "John Doe",
    position: 3,
    estimatedWaitTime: "25 minutes",
    peopleAhead: 2,
    service: "Haircut",
    joinedAt: "11:30 AM",
    currentlyServing: 1,
    totalInQueue: 5,
  }

  // Calculate progress percentage (inverse of position - lower number = more progress)
  const progressPercentage = Math.max(0, Math.min(100, 100 - (queueData.position / queueData.totalInQueue) * 100))

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-primary-teal" />
          <span className="ml-2 text-lg font-semibold">QueueMaster</span>
        </div>
        <div className="w-10"></div> {/* Empty div for flex spacing */}
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">{queueData.businessName}</h1>
            <p className="text-muted-foreground">{queueData.branchName}</p>
          </div>

          <Card className="mb-6 border-primary-teal/20 shadow-md">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl">Your Queue Status</CardTitle>
              <CardDescription>Joined at {queueData.joinedAt}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pb-2 text-center">
              <div className="flex flex-col items-center justify-center rounded-full bg-primary-teal/10 p-6">
                <span className="text-4xl font-bold text-primary-teal">#{queueData.position}</span>
                <span className="text-sm text-muted-foreground">Your position</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Currently serving: #{queueData.currentlyServing}</span>
                  <span>Total waiting: {queueData.totalInQueue}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Estimated Wait</p>
                  <p className="text-lg font-semibold text-primary-teal">{queueData.estimatedWaitTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">People Ahead</p>
                  <p className="text-lg font-semibold">{queueData.peopleAhead}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Service</p>
                <p className="font-medium">{queueData.service}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-primary-teal hover:bg-primary-teal/90">
                <Bell className="mr-2 h-4 w-4" />
                Notify Me When It's My Turn
              </Button>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
                Leave Queue
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">Share Your Queue Link</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="mb-4 rounded-lg bg-white p-2">
                <QrCode className="h-32 w-32 text-primary-teal" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Scan this code or share the link below to check your queue status from another device
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Copy Link
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
        <p>© 2023 QueueMaster. All rights reserved.</p>
      </footer>
    </div>
  )
}
