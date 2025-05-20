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
    user?: {
      id: number
      name: string
      email: string
      phone: string
      role: string
      branch_id: number
      business_id: number
      created_at: string
      updated_at: string
    }
    role?: {
      id: number
      business_id: number
      name: string
      created_at: string
      updated_at: string
    }
  }
  // Frontend display properties
  role?: string
  branch: {
    name : string
  }
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
