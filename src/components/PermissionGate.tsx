import React from 'react';
import { usePermissions } from '@/hooks/usePermissions';

interface PermissionGateProps {
  children: React.ReactNode;
  permissions?: string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

/**
 * PermissionGate - Component to conditionally render content based on user permissions
 * 
 * @param permissions - Array of permission keys required
 * @param requireAll - If true, user must have ALL permissions. If false, user needs ANY permission. Default: false
 * @param fallback - Optional content to show when user doesn't have permission
 * 
 * @example
 * <PermissionGate permissions={['manage_athletes']}>
 *   <Button>Add Athlete</Button>
 * </PermissionGate>
 * 
 * @example
 * <PermissionGate permissions={['manage_athletes', 'view_reports']} requireAll>
 *   <AdminPanel />
 * </PermissionGate>
 */
export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  permissions = [],
  requireAll = false,
  fallback = null
}) => {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  // If no permissions specified, render children
  if (permissions.length === 0) {
    return <>{children}</>;
  }

  const hasPermission = requireAll 
    ? hasAllPermissions(permissions)
    : hasAnyPermission(permissions);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
