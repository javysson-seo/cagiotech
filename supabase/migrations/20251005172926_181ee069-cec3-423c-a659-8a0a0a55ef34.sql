-- Enable realtime for gamification tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.athlete_levels;
ALTER PUBLICATION supabase_realtime ADD TABLE public.athlete_points;
ALTER PUBLICATION supabase_realtime ADD TABLE public.athlete_badges;

-- Set replica identity for realtime updates
ALTER TABLE public.athlete_levels REPLICA IDENTITY FULL;
ALTER TABLE public.athlete_points REPLICA IDENTITY FULL;
ALTER TABLE public.athlete_badges REPLICA IDENTITY FULL;