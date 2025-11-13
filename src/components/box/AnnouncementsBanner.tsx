import React, { useState, useEffect } from 'react';
import { useCompanyAnnouncements } from '@/hooks/useCompanyAnnouncements';
import { useCompany } from '@/contexts/CompanyContext';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const AnnouncementsBanner: React.FC = () => {
  const { currentCompany } = useCompany();
  const { announcements, isLoading } = useCompanyAnnouncements(currentCompany?.id || '');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % announcements.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [announcements.length]);

  if (isLoading || announcements.length === 0) {
    return null;
  }

  // Filter announcements by date range
  const now = new Date();
  const activeAnnouncements = announcements.filter(announcement => {
    const startDate = announcement.start_date ? new Date(announcement.start_date) : null;
    const endDate = announcement.end_date ? new Date(announcement.end_date) : null;
    
    if (startDate && startDate > now) return false;
    if (endDate && endDate < now) return false;
    
    return true;
  });

  if (activeAnnouncements.length === 0) {
    return null;
  }

  const currentAnnouncement = activeAnnouncements[currentIndex % activeAnnouncements.length];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + activeAnnouncements.length) % activeAnnouncements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
  };

  const handleAnnouncementClick = () => {
    if (currentAnnouncement.link_url) {
      window.open(currentAnnouncement.link_url, '_blank');
    }
  };

  return (
    <div 
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: currentAnnouncement.background_color,
        color: currentAnnouncement.text_color,
      }}
    >
      <div className="px-4 py-3 flex items-center justify-between gap-2 min-h-[80px]">
        {activeAnnouncements.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="h-6 w-6 shrink-0 hover:bg-white/10"
            style={{ color: currentAnnouncement.text_color }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        <div 
          className={`flex-1 text-center ${currentAnnouncement.link_url ? 'cursor-pointer' : ''}`}
          onClick={handleAnnouncementClick}
        >
          {currentAnnouncement.image_url && (
            <div className="mb-2 flex justify-center">
              <img 
                src={currentAnnouncement.image_url} 
                alt={currentAnnouncement.title}
                className="max-h-16 w-auto object-contain"
              />
            </div>
          )}
          <h4 className="font-semibold text-sm mb-1">{currentAnnouncement.title}</h4>
          {currentAnnouncement.content && (
            <p className="text-xs opacity-90 line-clamp-2">{currentAnnouncement.content}</p>
          )}
          {currentAnnouncement.link_url && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <span className="text-xs underline">Saiba mais</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          )}
        </div>

        {activeAnnouncements.length > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="h-6 w-6 shrink-0 hover:bg-white/10"
            style={{ color: currentAnnouncement.text_color }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {activeAnnouncements.length > 1 && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1.5">
          {activeAnnouncements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="h-1.5 w-1.5 rounded-full transition-all"
              style={{
                backgroundColor: index === currentIndex % activeAnnouncements.length 
                  ? currentAnnouncement.text_color 
                  : `${currentAnnouncement.text_color}40`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
