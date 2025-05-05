import type { StaffMember } from '@/types/staff'
import type { Role, RoleRequest } from '@/types/role'


interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

class StaffService {
  private baseUrl = '/api';

  // Staff management functions
  async searchUsers(query: string): Promise<StaffMember[]> {
    try {
      const response = await fetch(`${this.baseUrl}/staff/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to search users');
      }
      const result: ApiResponse<StaffMember[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async addUserToStaff(userId: string): Promise<StaffMember> {
    try {
      const response = await fetch(`${this.baseUrl}/staff/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to add user to staff');
      }
      const result: ApiResponse<StaffMember> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error adding user to staff:', error);
      throw error;
    }
  }

  async removeUserFromStaff(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/staff/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to remove user from staff');
      }
    } catch (error) {
      console.error('Error removing user from staff:', error);
      throw error;
    }
  }

  // Role management functions
  async getRoles(): Promise<Role[]> {
    try {
      const response = await fetch(`${this.baseUrl}/roles`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch roles');
      }
      const result: ApiResponse<Role[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async getRole(roleId: string): Promise<Role> {
    try {
      const response = await fetch(`${this.baseUrl}/roles/${roleId}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch role');
      }
      const result: ApiResponse<Role> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  }

  async createRole(roleData: Partial<Role>): Promise<Role> {
    try {
      const response = await fetch(`${this.baseUrl}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create role');
      }
      const result: ApiResponse<Role> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(roleId: string, roleData: Partial<Role>): Promise<Role> {
    try {
      const response = await fetch(`${this.baseUrl}/roles/${roleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roleData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update role');
      }
      const result: ApiResponse<Role> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/roles/${roleId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  // Role request functions
  async createRoleRequest(requestData: {
    userId: string;
    userName: string;
    userEmail: string;
    requestedRole: string;
  }): Promise<RoleRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/roles/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create role request');
      }
      const result: ApiResponse<RoleRequest> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating role request:', error);
      throw error;
    }
  }

  async getRoleRequests(status?: string): Promise<RoleRequest[]> {
    try {
      const url = status 
        ? `${this.baseUrl}/roles/requests?status=${status}`
        : `${this.baseUrl}/roles/requests`;
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch role requests');
      }
      const result: ApiResponse<RoleRequest[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching role requests:', error);
      throw error;
    }
  }

  async updateRoleRequest(requestId: string, status: 'approved' | 'rejected', adminId: string): Promise<RoleRequest> {
    try {
      const response = await fetch(`${this.baseUrl}/roles/requests`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId,
          status,
          adminId,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update role request');
      }
      const result: ApiResponse<RoleRequest> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error updating role request:', error);
      throw error;
    }
  }

  // Branch manager specific functions
  async promoteToBranchManager(userId: string): Promise<StaffMember> {
    try {
      const response = await fetch(`${this.baseUrl}/staff/${userId}/branch-manager`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to promote user to branch manager');
      }
      const result: ApiResponse<StaffMember> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error promoting user to branch manager:', error);
      throw error;
    }
  }

  async removeBranchManagerRole(userId: string): Promise<StaffMember> {
    try {
      const response = await fetch(`${this.baseUrl}/staff/${userId}/branch-manager`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to remove branch manager role');
      }
      const result: ApiResponse<StaffMember> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error removing branch manager role:', error);
      throw error;
    }
  }

  async listBranchManagers(): Promise<StaffMember[]> {
    try {
      const response = await fetch(`${this.baseUrl}/staff/branch-managers`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch branch managers');
      }
      const result: ApiResponse<StaffMember[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error fetching branch managers:', error);
      throw error;
    }
  }
}

export const staffService = new StaffService(); 