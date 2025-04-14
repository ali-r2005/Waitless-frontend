import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function JoinQueuePage() {
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
            <h1 className="text-2xl font-bold">Style Studio Salon</h1>
            <p className="text-muted-foreground">Downtown Branch</p>
          </div>

          <Card className="mb-6 border-primary-teal/20 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>Join the Queue</CardTitle>
              <CardDescription>Please enter your information to join the queue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter your name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Enter your phone number" />
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label>Select Service</Label>
                <RadioGroup defaultValue="haircut">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="haircut" id="haircut" />
                      <Label htmlFor="haircut" className="font-normal">
                        Haircut
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">30 min</span>
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="manicure" id="manicure" />
                      <Label htmlFor="manicure" className="font-normal">
                        Manicure
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">45 min</span>
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="facial" id="facial" />
                      <Label htmlFor="facial" className="font-normal">
                        Facial
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">60 min</span>
                  </div>

                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="beard-trim" id="beard-trim" />
                      <Label htmlFor="beard-trim" className="font-normal">
                        Beard Trim
                      </Label>
                    </div>
                    <span className="text-sm text-muted-foreground">15 min</span>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/customer/queue/123" className="w-full">
                <Button className="w-full bg-primary-teal hover:bg-primary-teal/90">
                  Join Queue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">Current Queue Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="font-medium">Current Wait Time</span>
                <span className="font-semibold text-primary-teal">~35 minutes</span>
              </div>
              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="font-medium">People in Queue</span>
                <span>5</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t bg-background p-4 text-center text-sm text-muted-foreground">
        <p>© 2023 QueueMaster. All rights reserved.</p>
      </footer>
    </div>
  )
}
