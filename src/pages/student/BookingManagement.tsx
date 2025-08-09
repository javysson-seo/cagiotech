
import React, { useState } from 'react';
import { ResponsiveStudentSidebar } from '@/components/student/ResponsiveStudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { BookingCalendar } from '@/components/bookings/BookingCalendar';
import { UpcomingBookings } from '@/components/bookings/UpcomingBookings';
import { BookingHistory } from '@/components/bookings/BookingHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Footer } from '@/components/Footer';

export const BookingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('calendar');

  return (
    <div className="flex min-h-screen bg-background">
      <ResponsiveStudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Reservas</h1>
              <p className="text-muted-foreground">
                Gerencie suas reservas de aulas e treinos
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="upcoming">Próximas</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="calendar">
                <BookingCalendar />
              </TabsContent>

              <TabsContent value="upcoming">
                <UpcomingBookings />
              </TabsContent>

              <TabsContent value="history">
                <BookingHistory />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
