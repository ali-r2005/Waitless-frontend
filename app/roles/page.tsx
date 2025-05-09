"use client"

import { Plus, Edit, Trash2, MoreHorizontal, Check, X, Users, Shield, AlertTriangle } from "lucide-react"
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
import { motion, AnimatePresence } from "framer-motion"
import { Search, Loader2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Swal from "sweetalert2"

// Role Form Component
interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: { name: string; business_id: number }) => Promise<void>;
  isLoading: boolean;
  businessId: number;
}

function RoleForm({ initialData, onSubmit, isLoading, businessId }: RoleFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Role name is required");
      return;
    }

    try {
    await onSubmit({ 
      name, 
      business_id: businessId 
    });
    } catch (err: any) {
      setError(err.message || "Failed to save role");
    }
  };

  // Animation variants for form items
  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div
        custom={0}
        variants={formItemVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">Role Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter role name"
          disabled={isLoading}
          required
          className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 focus:border-[#10bc69] focus:ring-[#10bc69]"
        />
      </motion.div>

      <motion.div
        custom={1}
        variants={formItemVariants}
        initial="hidden"
        animate="visible"
        className="pt-3"
      >
      <Button 
        type="submit" 
        disabled={isLoading} 
          className="w-full bg-[#10bc69] hover:bg-[#0f9a58] text-white flex justify-center items-center h-12 rounded-lg relative"
      >
        {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : initialData ? "Update Role" : "Create Role"}
      </Button>
      </motion.div>
    </form>
  );
}

// Role Card Component
interface RoleCardProps {
  role: Role;
  onAction: (action: string, roleId: number) => void;
}

