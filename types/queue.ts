export interface Queue {
  id: number
  branch_id: number
  staff_id: number
  name: string
  scheduled_date: string
  is_active: boolean
  is_paused?: boolean
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
  status?: "waiting" | "being_served" | "served" | "late"
  ticket_number?: string
  position?: number
  joinedAt?: string
  servedAt?: string | null
  lateAt?: string | null
  priority?: "normal" | "high" | "urgent"
  avatar?: string
  // New properties from API response
  pivot?: {
    queue_id: number
    user_id: number
    status: "waiting" | "serving" | "served" | "late"
    ticket_number: string
    position: number
    waiting_time: number
    created_at: string
    updated_at: string
    served_at: string | null
    late_at: string | null
  }
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

/**
 * Interface for served customer data returned by the analytics endpoint
 */
export interface ServedCustomer {
  id: number
  queue_id: number
  user_id: number
  waiting_time: number // in seconds
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    email: string
  }
}

/**
 * Interface for statistics about served customers
 */
export interface ServedCustomerStats {
  served_customers: ServedCustomer[]
  statistics: {
    total_served: number
    average_waiting_time: number // in seconds
    date: string
  }
}

/**
 * Interface for real-time queue updates from Pusher
 */
export interface QueueUpdate {
  queue?: {
    id: number
    name: string
    is_active: boolean
    is_paused?: boolean
  }
  queue_state?: 'active' | 'paused' | 'inactive' | 'ready_to_call'
  customers?: {
    id: number
    name: string
    position: number
    ticket_number: string
    status: "waiting" | "being_served" | "served" | "late"
  }[]
  current_serving?: {
    user_id: number | null
    ticket_number: string | null
  }
  customer_served?: boolean
  customer_late?: boolean
  total_customers?: number
  average_service_time?: string
}
