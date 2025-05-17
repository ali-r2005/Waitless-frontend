// User that can be added as staff (from search results)
export interface StaffUser {
  id: number
  name: string
  email: string
}

// Staff member with role and branch information
export interface StaffMember {
  id: number
  name: string
  email: string
  branch_id: number
  staff: {
    id: number
    role_id: number
    created_at: string
  }
  // Frontend display properties
  role?: string
  branch?: string
  status?: "active" | "inactive"
  avatar?: string
}

export interface StaffRequest {
  id: number
  name: string
  email: string
  requestedRole: string
  requestedBranch: string
  requestDate: string
  avatar?: string
}
