import branchesData from "@/data/branches.json"
import staffData from "@/data/staff.json"
import queuesData from "@/data/queues.json"
import settingsData from "@/data/settings.json"
import userData from "@/data/users.json"

import type { Branch } from "@/types/branch"
import type { StaffMember, StaffRequest } from "@/types/staff"
import type { Queue, QueueCustomer } from "@/types/queue"
import type { Language, Timezone } from "@/types/settings"
import type { UserProfile } from "@/types/user"

// Branch data functions
export function getBranches(): Branch[] {
  return branchesData as Branch[]
}

export function getBranchById(id: string): Branch | undefined {
  return getBranches().find((branch) => branch.id === id)
}

// Staff data functions
const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "Branch Manager",
    branch: "Main Branch",
    status: "active",
    avatar: ""
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    role: "Staff",
    branch: "Downtown Branch",
    status: "active",
    avatar: ""
  }
]

const mockPendingRequests: StaffRequest[] = [
  {
    id: "101",
    name: "Jessica Lee",
    email: "jessica.lee@example.com",
    requestedRole: "Staff",
    requestedBranch: "Downtown Branch",
    requestDate: "2024-03-15",
    avatar: ""
  }
]

export function getStaffMembers(): StaffMember[] {
  return mockStaff
}

export function getPendingStaffRequests(): StaffRequest[] {
  return mockPendingRequests
}

export function getStaffMemberById(id: string): StaffMember | undefined {
  return mockStaff.find((staff) => staff.id === id)
}

// Queue data functions
export function getActiveQueues(): Queue[] {
  return queuesData.activeQueues as Queue[]
}

export function getQueueById(id: string): Queue | undefined {
  return getActiveQueues().find((queue) => queue.id === id)
}

export function getCustomersInQueue(queueId: string): QueueCustomer[] {
  // In a real app, this would filter by queue ID
  return queuesData.customersInQueue as QueueCustomer[]
}

export function getServices() {
  return queuesData.services
}

// Settings data functions
export function getLanguages(): Language[] {
  return settingsData.languages as Language[]
}

export function getTimezones(): Timezone[] {
  return settingsData.timezones as Timezone[]
}

export function getDefaultSettings() {
  return settingsData.defaultSettings
}

// User data functions
export function getCurrentUser(): UserProfile {
  return userData.currentUser as UserProfile
}
