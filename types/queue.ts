export interface Queue {
  id: number
  branch_id: number
  staff_id: number
  name: string
  scheduled_date: string
  is_active: boolean
  start_time: string
  preferences: any | null
  created_at: string
  updated_at: string
  branch?: {
    id: number
    name: string
    address: string
  }
  staff?: {
    id: number
    name: string
  }
  users?: QueueUser[]
  // UI-specific properties
  status?: QueueStatus
  currentNumber?: number
  totalInQueue?: number
  estimatedWaitTime?: string
  description?: string
}

export type QueueStatus = "active" | "paused" | "closed"

export interface QueueUser {
  id: number
  name: string
  email: string
  pivot: {
    queue_id: number
    user_id: number
    status: "waiting" | "being_served" | "served" | "late"
    ticket_number: string
    position: number
    served_at: string | null
    late_at: string | null
  }
}

export interface QueueCustomer {
  id: number
  name: string
  phone?: string
  email?: string
  service?: string
  estimatedWait?: string
  status: "waiting" | "being_served" | "served" | "late"
  ticket_number: string
  position: number
  joinedAt?: string
  servedAt?: string | null
  lateAt?: string | null
  priority?: "normal" | "high" | "urgent"
  avatar?: string
}

export interface CreateQueueFormValues {
  name: string
  scheduled_date: string
  is_active: boolean
  start_time: string
  preferences?: any
  // UI-specific fields
  description?: string
  branch_id?: number
  max_capacity?: number
  estimated_service_time?: number
  notify_customers?: boolean
  allow_online_joining?: boolean
}

export interface AddCustomerFormValues {
  queue_id: number
  user_id: number
  // UI-specific fields
  name?: string
  phone?: string
  email?: string
  service_id?: string
  priority?: "normal" | "high" | "urgent"
  notes?: string
}

export interface StartQueueFormValues {
  queue_id: number
  is_active: boolean
  // UI-specific fields
  starting_number?: number
  notify_staff?: boolean
  display_on_kiosk?: boolean
  service_mode?: "sequential" | "parallel" | "manual"
}
