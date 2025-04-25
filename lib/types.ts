export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  status: "active" | "inactive";
  avatar: string;
}

export interface StaffRequest {
  id: string;
  name: string;
  email: string;
  requestedRole: string;
  requestedBranch: string;
  requestDate: string;
  avatar: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
} 