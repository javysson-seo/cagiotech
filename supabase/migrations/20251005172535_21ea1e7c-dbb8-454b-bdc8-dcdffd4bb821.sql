-- Enable realtime for company_notifications table
ALTER TABLE company_notifications REPLICA IDENTITY FULL;

-- Add company_notifications to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE company_notifications;