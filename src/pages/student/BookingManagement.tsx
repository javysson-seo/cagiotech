import React, { useState } from 'react';
import { ResponsiveStudentSidebar } from '@/components/student/ResponsiveStudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { Footer } from '@/components/Footer';
import { useCurrentAthlete } from '@/hooks/useCurrentAthlete';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, X } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const BookingManagement: React.FC = () => {
  const { athlete, loading: athleteLoading } = useCurrentAthlete();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('upcoming');

  const { data: bookings, isLoading: bookingsLoading } = useQuery({
    queryKey: ['athlete-bookings', athlete?.id],
    queryFn: async () => {
      if (!athlete?.id) return [];
      const { data, error } = await supabase
        .from('class_bookings')
        .select(`
          *,
          classes (
            id,
            title,
            date,
            start_time,
            end_time,
            max_capacity,
            current_bookings,
            modalities (name),
            rooms (name)
          )
        `)
        .eq('athlete_id', athlete.id)
        .order('booking_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!athlete?.id,
  });

  const cancelBooking = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('class_bookings')
        .update({ 
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: 'Cancelado pelo atleta'
        })
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-bookings'] });
      toast.success('Reserva cancelada com sucesso');
    },
    onError: () => {
      toast.error('Erro ao cancelar reserva');
    },
  });

  const isLoading = athleteLoading || bookingsLoading;

  const upcomingBookings = bookings?.filter(b => 
    b.status === 'confirmed' && 
    b.classes && 
    new Date(b.classes.date) >= new Date()
  ) || [];

  const pastBookings = bookings?.filter(b => 
    b.classes && 
    new Date(b.classes.date) < new Date()
  ) || [];

  const renderBookingCard = (booking: any, isPast: boolean) => (
    <Card key={booking.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            {booking.classes?.title || 'Aula'}
          </span>
          {booking.status === 'confirmed' ? (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Confirmado</span>
          ) : booking.status === 'cancelled' ? (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Cancelado</span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{booking.classes?.date && format(new Date(booking.classes.date), "EEEE, dd 'de' MMMM", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{booking.classes?.start_time} - {booking.classes?.end_time}</span>
          </div>
          {booking.classes?.modalities?.name && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{booking.classes.modalities.name}</span>
            </div>
          )}
          {booking.classes?.rooms?.name && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>Sala: {booking.classes.rooms.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span>{booking.classes?.current_bookings || 0}/{booking.classes?.max_capacity} vagas</span>
          </div>
        </div>

        {!isPast && booking.status === 'confirmed' && (
          <Button 
            onClick={() => cancelBooking.mutate(booking.id)}
            variant="destructive"
            size="sm"
            className="w-full"
            disabled={cancelBooking.isPending}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar Reserva
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <ResponsiveStudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Minhas Reservas</h1>
              <p className="text-muted-foreground">Gerencie suas reservas de aulas</p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-24 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !athlete ? (
              <Alert>
                <AlertDescription>
                  Não foi possível carregar seus dados. Por favor, tente novamente.
                </AlertDescription>
              </Alert>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                  <TabsTrigger value="past">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="mt-6">
                  {upcomingBookings.length > 0 ? (
                    <div className="grid gap-4">
                      {upcomingBookings.map(booking => renderBookingCard(booking, false))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
                        <p className="text-lg font-medium">Nenhuma reserva futura</p>
                        <p className="text-sm text-muted-foreground">Reserve uma aula para começar!</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-6">
                  {pastBookings.length > 0 ? (
                    <div className="grid gap-4">
                      {pastBookings.map(booking => renderBookingCard(booking, true))}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="w-16 h-16 text-muted-foreground opacity-50 mb-4" />
                        <p className="text-lg font-medium">Nenhum histórico</p>
                        <p className="text-sm text-muted-foreground">Suas reservas passadas aparecerão aqui</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
