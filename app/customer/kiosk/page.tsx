import Link from "next/link"
import { Clock, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function KioskPage() {
  const queueItems = [
    { id: 1, number: 1, status: "serving" },
    { id: 2, number: 2, status: "waiting" },
    { id: 3, number: 3, status: "waiting" },
    { id: 4, number: 4, status: "waiting" },
    { id: 5, number: 5, status: "waiting" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex h-20 items-center justify-center border-b bg-background px-4 md:px-6">
        <div className="flex items-center">
          <Clock className="h-8 w-8 text-primary-teal" />
          <span className="ml-2 text-2xl font-bold">Style Studio Salon</span>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="queue" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="queue">Current Queue</TabsTrigger>
              <TabsTrigger value="join">Join Queue</TabsTrigger>
            </TabsList>

            <TabsContent value="queue" className="mt-6">
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold">Current Queue Status</h1>
                <p className="text-xl text-muted-foreground">Downtown Branch</p>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card className="border-primary-teal">
                  <CardHeader className="bg-primary-teal/10 pb-2 text-center">
                    <CardTitle className="text-2xl">Now Serving</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center rounded-full bg-primary-teal/10 p-8">
                      <span className="text-6xl font-bold text-primary-teal">#1</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2 text-center">
                    <CardTitle className="text-2xl">Queue Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <span className="font-medium">Estimated Wait Time</span>
                      <span className="font-semibold text-primary-teal">~35 minutes</span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <span className="font-medium">People in Queue</span>
                      <span>5</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Queue List</CardTitle>
                  <CardDescription>Current position of customers in the queue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {queueItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between rounded-md border p-4 ${
                          item.status === "serving" ? "border-primary-teal bg-primary-teal/10" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              item.status === "serving"
                                ? "bg-primary-teal text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            #{item.number}
                          </div>
                          <div>
                            <p className="font-medium">
                              Ticket #{item.number}
                              {item.status === "serving" && (
                                <span className="ml-2 text-primary-teal">• Now Serving</span>
                              )}
                            </p>
                          </div>
                        </div>
                        <div>
                          {item.status === "waiting" && (
                            <span className="text-sm text-muted-foreground">
                              {item.number === 2 ? "Next" : `${item.number - 1} ahead`}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="join" className="mt-6">
              <div className="mb-6 text-center">
                <h1 className="text-3xl font-bold">Join Our Queue</h1>
                <p className="text-xl text-muted-foreground">Scan the QR code or tap the button below</p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="mb-8 rounded-lg bg-white p-4 shadow-md">
                  <QrCode className="h-64 w-64 text-primary-teal" />
                </div>

                <p className="mb-6 max-w-md text-center text-muted-foreground">
                  Scan this code with your phone camera to join the queue from your mobile device, or tap the button
                  below to join from this kiosk.
                </p>

                <Link href="/customer/join">
                  <Button size="lg" className="bg-primary-teal px-8 py-6 text-xl hover:bg-primary-teal/90">
                    Join Queue Now
                  </Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t bg-background p-4 text-center">
        <div className="flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary-teal" />
          <span className="ml-2 text-sm text-muted-foreground">Powered by QueueMaster</span>
        </div>
      </footer>
    </div>
  )
}
