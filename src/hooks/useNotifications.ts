import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  is_urgent: boolean;
  created_by: string;
  is_read?: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    if (!user?.boxId || !user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      // Fetch notifications
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('company_notifications')
        .select('*')
        .eq('company_id', user.boxId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (notificationsError) throw notificationsError;

      // Fetch read status for current user
      const { data: readsData, error: readsError } = await supabase
        .from('notification_reads')
        .select('notification_id')
        .eq('user_id', user.id);

      if (readsError) throw readsError;

      const readNotificationIds = new Set(readsData?.map(r => r.notification_id) || []);

      // Combine data
      const notificationsWithReadStatus = (notificationsData || []).map(notification => ({
        ...notification,
        is_read: readNotificationIds.has(notification.id)
      }));

      setNotifications(notificationsWithReadStatus);
      setUnreadCount(notificationsWithReadStatus.filter(n => !n.is_read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('notification_reads')
        .insert({
          notification_id: notificationId,
          user_id: user.id
        });

      if (error && error.code !== '23505') { // Ignore duplicate key errors
        throw error;
      }

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const unreadNotifications = notifications.filter(n => !n.is_read);
      
      const inserts = unreadNotifications.map(n => ({
        notification_id: n.id,
        user_id: user.id
      }));

      if (inserts.length > 0) {
        const { error } = await supabase
          .from('notification_reads')
          .insert(inserts);

        if (error) throw error;

        // Update local state
        setNotifications(prev =>
          prev.map(n => ({ ...n, is_read: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user?.boxId) return;

    try {
      const { error } = await supabase
        .from('company_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('company_id', user.boxId);

      if (error) throw error;

      // Update local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === notificationId);
        return notification && !notification.is_read ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Set up realtime subscription
    if (!user?.boxId || !user?.id) return;

    const notificationsChannel = supabase
      .channel('company_notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'company_notifications',
          filter: `company_id=eq.${user.boxId}`
        },
        (payload) => {
          console.log('Notification change:', payload);
          fetchNotifications();
        }
      )
      .subscribe();

    const readsChannel = supabase
      .channel('notification_reads_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_reads',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification read change:', payload);
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(readsChannel);
    };
  }, [user?.boxId, user?.id]);

  return {
    notifications,
    unreadNotifications: notifications.filter(n => !n.is_read),
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications
  };
};
