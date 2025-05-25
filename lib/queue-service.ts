import api from "./axios"
import { API_ENDPOINTS } from "./api-config"
import type { 
  Queue, 
  QueueCustomer, 
  CreateQueueFormValues, 
  AddCustomerFormValues,
  StartQueueFormValues
} from "@/types/queue"

// Define API response types
interface ApiResponse<T = any> {
  status: string;
  message?: string;
  data?: T;
  [key: string]: any;
}

// Define request type for axios
interface ApiRequest<T = any> {
  method: string;
  url: string;
  data?: T;
  params?: any;
}

export const queueService = {
  // Queue Resource Endpoints
  async getQueues(params?: { branch_id?: string, is_active?: boolean }) {
    return api.get<ApiResponse<Queue[]>>(API_ENDPOINTS.QUEUES.LIST, { params });
  },

  async createQueue(data: CreateQueueFormValues) {
    return api.post<ApiResponse<Queue>>(API_ENDPOINTS.QUEUES.CREATE, data);
  },

  async getQueueDetails(id: string) {
    return api.get<ApiResponse<Queue>>(API_ENDPOINTS.QUEUES.DETAILS(id));
  },

  async updateQueue(id: string, data: Partial<CreateQueueFormValues>) {
    return api.put<ApiResponse<Queue>>(API_ENDPOINTS.QUEUES.UPDATE(id), data);
  },

  async deleteQueue(id: string) {
    return api.delete<ApiResponse>(API_ENDPOINTS.QUEUES.DELETE(id));
  },

  // Queue Customer Management
  async searchCustomers(name: string) {
    return api.get<ApiResponse<any[]>>(API_ENDPOINTS.USERS.SEARCH, { params: { name } });
  },

  async addCustomerToQueue(queue_id: string, user_id: string) {
    return api.post<ApiResponse>(API_ENDPOINTS.QUEUE_MANAGEMENT.ADD_CUSTOMER, {
      queue_id,
      user_id
    });
  },

  async removeCustomerFromQueue(queue_id: string, user_id: string) {
    // Using axios request method with ApiRequest type to avoid TypeScript error
    return api.request<ApiResponse>({
      method: 'DELETE',
      url: API_ENDPOINTS.QUEUE_MANAGEMENT.REMOVE_CUSTOMER,
      data: { queue_id, user_id }
    } as ApiRequest);
  },

  async getQueueCustomers(queue_id: string) {
    return api.get<ApiResponse<QueueCustomer[]>>(API_ENDPOINTS.QUEUE_MANAGEMENT.CUSTOMERS, {
      params: { queue_id }
    });
  },

  async moveCustomerInQueue(pivot_id: string, new_position: number) {
    return api.patch<ApiResponse>(API_ENDPOINTS.QUEUE_MANAGEMENT.MOVE_CUSTOMER(pivot_id), {
      new_position
    });
  },

  // Queue Operations
  async activateQueue(queue_id: string, is_active: boolean) {
    return api.post<ApiResponse>(API_ENDPOINTS.QUEUE_MANAGEMENT.ACTIVATE, {
      queue_id,
      is_active
    });
  },

  async callNextCustomer(queue_id: string) {
    return api.post<ApiResponse<{user: any, ticket_number: string}>>(API_ENDPOINTS.QUEUE_MANAGEMENT.CALL_NEXT, {
      queue_id
    });
  },

  async completeServing(queue_id: string, user_id: string, notes?: string) {
    return api.post<ApiResponse>(API_ENDPOINTS.QUEUE_MANAGEMENT.COMPLETE_SERVING, {
      queue_id,
      user_id,
      notes
    });
  },

  // Late Customer Management
  async markCustomerAsLate(queue_id: string, user_id: string) {
    return api.post<ApiResponse>(API_ENDPOINTS.QUEUE_MANAGEMENT.MARK_LATE, {
      queue_id,
      user_id
    });
  },

  async getLateCustomers(queue_id: string) {
    return api.get<ApiResponse<any[]>>(API_ENDPOINTS.QUEUE_MANAGEMENT.GET_LATE, {
      params: { queue_id }
    });
  },

  async reinsertLateCustomer(queue_id: string, user_id: string, position: number) {
    return api.post<ApiResponse>(API_ENDPOINTS.QUEUE_MANAGEMENT.REINSERT_LATE, {
      queue_id,
      user_id,
      position
    });
  }
}
