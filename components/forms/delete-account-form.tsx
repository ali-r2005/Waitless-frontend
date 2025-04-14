"use client"

import { useState } from "react"
import { Loader2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface DeleteAccountFormProps {
  userEmail: string
  onDelete: () => Promise<void>
  isLoading?: boolean
}

export function DeleteAccountForm({ userEmail, onDelete, isLoading: externalLoading }: DeleteAccountFormProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [internalLoading, setInternalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use external loading state if provided, otherwise use internal state
  const isLoading = externalLoading !== undefined ? externalLoading : internalLoading

  async function handleDeleteAccount() {
    if (deleteConfirmation !== userEmail) {
      setError("Email confirmation does not match")
      return
    }

    if (externalLoading !== undefined) {
      // If external loading state is provided, don't manage loading state internally
      setError(null)
      
      try {
        await onDelete()
        // Redirect is handled by the parent component
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
        console.error(error)
      }
    } else {
      // Otherwise manage loading state internally
      setInternalLoading(true)
      setError(null)

      try {
        await onDelete()
        // Redirect is handled by the parent component
      } catch (error) {
        setError("An unexpected error occurred. Please try again.")
        console.error(error)
      } finally {
        setInternalLoading(false)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>Permanently delete your account and all associated data</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Once you delete your account, there is no going back. All your data will be permanently removed from our
          servers. Please be certain.
        </p>
      </CardContent>
      <CardFooter>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove all your data from
                our servers.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm font-medium">
                To confirm, please type your email address: <span className="font-bold">{userEmail}</span>
              </p>
              <Input
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Enter your email"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isLoading || deleteConfirmation !== userEmail}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
