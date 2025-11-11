-- Create staff_time_off table for vacation/leave requests
CREATE TABLE public.staff_time_off (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  staff_id UUID NOT NULL,
  request_type TEXT NOT NULL, -- 'vacation', 'sick_leave', 'personal', etc.
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  reason TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create staff_events table for employee events
CREATE TABLE public.staff_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_type TEXT NOT NULL, -- 'meeting', 'training', 'celebration', 'reminder'
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  staff_ids UUID[], -- Array of staff IDs invited
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hr_activities table for recent activities log
CREATE TABLE public.hr_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  activity_type TEXT NOT NULL, -- 'staff_added', 'time_off_request', 'event_created', 'payroll_generated', etc.
  title TEXT NOT NULL,
  description TEXT,
  performed_by UUID NOT NULL,
  performed_by_name TEXT,
  reference_id UUID, -- ID of related record (staff_id, event_id, etc.)
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.staff_time_off ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for staff_time_off
CREATE POLICY "Company members can view time off requests"
ON public.staff_time_off
FOR SELECT
USING (can_access_company_data(company_id));

CREATE POLICY "Company members can create time off requests"
ON public.staff_time_off
FOR INSERT
WITH CHECK (can_access_company_data(company_id));

CREATE POLICY "Company members can update time off requests"
ON public.staff_time_off
FOR UPDATE
USING (can_access_company_data(company_id));

CREATE POLICY "Company members can delete time off requests"
ON public.staff_time_off
FOR DELETE
USING (can_access_company_data(company_id));

-- RLS Policies for staff_events
CREATE POLICY "Company members can view events"
ON public.staff_events
FOR SELECT
USING (can_access_company_data(company_id));

CREATE POLICY "Company members can create events"
ON public.staff_events
FOR INSERT
WITH CHECK (can_access_company_data(company_id));

CREATE POLICY "Company members can update events"
ON public.staff_events
FOR UPDATE
USING (can_access_company_data(company_id));

CREATE POLICY "Company members can delete events"
ON public.staff_events
FOR DELETE
USING (can_access_company_data(company_id));

-- RLS Policies for hr_activities
CREATE POLICY "Company members can view HR activities"
ON public.hr_activities
FOR SELECT
USING (can_access_company_data(company_id));

CREATE POLICY "Company members can insert HR activities"
ON public.hr_activities
FOR INSERT
WITH CHECK (can_access_company_data(company_id));

-- Create indexes for better performance
CREATE INDEX idx_staff_time_off_company ON public.staff_time_off(company_id);
CREATE INDEX idx_staff_time_off_staff ON public.staff_time_off(staff_id);
CREATE INDEX idx_staff_time_off_status ON public.staff_time_off(status);
CREATE INDEX idx_staff_events_company ON public.staff_events(company_id);
CREATE INDEX idx_staff_events_start_date ON public.staff_events(start_date);
CREATE INDEX idx_hr_activities_company ON public.hr_activities(company_id);
CREATE INDEX idx_hr_activities_created_at ON public.hr_activities(created_at DESC);