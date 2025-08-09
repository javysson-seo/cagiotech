
import React, { useState } from 'react';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { BookingCalendar } from '@/components/bookings/BookingCalendar';
import { UpcomingBookings } from '@/components/bookings/UpcomingBookings';
import { BookingHistory } from '@/components/bookings/BookingHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/Footer';

export const BookingManagement: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Minhas Reservas</h1>
              <p className="text-muted-foreground mt-2">
                Gerencie suas reservas de aulas
              </p>
            </div>

            <Tabs defaultValue="calendar" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendário de Aulas</CardTitle>
                    <CardDescription>
                      Selecione uma data para ver as aulas disponíveis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookingCalendar />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximas Reservas</CardTitle>
                    <CardDescription>
                      Suas aulas agendadas para os próximos dias
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UpcomingBookings />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Reservas</CardTitle>
                    <CardDescription>
                      Todas as suas reservas passadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BookingHistory />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
