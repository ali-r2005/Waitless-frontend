export type RoleType = 'guest' | 'staff' | 'branch_manager' | 'admin';

export interface Role {
  id: string;
  name: string;
  type: RoleType;
  permissions: string[];
  description: string;
  created_at: string;
  updated_at: string;
}

export interface RoleRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedRole: RoleType;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  responseDate?: string;
  respondedBy?: string;
} 