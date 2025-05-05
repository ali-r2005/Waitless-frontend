import api from "./axios"
import { API_ENDPOINTS } from "./api-config"

export interface Role {
  id: number
  name: string
  business_id: number
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  data?: T
  [key: string]: any
}

export interface CreateRoleData {
  name: string
  business_id: number
}

export interface UpdateRoleData {
  name: string
  business_id: number
}

export const roleService = {
  // Get all roles with optional filter by business_id
  async getRoles(business_id?: number): Promise<Role[]> {
    try {
      const params = business_id ? { business_id } : {}
      const response = await api.get<ApiResponse<Role[]> | Role[]>("/api/roles", { params })
      console.log('API Response for getRoles:', response.data)
      
      // Check if the response has a data property
      if (response.data && 'data' in response.data && Array.isArray(response.data.data)) {
        return response.data.data
      }
      
      // If response is an array, return it directly
      if (Array.isArray(response.data)) {
        return response.data
      }

      // In development mode, return mock data if the API fails
      if (process.env.NODE_ENV === 'development') {
        console.warn('Returning mock role data');
        return [
          {
            id: 1,
            name: "Admin",
            business_id: business_id || 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Manager",
            business_id: business_id || 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            name: "Staff",
            business_id: business_id || 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }

      return []
    } catch (error) {
      console.error("Error fetching roles:", error)
      
      // In development mode, return mock data if an error occurs
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error caught, returning mock role data');
        return [
          {
            id: 1,
            name: "Admin",
            business_id: business_id || 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            name: "Manager",
            business_id: business_id || 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 3,
            name: "Staff",
            business_id: business_id || 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
      }
      
      throw error
    }
  },

  // Get a role by ID
  async getRoleById(id: number): Promise<Role> {
    try {
      const response = await api.get<ApiResponse<Role> | Role>(`/api/roles/${id}`)
      console.log('API Response for getRoleById:', response.data)
      
      // Check if the response has a data property
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data as Role
      }
      
      return response.data as Role
    } catch (error) {
      console.error(`Error fetching role with id ${id}:`, error)
      
      // In development mode, return mock data if an error occurs
      if (process.env.NODE_ENV === 'development') {
        return {
          id: id,
          name: "Mock Role",
          business_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      throw error
    }
  },

  // Create a new role
  async createRole(data: CreateRoleData): Promise<Role> {
    try {
      const response = await api.post<ApiResponse<Role> | Role>("/api/roles", data)
      console.log('API Response for createRole:', response.data)
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data as Role
      }
      
      return response.data as Role
    } catch (error) {
      console.error("Error creating role:", error)
      
      // In development mode, return mock data for the created role
      if (process.env.NODE_ENV === 'development') {
        return {
          id: Math.floor(Math.random() * 1000) + 10,
          name: data.name,
          business_id: data.business_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      throw error
    }
  },

  // Update a role
  async updateRole(id: number, data: UpdateRoleData): Promise<Role> {
    try {
      const response = await api.put<ApiResponse<Role> | Role>(`/api/roles/${id}`, data)
      console.log('API Response for updateRole:', response.data)
      
      if (response.data && typeof response.data === 'object' && 'data' in response.data) {
        return response.data.data as Role
      }
      
      return response.data as Role
    } catch (error) {
      console.error(`Error updating role with id ${id}:`, error)
      
      // In development mode, return mock data for the updated role
      if (process.env.NODE_ENV === 'development') {
        return {
          id: id,
          name: data.name,
          business_id: data.business_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      }
      
      throw error
    }
  },

  // Delete a role
  async deleteRole(id: number): Promise<void> {
    try {
      const response = await api.delete(`/api/roles/${id}`)
      console.log('API Response for deleteRole:', response.data)
    } catch (error) {
      console.error(`Error deleting role with id ${id}:`, error)
      throw error
    }
  }
} 