-- Create company_messages table for internal chat
CREATE TABLE public.company_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  recipient_id UUID NULL, -- NULL means message to everyone
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_messages ENABLE ROW LEVEL SECURITY;

-- Company members can view messages in their company
CREATE POLICY "Company members can view messages"
ON public.company_messages
FOR SELECT
USING (
  can_access_company_data(company_id)
  AND (recipient_id IS NULL OR recipient_id = auth.uid() OR sender_id = auth.uid())
);

-- Company members can send messages
CREATE POLICY "Company members can send messages"
ON public.company_messages
FOR INSERT
WITH CHECK (
  can_access_company_data(company_id)
  AND sender_id = auth.uid()
);

-- Users can mark their own messages as read
CREATE POLICY "Users can update their messages"
ON public.company_messages
FOR UPDATE
USING (recipient_id = auth.uid() OR sender_id = auth.uid());

-- Create platform_suggestions table
CREATE TABLE public.platform_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, implemented
  admin_notes TEXT,
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_suggestions ENABLE ROW LEVEL SECURITY;

-- Box owners can create suggestions
CREATE POLICY "Box owners can create suggestions"
ON public.platform_suggestions
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'box_owner', company_id)
  AND created_by = auth.uid()
);

-- Box owners can view all approved suggestions and their own
CREATE POLICY "Box owners can view suggestions"
ON public.platform_suggestions
FOR SELECT
USING (
  has_role(auth.uid(), 'box_owner', company_id)
  OR status = 'approved'
  OR has_role(auth.uid(), 'cagio_admin', NULL)
);

-- Only admins can update suggestions
CREATE POLICY "Admins can manage suggestions"
ON public.platform_suggestions
FOR ALL
USING (has_role(auth.uid(), 'cagio_admin', NULL))
WITH CHECK (has_role(auth.uid(), 'cagio_admin', NULL));

-- Create suggestion_votes table
CREATE TABLE public.suggestion_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  suggestion_id UUID NOT NULL REFERENCES public.platform_suggestions(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  vote_type TEXT NOT NULL, -- positive, negative
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(suggestion_id, user_id)
);

-- Enable RLS
ALTER TABLE public.suggestion_votes ENABLE ROW LEVEL SECURITY;

-- Box owners can vote on approved suggestions
CREATE POLICY "Box owners can vote"
ON public.suggestion_votes
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'box_owner', company_id)
  AND user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.platform_suggestions
    WHERE id = suggestion_id AND status = 'approved'
  )
);

-- Users can view all votes
CREATE POLICY "Users can view votes"
ON public.suggestion_votes
FOR SELECT
USING (
  has_role(auth.uid(), 'box_owner', company_id)
  OR has_role(auth.uid(), 'cagio_admin', NULL)
);

-- Users can delete their own votes
CREATE POLICY "Users can delete their votes"
ON public.suggestion_votes
FOR DELETE
USING (user_id = auth.uid());

-- Create company_notifications table
CREATE TABLE public.company_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_urgent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_notifications ENABLE ROW LEVEL SECURITY;

-- Company members can view notifications
CREATE POLICY "Company members can view notifications"
ON public.company_notifications
FOR SELECT
USING (can_access_company_data(company_id));

-- Box owners and staff can create notifications
CREATE POLICY "Authorized users can create notifications"
ON public.company_notifications
FOR INSERT
WITH CHECK (
  (has_role(auth.uid(), 'box_owner', company_id) OR has_role(auth.uid(), 'staff_member', company_id))
  AND created_by = auth.uid()
);

-- Create updated_at triggers
CREATE TRIGGER update_company_messages_updated_at
BEFORE UPDATE ON public.company_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_platform_suggestions_updated_at
BEFORE UPDATE ON public.platform_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_company_messages_company_id ON public.company_messages(company_id);
CREATE INDEX idx_company_messages_recipient_id ON public.company_messages(recipient_id);
CREATE INDEX idx_company_messages_sender_id ON public.company_messages(sender_id);
CREATE INDEX idx_platform_suggestions_company_id ON public.platform_suggestions(company_id);
CREATE INDEX idx_platform_suggestions_status ON public.platform_suggestions(status);
CREATE INDEX idx_suggestion_votes_suggestion_id ON public.suggestion_votes(suggestion_id);
CREATE INDEX idx_company_notifications_company_id ON public.company_notifications(company_id);