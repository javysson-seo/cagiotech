import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface AthleteLevel {
  athlete_id: string;
  company_id: string;
  current_level: string;
  total_points: number;
  best_streak: number;
  current_streak: number;
  last_check_in_date: string | null;
  total_classes: number;
  total_referrals: number;
  updated_at: string;
}

export interface BadgeDefinition {
  id: string;
  name: string;
  description: string | null;
  icon: string;
  category: string;
  requirement_type: string;
  requirement_value: number;
  color: string;
}

export interface AthleteBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badge_definitions: BadgeDefinition;
}

export interface RecentPoints {
  id: string;
  points: number;
  reason: string;
  notes: string | null;
  created_at: string;
}

export const useGamification = (athleteId?: string) => {
  const { user } = useAuth();

  const { data: athleteLevel, isLoading: levelLoading, refetch: refetchLevel } = useQuery({
    queryKey: ['athlete-level', athleteId],
    queryFn: async () => {
      if (!athleteId) return null;

      const { data, error } = await supabase
        .from('athlete_levels')
        .select('*')
        .eq('athlete_id', athleteId)
        .maybeSingle();

      if (error) throw error;
      return data as AthleteLevel | null;
    },
    enabled: !!athleteId,
  });

  const { data: badges, isLoading: badgesLoading, refetch: refetchBadges } = useQuery({
    queryKey: ['athlete-badges', athleteId],
    queryFn: async () => {
      if (!athleteId) return [];

      const { data, error } = await supabase
        .from('athlete_badges')
        .select(`
          *,
          badge_definitions (*)
        `)
        .eq('athlete_id', athleteId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data as AthleteBadge[];
    },
    enabled: !!athleteId,
  });

  const { data: recentPoints, isLoading: pointsLoading, refetch: refetchPoints } = useQuery({
    queryKey: ['athlete-recent-points', athleteId],
    queryFn: async () => {
      if (!athleteId) return [];

      const { data, error } = await supabase
        .from('athlete_points')
        .select('id, points, reason, notes, created_at')
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as RecentPoints[];
    },
    enabled: !!athleteId,
  });

  // Calcula próximo nível
  const getNextLevel = (currentLevel: string, currentPoints: number) => {
    const levels = [
      { name: 'Novato', minPoints: 0, maxPoints: 99 },
      { name: 'Intermediário', minPoints: 100, maxPoints: 499 },
      { name: 'Avançado', minPoints: 500, maxPoints: 999 },
      { name: 'Elite', minPoints: 1000, maxPoints: 2499 },
      { name: 'Lendário', minPoints: 2500, maxPoints: Infinity },
    ];

    const currentLevelData = levels.find(l => l.name === currentLevel);
    if (!currentLevelData) return null;

    const currentIndex = levels.indexOf(currentLevelData);
    if (currentIndex === levels.length - 1) return null; // Já está no máximo

    const nextLevel = levels[currentIndex + 1];
    const pointsToNext = nextLevel.minPoints - currentPoints;

    return {
      name: nextLevel.name,
      pointsNeeded: pointsToNext,
      progress: ((currentPoints - currentLevelData.minPoints) / (nextLevel.minPoints - currentLevelData.minPoints)) * 100,
    };
  };

  const refetchAll = () => {
    refetchLevel();
    refetchBadges();
    refetchPoints();
  };

  return {
    athleteLevel,
    badges,
    recentPoints,
    isLoading: levelLoading || badgesLoading || pointsLoading,
    getNextLevel,
    refetchAll,
  };
};

export const useGamificationSettings = (companyId?: string) => {
  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ['gamification-settings', companyId],
    queryFn: async () => {
      if (!companyId) return null;

      const { data, error } = await supabase
        .from('gamification_settings')
        .select('*')
        .eq('company_id', companyId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!companyId,
  });

  const saveSettings = async (newSettings: any) => {
    if (!companyId) throw new Error('Company ID is required');

    const { error } = await supabase
      .from('gamification_settings')
      .upsert({
        company_id: companyId,
        ...newSettings,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;
    await refetch();
  };

  return {
    settings,
    isLoading,
    saveSettings,
    refetch,
  };
};
