"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bell, Clock, Info, QrCode } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

import { useAuth } from "@/lib/auth-context"
import { getPrivateChannel } from "@/lib/pusher-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { formatSecondsFriendly } from "@/lib/utils"
import { Loader2 } from "lucide-react" // Added Loader2 for loading states
import { queueService } from "@/lib/queue-service" // Added import

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
  } | null
  position: number
  customers_ahead: number
  total_customers: number
}

export default function CustomerQueuePage() {
  const { user, isLoading } = useAuth()
  const [queueData, setQueueData] = useState<QueueUpdatePayload | null>(null)
  const [isLeaving, setIsLeaving] = useState(false) // Added loading state for leaving queue
  const router = useRouter() // Added for redirection
  const [initialDataLoadAttempted, setInitialDataLoadAttempted] = useState(false);

  useEffect(() => {
    if (isLoading) return; // Wait for user loading to complete

    if (!user?.id) {
      setInitialDataLoadAttempted(true); // No user ID after loading, so mark attempt
      return;
    }

    const channel = getPrivateChannel(`update.${user.id}`);
    let receivedData = false;

    channel.listen('.App\\Events\\SendUpdate', (event: { update: { data: QueueUpdatePayload } }) => {
      setQueueData(event.update.data);
      receivedData = true;
      if (!initialDataLoadAttempted) {
         setInitialDataLoadAttempted(true);
      }
    });

    // Set a timeout to mark data load attempt as complete even if no event comes
    const timer = setTimeout(() => {
      if (!receivedData) {
        setInitialDataLoadAttempted(true);
      }
    }, 7000); // 7 seconds timeout (increased from 5s)

    return () => {
      clearTimeout(timer);
      channel.stopListening('.App\\Events\\SendUpdate');
      if (typeof window !== 'undefined' && window.Echo && user?.id) { // ensure user.id for leave
        window.Echo.leave(`update.${user.id}`);
      }
    };
  }, [user?.id, isLoading, initialDataLoadAttempted]);

  if (isLoading) return <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 text-center"><Loader2 className="h-8 w-8 animate-spin text-waitless-green mb-4" />Loading user information...</div>;

  if (!user) { 
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 text-center">
        <Info className="h-12 w-12 text-destructive mb-4" />
        <p className="mb-4 text-lg font-semibold">User Not Authenticated</p>
        <p className="text-muted-foreground mb-6">Please log in to view your queue status.</p>
        <Button asChild className="bg-waitless-green hover:bg-waitless-green/90 text-white">
          <Link href="/auth/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  if (!initialDataLoadAttempted && !queueData) return <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 text-center"><Loader2 className="h-8 w-8 animate-spin text-waitless-green mb-4" />Connecting to queue service...</div>;

  if (initialDataLoadAttempted && !queueData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 text-center">
        <Info className="h-16 w-16 text-waitless-green mb-6" />
        <h1 className="text-3xl font-bold mb-3">Not in Queue</h1>
        <p className="text-muted-foreground mb-8 max-w-sm">It seems you are not currently part of any active queue. If you believe this is an error, please try refreshing or contact support.</p>
        <Button asChild className="bg-waitless-green hover:bg-waitless-green/90 text-white px-8 py-3 text-lg">
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    );
  }

  if (!queueData) return <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4 text-center"><Loader2 className="h-8 w-8 animate-spin text-waitless-green mb-4" />Loading queue data...</div>;

  const handleLeaveQueue = async () => {
    if (!user || !queueData) return

    setIsLeaving(true)
    try {
      await queueService.removeCustomerFromQueue(String(queueData.queue_id), String(user.id))
      // Optionally, show a success message or redirect
      alert("You have left the queue.") // Simple alert for now
      router.push('/') // Redirect to homepage
    } catch (error) {
      console.error("Failed to leave queue:", error)
      // Optionally, show an error message to the user
      alert("Failed to leave the queue. Please try again.")
    } finally {
      setIsLeaving(false)
    }
  }

  const progress = Math.max(0, Math.min(100, 100 - (queueData.position / queueData.total_customers) * 100))

  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-medium">Back</span>
        </Link>
        <div className="flex items-center">
          <Clock className="h-6 w-6 text-waitless-green" />
          <span className="ml-2 text-lg font-semibold">Waitless</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-md space-y-6">
          {queueData.is_paused && (
            <Alert variant="default" className="mb-6 bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-700 dark:text-yellow-300 shadow-md">
              <Info className="h-5 w-5 text-yellow-700 dark:text-yellow-400" />
              <AlertTitle className="font-semibold text-lg">Queue Paused</AlertTitle>
              <AlertDescription className="mt-1">
                This queue is currently paused by the administration. Your position is saved, and service will resume shortly. Please wait for updates.
              </AlertDescription>
            </Alert>
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold">{queueData.queue_name}</h1>
          </div>

          <Card className="border-primary-teal/20 shadow-md">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-xl">Your Queue Status</CardTitle>
              <CardDescription>
                Currently Serving: #{queueData.current_customer?.ticket_number ?? 'N/A'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <div className="flex flex-col items-center justify-center rounded-full bg-primary-teal/10 p-6">
                <span className="text-4xl font-bold text-waitless-green">#{queueData.position}</span>
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
                  <p className="text-lg font-semibold text-waitless-green">{formatSecondsFriendly(queueData.estimated_waiting_time)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Avg. Service Time</p>
                  <p className="text-lg font-semibold">{formatSecondsFriendly(queueData.average_service_time)}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">You are waiting for</p>
                <p className="font-medium">{user?.name}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full bg-waitless-green hover:bg-waitless-green/90 text-white">
                <Bell className="mr-2 h-4 w-4" />
                Notify Me When It's My Turn
              </Button>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10" onClick={handleLeaveQueue} disabled={isLeaving}>
                {isLeaving ? "Leaving..." : "Leave Queue"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
        <p>© 2025 Waitless. All rights reserved.</p>
      </footer>
    </div>
  )
}
