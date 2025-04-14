export interface GeneralSettingsFormValues {
  businessName: string
  defaultBranch?: string
  language: string
  timezone: string
}

export interface NotificationSettingsFormValues {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  notifyOnNewCustomer: boolean
  notifyOnQueueUpdate: boolean
  notifyOnStaffActivity: boolean
  dailySummary: boolean
}

export interface QueueSettingsFormValues {
  defaultQueueCapacity: number
  defaultServiceTime: number
  allowCustomersToJoinOnline: boolean
  allowCustomersToLeaveQueue: boolean
  sendConfirmationMessages: boolean
  autoStartQueues: boolean
  queueDisplayMode: "standard" | "minimal" | "detailed"
}

export interface Language {
  id: string
  name: string
}

export interface Timezone {
  id: string
  name: string
}
