import type { StaffMember, StaffUser } from '@/types/staff'
import api from './axios'

interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
}

class StaffService {

  // Search for existing staff members
  async searchStaff(query: string): Promise<StaffMember[]> {
    try {
      // First get all staff members
      const allStaff = await this.getStaffMembers();
      
      // Then filter them client-side based on the query
      if (!query.trim()) return allStaff;
      
      const lowerQuery = query.toLowerCase();
      return allStaff.filter(member => 
        (member.name && member.name.toLowerCase().includes(lowerQuery)) ||
        (member.email && member.email.toLowerCase().includes(lowerQuery))
      );
    } catch (error) {
      console.error('Error searching staff members:', error);
      throw error;
    }
  }
  
  // Search for users (customers) to add as staff
  async searchUsersToAddAsStaff(query: string): Promise<StaffUser[]> {
    try {
      if (!query.trim()) return [];
      
      const response = await api.get<ApiResponse<StaffUser[]>>(`/api/users/search?name=${encodeURIComponent(query)}`);
      console.log('Search users to add as staff response:', response.data);
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching users to add as staff:', error);
      throw error;
    }
  }

  async addUserToStaff(userId: number, roleId: number, branchId: number): Promise<any> {
    try {
      // Log the request data for debugging
      console.log('Adding user to staff with data:', { userId, roleId, branchId });
      
      // Make sure we're sending integers, not strings
      const payload = {
        role_id: Number(roleId),
        branch_id: Number(branchId)
      };
      
      const response = await api.post<ApiResponse<any>>(`/api/users/${userId}/add-to-staff`, payload);
      console.log('Add user to staff response:', response.data);
      return response.data.data;
    } catch (error: any) {
      // Enhanced error logging
      console.error('Error adding user to staff:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
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

  // Note: Role management functions have been moved to role-service.ts
  // Branch management functions have been moved to branch-service.ts

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