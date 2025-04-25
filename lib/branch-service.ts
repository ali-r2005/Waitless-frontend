import api from "./axios"
import { API_ENDPOINTS } from "./api-config"
import type { Branch } from "@/types/branch"

export interface CreateBranchData {
  name: string
  address: string
  business_id: number
  parent_id?: number | null
}

export interface UpdateBranchData {
  name?: string
  address?: string
  parent_id?: number | null
}

export const branchService = {
  // Get all branches with optional filters
  async getBranches(params?: { business_id?: number; parent_id?: number }): Promise<Branch[]> {
    try {
      const response = await api.get("/api/branches", { params })
      console.log('API Response for getBranches:', response.data)
      
      // Check if the response has a data property
      if (response.data && response.data.data) {
        return response.data.data
      }
      
      // If response is an array, return it directly
      if (Array.isArray(response.data)) {
        return response.data
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
      console.log('API Response for getBranchById:', response.data)
      
      // Check if the response has a data property
      if (response.data && response.data.data) {
        return response.data.data
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching branch with id ${id}:`, error)
      throw error
    }
  },

  // Create a new branch
  async createBranch(data: CreateBranchData): Promise<Branch> {
    try {
      const response = await api.post("/api/branches", data)
      console.log('API Response for createBranch:', response.data)
      
      if (response.data && response.data.data) {
        return response.data.data
      }
      
      return response.data
    } catch (error) {
      console.error("Error creating branch:", error)
      throw error
    }
  },

  // Update a branch
  async updateBranch(id: string | number, data: UpdateBranchData): Promise<Branch> {
    try {
      const response = await api.put(`/api/branches/${id}`, data)
      console.log('API Response for updateBranch:', response.data)
      
      if (response.data && response.data.data) {
        return response.data.data
      }
      
      return response.data
    } catch (error) {
      console.error(`Error updating branch with id ${id}:`, error)
      throw error
    }
  },

  // Delete a branch
  async deleteBranch(id: string | number): Promise<void> {
    try {
      const response = await api.delete(`/api/branches/${id}`)
      console.log('API Response for deleteBranch:', response.data)
    } catch (error) {
      console.error(`Error deleting branch with id ${id}:`, error)
      throw error
    }
  },

  // Get branch hierarchy
  async getBranchHierarchy(id: string | number): Promise<Branch> {
    try {
      const response = await api.get(`/api/branches/${id}/hierarchy`)
      console.log('API Response for getBranchHierarchy:', response.data)
      
      if (response.data && response.data.data) {
        return response.data.data
      }
      
      return response.data
    } catch (error) {
      console.error(`Error fetching hierarchy for branch ${id}:`, error)
      throw error
    }
  }
} 