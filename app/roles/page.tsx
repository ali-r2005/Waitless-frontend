"use client"

import { Plus, Edit, Trash2, MoreHorizontal, Check, X } from "lucide-react"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/sections/layouts/dashboard-layout"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { roleService, type Role } from "@/lib/role-service"

// Role Form Component
interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: { name: string; business_id: number }) => Promise<void>;
  isLoading: boolean;
  businessId: number;
}

function RoleForm({ initialData, onSubmit, isLoading, businessId }: RoleFormProps) {
  const [name, setName] = useState(initialData?.name || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }

    await onSubmit({ 
      name, 
      business_id: businessId 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Role Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter role name"
          disabled={isLoading}
          required
        />
      </div>
      <Button 
        type="submit" 
        disabled={isLoading} 
        className="w-full bg-[#10bc69] hover:bg-[#0f9a58] text-white"
      >
        {isLoading ? (
          <span className="flex items-center">
            <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
            {initialData ? 'Updating...' : 'Creating...'}
          </span>
        ) : (
          initialData ? 'Update Role' : 'Create Role'
        )}
      </Button>
    </form>
  );
}

// Role Card Component
interface RoleCardProps {
  role: Role;
  onAction: (action: string, roleId: number) => void;
}

function RoleCard({ role, onAction }: RoleCardProps) {
  return (
    <Card className="group overflow-hidden border border-gray-100 dark:border-gray-700 rounded-xl transform transition-all duration-300 hover:shadow-lg hover:border-[#10bc69] dark:hover:border-[#10bc69] hover:-translate-y-1">
      <CardHeader className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">{role.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onAction('edit', role.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onAction('delete', role.id)}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Role ID: {role.id}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Business ID: {role.business_id}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Created: {new Date(role.created_at).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Updated: {new Date(role.updated_at).toLocaleDateString()}
        </div>
      </CardFooter>
    </Card>
  );
}

// Main Page Component
export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  
  // This should be fetched from user context or app state
  const businessId = 1; // Example business ID, replace with actual value

  const fetchRoles = async () => {
    try {
      const data = await roleService.getRoles(businessId);
      setRoles(data);
    } catch (err: any) {
      setError(err.message || "Failed to load roles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleCreateRole = async (data: { name: string; business_id: number }) => {
    setIsSubmitting(true);
    try {
      await roleService.createRole(data);
      await fetchRoles();
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Role created successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create role",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRole = async (data: { name: string; business_id: number }) => {
    if (!selectedRole) return;
    setIsSubmitting(true);
    try {
      await roleService.updateRole(selectedRole.id, data);
      await fetchRoles();
      setIsDialogOpen(false);
      setSelectedRole(undefined);
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update role",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await roleService.deleteRole(roleId);
      await fetchRoles();
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const handleRoleAction = async (action: string, roleId: number) => {
    switch (action) {
      case "edit":
        const role = roles.find(r => r.id === roleId);
        setSelectedRole(role);
        setIsDialogOpen(true);
        break;
      case "delete":
        await handleDeleteRole(roleId);
        break;
      default:
        console.log(`Action: ${action}, Role ID: ${roleId}`);
    }
  };

  const openCreateDialog = () => {
    setSelectedRole(undefined);
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
          <PageHeader
            title="Role Management"
            actions={
              <Button 
                className="bg-[#10bc69] hover:bg-[#0f9a58] text-white transition-all duration-300"
                onClick={openCreateDialog}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Role
              </Button>
            }
          />

          {/* Dialog for creating/editing roles - move outside of PageHeader */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedRole ? "Edit Role" : "Create New Role"}</DialogTitle>
                <DialogDescription>
                  {selectedRole 
                    ? "Update the role details below"
                    : "Fill in the details below to create a new role"}
                </DialogDescription>
              </DialogHeader>
              <RoleForm
                initialData={selectedRole}
                onSubmit={selectedRole ? handleUpdateRole : handleCreateRole}
                isLoading={isSubmitting}
                businessId={businessId}
              />
            </DialogContent>
          </Dialog>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#10bc69]"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-center">
              <div className="flex items-center justify-center mb-2">
                <X className="h-5 w-5 mr-2" />
                <span className="font-semibold">Error</span>
              </div>
              <p>{error}</p>
              <Button 
                onClick={() => fetchRoles()} 
                className="mt-4 bg-white text-red-600 border border-red-300 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {roles.length > 0 ? (
                roles.map((role) => (
                  <RoleCard key={role.id} role={role} onAction={handleRoleAction} />
                ))
              ) : (
                <div className="col-span-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-3 mb-4">
                      <MoreHorizontal className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Roles Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      There are no roles created for this business yet.
                    </p>
                    <Button 
                      onClick={openCreateDialog}
                      className="bg-[#10bc69] hover:bg-[#0f9a58] text-white transition-all duration-300"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Create Your First Role
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 