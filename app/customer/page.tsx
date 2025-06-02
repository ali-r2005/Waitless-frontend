"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Bell, Clock, QrCode } from "lucide-react"
import Link from "next/link"

import { useAuth } from "@/lib/auth-context"
import { getPrivateChannel } from "@/lib/pusher-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface QueueUpdatePayload {
  queue_id: number
  queue_name: string
  queue_state: string
  is_paused: boolean
  estimated_waiting_time: string
  average_service_time: number
  current_customer: {
    id: number
    name: string
    ticket_number: string
  }
  position: number
  customers_ahead: number
  total_customers: number
}

export default function CustomerQueuePage() {
  const { user, isLoading } = useAuth()
  const [queueData, setQueueData] = useState<QueueUpdatePayload | null>(null)

  useEffect(() => {
    if (!user?.id) return

    const channel = getPrivateChannel(`update.${user.id}`)

    channel.listen('.App\\Events\\SendUpdate', (event: { update: { data: QueueUpdatePayload } }) => {
      setQueueData(event.update.data)
    })

    return () => {
      channel.stopListening('.App\\Events\\SendUpdate')
      if (typeof window !== 'undefined' && window.Echo) {
        window.Echo.leave(`update.${user.id}`)
      }
    }
  }, [user?.id])

  if (isLoading || !queueData) return <div className="p-4 text-center">Loading your queue data...</div>

  const progress = Math.max(0, Math.min(100, 100 - (queueData.position / queueData.total_customers) * 100))

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </Link>
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-primary-teal" />
          <span className="ml-2 text-lg font-semibold">QueueMaster</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{queueData.queue_name}</h1>
          </div>

          <Card className="border-primary-teal/20 shadow-md">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl">Your Queue Status</CardTitle>
              <CardDescription>
                Currently Serving: #{queueData.current_customer.ticket_number}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="flex flex-col items-center justify-center rounded-full bg-primary-teal/10 p-6">
                <span className="text-4xl font-bold text-primary-teal">#{queueData.position}</span>
                <span className="text-sm text-muted-foreground">Your Position</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>People Ahead: {queueData.customers_ahead}</span>
                  <span>Total Waiting: {queueData.total_customers}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Estimated Wait</p>
                  <p className="text-lg font-semibold text-primary-teal">{queueData.estimated_waiting_time}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg. Service Time</p>
                  <p className="text-lg font-semibold">{Math.round(queueData.average_service_time)}s</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">You are waiting for</p>
                <p className="font-medium">{user?.name}</p>
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
