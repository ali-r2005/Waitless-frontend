import api from "./axios"
import type { Branch } from "@/types/branch"

export interface CreateBranchData {
  name: string
  address: string
  parent_id?: number | null
}

export interface UpdateBranchData {
  name?: string
  address?: string
  parent_id?: number | null
}

export const branchService = {
  // Get all branches for the authenticated business owner
  async getBranches(): Promise<Branch[]> {
    try {
      const response = await api.get("/api/branches")
      // Handle both array at root and array in data property
      if (Array.isArray(response.data)) {
        return response.data
      } else if (Array.isArray((response.data as any)?.data)) {
        return (response.data as any).data
      }
      return []
    } catch (error) {
      console.error("Error fetching branches:", error)
      throw error
    }
  },

  // Get a single branch by ID
  async getBranchById(id: string | number): Promise<Branch> {
    try {
      const response = await api.get(`/api/branches/${id}`)
      return response.data as Branch
    } catch (error) {
      console.error(`Error fetching branch with id ${id}:`, error)
      throw error
    }
  },

  // Create a new branch
  async createBranch(data: CreateBranchData): Promise<Branch> {
    try {
      const response = await api.post("/api/branches", data)
      return response.data as Branch
    } catch (error) {
      console.error("Error creating branch:", error)
      throw error
    }
  },

  // Update a branch
  async updateBranch(id: string | number, data: UpdateBranchData): Promise<Branch> {
    try {
      const response = await api.put(`/api/branches/${id}`, data)
      return response.data as Branch
    } catch (error) {
      console.error(`Error updating branch with id ${id}:`, error)
      throw error
    }
  },

  // Delete a branch
  async deleteBranch(id: string | number): Promise<void> {
    try {
      await api.delete(`/api/branches/${id}`)
    } catch (error) {
      console.error(`Error deleting branch with id ${id}:`, error)
      throw error
    }
  },

  // Get branch hierarchy
  async getBranchHierarchy(id: string | number): Promise<Branch> {
    try {
      const response = await api.get(`/api/branches/${id}/hierarchy`)
      return response.data as Branch
    } catch (error) {
      console.error(`Error fetching hierarchy for branch ${id}:`, error)
      throw error
    }
  },

  // Move sub-branches to another branch
  async moveSubBranches(branchId: string | number, target_branch_id: number, branch_ids: number[]): Promise<{status: string, message: string}> {
    try {
      const response = await api.post(`/api/branches/${branchId}/move-sub-branches`, {
        target_branch_id,
        branch_ids
      })
      return response.data as {status: string, message: string}
    } catch (error) {
      console.error(`Error moving sub-branches for branch ${branchId}:`, error)
      throw error
    }
  }
}