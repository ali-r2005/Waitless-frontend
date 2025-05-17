import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

/**
 * Custom hook for role-based authorization
 * @param requiredRoles - Array of roles that are authorized to access the component
 * @param redirectPath - Path to redirect to if user is not authorized (default: '/dashboard')
 * @returns Object containing authorization state and user information
 */
export function useAuthorization(requiredRoles: string[], redirectPath: string = '/dashboard') {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Wait for authentication check to complete
    if (!isLoading) {
      setCheckingAuth(true);
      
      // Check if user is authenticated
      if (!isAuthenticated || !user) {
        router.push('/auth/login');
        setIsAuthorized(false);
        setCheckingAuth(false);
        return;
      }
      
      // Check if user has the required role
      const userRole = user.role?.toLowerCase();
      const hasRequiredRole = requiredRoles.some(role => 
        userRole === role.toLowerCase()
      );
      
      if (!hasRequiredRole) {
        console.warn(`User does not have the required role. Required: ${requiredRoles.join(', ')}, User role: ${userRole}`);
        router.push(redirectPath);
        setIsAuthorized(false);
      } else {
        setIsAuthorized(true);
      }
      
      setCheckingAuth(false);
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router, redirectPath]);

  return {
    isAuthorized,
    isLoading: isLoading || checkingAuth,
    user
  };
}