function RoleCard({ role, onAction }: RoleCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card 
      className="group relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-[#10bc69]/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border with glowing effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-[#10bc69] via-blue-500 to-[#10bc69] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-gradient" />
      <span className="absolute inset-[1px] bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-700/90 rounded-xl z-0 backdrop-blur-sm" />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold group-hover:text-[#10bc69] transition-colors duration-300 flex items-center gap-2">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-[#10bc69]/20 blur-[2px] group-hover:animate-pulse" />
              <Shield className="h-5 w-5 text-[#10bc69] relative z-10" />
            </div>
            {role.name}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onAction('edit', role.id)} className="text-blue-500 focus:text-blue-600">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onAction('delete', role.id)}
                className="text-red-500 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 flex-grow relative z-10">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            <Users className="h-4 w-4 mr-2 text-[#10bc69]" />
            Role ID: {role.id}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
            Business ID: {role.business_id}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gradient-to-r from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 relative z-10 backdrop-blur-sm">
        <div className="w-full space-y-2">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Created</span>
            <span>{new Date(role.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Updated</span>
            <span>{new Date(role.updated_at).toLocaleDateString()}</span>
          </div>
          
          {/* Action buttons avec effet de glassmorphism */}
          <div className={`flex justify-center w-full space-x-2 mt-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAction("edit", role.id)}
                    className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 dark:hover:bg-blue-500/30 transition-all duration-300 transform hover:scale-105 flex-1 backdrop-blur-sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Role</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onAction("delete", role.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-all duration-300 transform hover:scale-105 flex-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Role</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

// Animation variants for the role cards
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Animation for page elements
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

// Main Page Component
export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const router = useRouter();
  
  // This should be fetched from user context or app state
  const businessId = 1; // Example business ID, replace with actual value

  const fetchRoles = async () => {
    try {
      const data = await roleService.getRoles(businessId);
      setRoles(data);
      setFilteredRoles(data);
    } catch (err: any) {
      setError(err.message || "Failed to load roles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Filter roles based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRoles(roles);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredRoles(
        roles.filter(
          role => 
            role.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, roles]);

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
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        html: 'This action will <b>permanently delete</b> this role and cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel',
        customClass: {
          confirmButton: 'custom-confirm-btn',
          cancelButton: 'custom-cancel-btn',
          popup: 'custom-modal'
        },
        buttonsStyling: false,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        },
        backdrop: `
          rgba(0,0,0,0.4)
          url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ff4b4b' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")
        `
      });

      if (result.isConfirmed) {
        await roleService.deleteRole(roleId);
        await fetchRoles();
        setRoleToDelete(null);

        // Show success message
        await Swal.fire({
          title: 'Deleted!',
          html: 'The role has been successfully deleted.',
          icon: 'success',
          customClass: {
            confirmButton: 'custom-confirm-btn',
            popup: 'custom-modal'
          },
          buttonsStyling: false,
          timer: 2000,
          timerProgressBar: true
        });
      }
    } catch (err: any) {
      Swal.fire({
        title: 'Error!',
        html: err.message || 'Failed to delete the role. Please try again.',
        icon: 'error',
        customClass: {
          confirmButton: 'custom-confirm-btn',
          popup: 'custom-modal'
        },
        buttonsStyling: false
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
        const roleToDelete = roles.find(r => r.id === roleId);
        if (roleToDelete) {
          await handleDeleteRole(roleToDelete.id);
        }
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
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <motion.div 
          className="flex-1 space-y-6 p-6 md:p-8"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          {/* Page Header with Title and Actions */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-gray-100/60 dark:border-gray-700/60"
            variants={fadeInUp}
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#10bc69] to-blue-500 dark:from-[#10bc69] dark:to-blue-400 bg-clip-text text-transparent">
                Role Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage all your business roles from one place
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#10bc69]" />
                <Input 
                  placeholder="Search roles..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-[260px] rounded-lg border-gray-200 dark:border-gray-700 focus:border-[#10bc69] focus:ring-[#10bc69] bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm h-11"
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button 
                onClick={openCreateDialog}
                  className="cssbuttons-io-button flex items-center h-11 rounded-lg"
              >
                Add New Role
                  <div className="icon">
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 0h24v24H0z" fill="none"></path>
                      <path
                        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
              </Button>
                <AnimatePresence>
                  {isDialogOpen && (
                    <DialogContent className="sm:max-w-[500px] bg-gray-900 border-none shadow-2xl rounded-2xl overflow-hidden p-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        className="relative"
                      >
                        <button 
                          onClick={() => setIsDialogOpen(false)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-white z-20"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                        
                        <div className="bg-gray-800/80 p-6 relative z-10">
              <DialogHeader>
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1, duration: 0.4 }}
                              className="relative"
                            >
                              <DialogTitle className="text-2xl font-bold text-[#10bc69]">
                                {selectedRole ? "Edit Role" : "Create New Role"}
                              </DialogTitle>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.2, duration: 0.4 }}
                            >
                              <DialogDescription className="text-gray-400">
                  {selectedRole 
                    ? "Update the role details below"
                    : "Fill in the details below to create a new role"}
                </DialogDescription>
                            </motion.div>
              </DialogHeader>
                        </div>
                        
                        <div className="p-6 bg-gray-900 relative z-10">
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.4 }}
                          >
              <RoleForm
                initialData={selectedRole}
                onSubmit={selectedRole ? handleUpdateRole : handleCreateRole}
                isLoading={isSubmitting}
                businessId={businessId}
              />
                          </motion.div>
                        </div>
                      </motion.div>
            </DialogContent>
                  )}
                </AnimatePresence>
          </Dialog>
            </div>
          </motion.div>

          {/* Role Count Summary */}
          <motion.div 
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            <div className="flex items-center p-5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 hover:shadow-md hover:shadow-[#10bc69]/10 hover:-translate-y-1 transition-all duration-300">
              <div className="rounded-full bg-gradient-to-br from-[#10bc69]/20 to-blue-500/20 p-3 mr-4">
                <Shield className="h-6 w-6 text-[#10bc69]" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Roles</h3>
                <p className="text-2xl font-bold bg-gradient-to-r from-[#10bc69] to-blue-500 bg-clip-text text-transparent">{filteredRoles.length}</p>
              </div>
            </div>
          </motion.div>

          {/* Role Cards */}
          {isLoading ? (
            <motion.div 
              variants={fadeInUp}
              className="flex justify-center items-center h-64"
            >
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-[#10bc69] animate-spin" />
                <p className="text-gray-500 dark:text-gray-400">Loading roles...</p>
            </div>
            </motion.div>
          ) : error ? (
            <motion.div 
              variants={fadeInUp}
              className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl p-8 text-center"
            >
              <div className="inline-block p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">{error}</h3>
              <Button 
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  fetchRoles();
                }}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              >
                Try Again
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role, index) => (
                  <motion.div key={role.id} variants={cardVariants} custom={index}>
                    <RoleCard role={role} onAction={handleRoleAction} />
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  variants={fadeInUp} 
                  className="col-span-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100/60 dark:border-gray-700/60 rounded-2xl p-12 text-center"
                >
                  <div className="inline-block p-4 bg-gradient-to-br from-[#10bc69]/10 to-blue-500/10 rounded-full mb-4">
                    <Users className="h-10 w-10 text-[#10bc69]" />
                    </div>
                  {searchQuery ? (
                    <>
                      <h3 className="text-lg font-medium mb-2">No roles found</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No roles match your search query. Try a different search term.
                      </p>
                      <Button 
                        onClick={() => setSearchQuery("")}
                        className="bg-[#10bc69] hover:bg-[#0f9a58] text-white"
                      >
                        Clear Search
                      </Button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium mb-2">No roles yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Get started by creating your first role.
                    </p>
                    <Button 
                      onClick={openCreateDialog}
                        className="bg-gradient-to-br from-[#10bc69] to-blue-500 hover:from-[#0f9a58] hover:to-blue-600 text-white"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                        Add Your First Role
                    </Button>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}