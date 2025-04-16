"use client"

import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/ui/page-header"
import { GeneralSettingsForm } from "@/components/forms/general-settings-form"
import { NotificationSettingsForm } from "@/components/forms/notification-settings-form"
import { QueueSettingsForm } from "@/components/forms/queue-settings-form"
import { getBranches, getDefaultSettings, getLanguages, getTimezones } from "@/lib/data-service"
import type {
  GeneralSettingsFormValues,
  NotificationSettingsFormValues,
  QueueSettingsFormValues,
} from "@/types/settings"

export default function SettingsPage() {
  // Get data from the data service
  const branches = getBranches()
  const languages = getLanguages()
  const timezones = getTimezones()
  const defaultSettings = getDefaultSettings()

  async function handleGeneralSubmit(data: GeneralSettingsFormValues) {
    // In a real app, you would call an API to update the settings
    console.log("Updating general settings:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async function handleNotificationSubmit(data: NotificationSettingsFormValues) {
    // In a real app, you would call an API to update the settings
    console.log("Updating notification settings:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  async function handleQueueSubmit(data: QueueSettingsFormValues) {
    // In a real app, you would call an API to update the settings
    console.log("Updating queue settings:", data)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="Settings"
            description="Configure your application preferences"
            backLink={{
              href: "/dashboard",
              label: "Back to Dashboard",
            }}
          />

          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="queue">Queue Management</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure your business and application preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <GeneralSettingsForm
                    defaultValues={defaultSettings.general}
                    branches={branches}
                    languages={languages}
                    timezones={timezones}
                    onSubmit={handleGeneralSubmit}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationSettingsForm
                    defaultValues={defaultSettings.notifications}
                    onSubmit={handleNotificationSubmit}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="queue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Queue Management Settings</CardTitle>
                  <CardDescription>Configure default queue behavior and settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <QueueSettingsForm defaultValues={defaultSettings.queue} onSubmit={handleQueueSubmit} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
