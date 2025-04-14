export interface Queue {
  id: string
  name: string
  description?: string
  branchId: string
  branch: string
  maxCapacity: number
  estimatedServiceTime: number
  notifyCustomers: boolean
  allowOnlineJoining: boolean
  status: QueueStatus
  currentNumber: number
  totalInQueue: number
  estimatedWaitTime: string
  createdAt: string
}

export type QueueStatus = "active" | "paused" | "closed"

export interface QueueCustomer {
  id: string
  name: string
  phone: string
  email?: string
  service: string
  estimatedWait: string
  status: "current" | "waiting" | "served" | "absent"
  joinedAt: string
  servedAt?: string
  priority: "normal" | "high" | "urgent"
  avatar?: string
}

export interface CreateQueueFormValues {
  name: string
  description?: string
  branchId: string
  maxCapacity: number
  estimatedServiceTime: number
  notifyCustomers: boolean
  allowOnlineJoining: boolean
}

export interface AddCustomerFormValues {
  name: string
  phone: string
  email?: string
  queueId: string
  serviceId: string
  priority: "normal" | "high" | "urgent"
  notes?: string
}

export interface StartQueueFormValues {
  queueId: string
  startingNumber: number
  notifyStaff: boolean
  displayOnKiosk: boolean
  serviceMode: "sequential" | "parallel" | "manual"
}
