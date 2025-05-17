import type { StaffMember, StaffUser } from '@/types/staff'
import type { Role } from '@/types/role'
import api from './axios'

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

class StaffService {

  // Search for users to add as staff
  async searchUsers(query: string): Promise<StaffUser[]> {
    try {
      const response = await api.get<ApiResponse<StaffUser[]>>(`/api/users/search?name=${encodeURIComponent(query)}`);
      console.log('Search users response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  async addUserToStaff(userId: number, roleId: number, branchId: number): Promise<any> {
    try {
      const response = await api.post<ApiResponse<any>>(`/api/users/${userId}/add-to-staff`, {
        role_id: roleId,
        branch_id: branchId
      });
      console.log('Add user to staff response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error adding user to staff:', error);
      throw error;
    }
  }

  async removeUserFromStaff(userId: number): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/api/users/${userId}/remove-from-staff`);
      console.log('Remove user from staff response:', response.data);
    } catch (error) {
      console.error('Error removing user from staff:', error);
      throw error;
    }
  }

  // Role management functions
  async getRoles(): Promise<Role[]> {
    try {
      const response = await api.get<ApiResponse<Role[]>>(`/api/roles`);
      console.log('Get roles response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }

  async getRole(roleId: string): Promise<Role> {
    try {
      const response = await api.get<ApiResponse<Role>>(`/api/roles/${roleId}`);
      console.log('Get role response:', response.data);
      return response.data.data as Role;
    } catch (error) {
      console.error('Error fetching role:', error);
      throw error;
    }
  }

  async createRole(roleData: Partial<Role>): Promise<Role> {
    try {
      const response = await api.post<ApiResponse<Role>>(`/api/roles`, roleData);
      console.log('Create role response:', response.data);
      return response.data.data as Role;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }

  async updateRole(roleId: string, roleData: Partial<Role>): Promise<Role> {
    try {
      const response = await api.put<ApiResponse<Role>>(`/api/roles/${roleId}`, roleData);
      console.log('Update role response:', response.data);
      return response.data.data as Role;
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }

  async deleteRole(roleId: string): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/api/roles/${roleId}`);
      console.log('Delete role response:', response.data);
    } catch (error) {
      console.error('Error deleting role:', error);
      throw error;
    }
  }

  // Get all staff members
  async getStaffMembers(): Promise<StaffMember[]> {
    try {
      const response = await api.get<ApiResponse<StaffMember[]>>('/api/staff');
      console.log('Get staff members response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching staff members:', error);
      throw error;
    }
  }

  // Get a specific staff member
  async getStaffMember(userId: number): Promise<StaffMember> {
    try {
      const response = await api.get<ApiResponse<StaffMember>>(`/api/staff/${userId}`);
      console.log('Get staff member response:', response.data);
      return response.data.data as StaffMember;
    } catch (error) {
      console.error(`Error fetching staff member with id ${userId}:`, error);
      throw error;
    }
  }

  // Branch manager specific functions
  async promoteToBranchManager(userId: number): Promise<any> {
    try {
      const response = await api.post<ApiResponse<any>>(`/api/users/${userId}/branch-manager`);
      console.log('Promote to branch manager response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error promoting user to branch manager:', error);
      throw error;
    }
  }

  async removeBranchManagerRole(userId: number): Promise<any> {
    try {
      const response = await api.delete<ApiResponse<any>>(`/api/branch-managers/${userId}`);
      console.log('Remove branch manager role response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error removing branch manager role:', error);
      throw error;
    }
  }

  async listBranchManagers(): Promise<StaffMember[]> {
    try {
      const response = await api.get<ApiResponse<StaffMember[]>>(`/api/branch-managers`);
      console.log('List branch managers response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching branch managers:', error);
      throw error;
    }
  }
}

export const staffService = new StaffService(); 