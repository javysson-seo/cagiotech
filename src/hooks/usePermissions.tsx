
import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    
    // Cagio admin has all permissions
    if (user.permissions.includes('all')) return true;
    
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccessRoute = (requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return hasAnyPermission(requiredPermissions);
  };

  // Specific permission checks for BOX features
  const canManageAthletes = (): boolean => {
    return hasPermission('manage_athletes');
  };

  const canManageTrainers = (): boolean => {
    return hasPermission('manage_trainers');
  };

  const canManageClasses = (): boolean => {
    return hasPermission('manage_classes');
  };

  const canViewReports = (): boolean => {
    return hasPermission('view_reports');
  };

  const canManageFinances = (): boolean => {
    return hasPermission('manage_finances');
  };

  const canManageSettings = (): boolean => {
    return hasPermission('manage_settings');
  };

  const canManageBookings = (): boolean => {
    return hasPermission('manage_bookings');
  };

  const canViewAthleteDetails = (): boolean => {
    return hasPermission('view_athletes');
  };

  const canCreateClasses = (): boolean => {
    return hasPermission('create_classes') || hasPermission('manage_classes');
  };

  const canDeleteData = (): boolean => {
    return hasPermission('delete_data');
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    canManageAthletes,
    canManageTrainers,
    canManageClasses,
    canViewReports,
    canManageFinances,
    canManageSettings,
    canManageBookings,
    canViewAthleteDetails,
    canCreateClasses,
    canDeleteData,
    permissions: user?.permissions || []
  };
};
