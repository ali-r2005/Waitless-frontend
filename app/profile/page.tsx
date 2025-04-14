"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/ui/page-header"
import { UserProfileCard } from "@/components/profile/user-profile-card"
import { ProfileForm } from "@/components/forms/profile-form"
import { PasswordForm } from "@/components/forms/password-form"
import { DeleteAccountForm } from "@/components/forms/delete-account-form"
import { updatePassword, updateProfile } from "@/lib/auth-service"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "@/components/ui/use-toast"
import type { PasswordFormValues, ProfileFormValues } from "@/types/user"

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && typeof window !== "undefined") {
      router.push("/auth/login?callback=/profile")
    }
  }, [user, router])

  // If no user yet, show loading state
  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>Loading profile...</p>
        </div>
      </DashboardLayout>
    )
  }

  async function handleProfileSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    try {
      const result = await updateProfile(data)
      
      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handlePasswordSubmit(data: PasswordFormValues) {
    setIsLoading(true)
    try {
      const result = await updatePassword({
        current_password: data.currentPassword,
        password: data.newPassword,
        password_confirmation: data.confirmPassword,
      })
      
      if (result.success) {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteAccount() {
    setIsDeleting(true)

    // In a real app, you would call an API to delete the account
    console.log("Deleting account")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Redirect to login page after account deletion
    router.push("/auth/login")
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="My Profile"
            description="View and update your profile information"
            backLink={{
              href: "/dashboard",
              label: "Back to Dashboard",
            }}
          />

          <div className="grid gap-4 md:grid-cols-[1fr_3fr]">
            <UserProfileCard user={user} />

            <div className="space-y-4">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile Information</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 pt-4">
                  <ProfileForm
                    defaultValues={{
                      name: user.name,
                      email: user.email,
                      phone: user.phone || "",
                      jobTitle: user.jobTitle || "",
                    }}
                    onSubmit={handleProfileSubmit}
                    isLoading={isLoading}
                  />
                </TabsContent>

                <TabsContent value="security" className="space-y-4 pt-4">
                  <PasswordForm 
                    onSubmit={handlePasswordSubmit} 
                    isLoading={isLoading}
                  />
                  <DeleteAccountForm 
                    userEmail={user.email}
                    onDelete={handleDeleteAccount}
                    isLoading={isDeleting}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
