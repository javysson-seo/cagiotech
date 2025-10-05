import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ClassBooking {
  id: string;
  class_id: string;
  status: 'confirmed' | 'cancelled' | 'waiting' | 'completed';
  booking_date: string;
  classes: {
    id: string;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    current_bookings: number;
    max_capacity: number;
    modalities: {
      name: string;
      color: string;
    } | null;
    rooms: {
      name: string;
    } | null;
    trainers: {
      name: string;
    } | null;
  } | null;
}

export const useAthleteClasses = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<ClassBooking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!user?.email) return;

    try {
      // Get athlete ID
      const { data: athlete } = await supabase
        .from('athletes')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (!athlete) {
        setLoading(false);
        return;
      }

      // Get bookings with class details
      const { data, error } = await supabase
        .from('class_bookings')
        .select(`
          id,
          class_id,
          status,
          booking_date,
          classes (
            id,
            title,
            date,
            start_time,
            end_time,
            current_bookings,
            max_capacity,
            modalities (name, color),
            rooms (name),
            trainers (name)
          )
        `)
        .eq('athlete_id', athlete.id)
        .gte('classes.date', new Date().toISOString().split('T')[0])
        .order('classes(date)', { ascending: true })
        .order('classes(start_time)', { ascending: true })
        .limit(10);

      if (error) throw error;

      setBookings(data as ClassBooking[]);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user?.email]);

  return { bookings, loading, refetch: fetchBookings };
};
