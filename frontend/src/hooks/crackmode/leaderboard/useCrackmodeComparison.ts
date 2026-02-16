import { useQuery, useQueries } from '@tanstack/react-query';
import { CrackmodeService } from '@/client';
import { toNativePromise } from '@/utils/toNativePromisse';
import { useCrackModeProfile } from './useCrackmodeProfile';

/**
 * 🎮 FIFA SYSTEM: Hook for getting division-specific leaderboard
 * Rankings based on performance_score (weekly velocity)
 */
export function useDivisionLeaderboard(division?: string) {
  const { data: myProfile } = useCrackModeProfile();
  const targetDivision = division ?? myProfile?.division;

  return useQuery({
    queryKey: ['crackmode', 'division', targetDivision],
    queryFn: () =>
      toNativePromise(
        CrackmodeService.getLeaderboardApiV1CrackmodeLeaderboardGet({
          division: targetDivision,
          limit: 100,
          offset: 0,
        })
      ),
    enabled: !!targetDivision,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * 🎮 FIFA SYSTEM: Hook for getting promotion/relegation status
 * Based on division_rank (performance_score ranking within division)
 */
export function usePromotionStatus() {
  const { data: myProfile } = useCrackModeProfile();
  const { data: divisionData } = useDivisionLeaderboard();

  if (!myProfile || !divisionData?.profiles) {
    return null;
  }

  const totalInDivision = divisionData.profiles.length;
  const myDivisionRank = myProfile.division_rank;

  // Top 20% = promotion zone
  const promotionThreshold = Math.ceil(totalInDivision * 0.2);
  // Bottom 20% = relegation zone
  const relegationThreshold = Math.floor(totalInDivision * 0.8);

  const status = (() => {
    if (myDivisionRank <= promotionThreshold) return 'promotion';
    if (myDivisionRank >= relegationThreshold) return 'relegation';
    return 'safe';
  })() as 'promotion' | 'relegation' | 'safe';

  return {
    status,
    divisionRank: myDivisionRank,
    totalInDivision,
    promotionThreshold,
    relegationThreshold,
    ranksToPromotion: status === 'promotion' ? 0 : Math.max(0, promotionThreshold - myDivisionRank),
    ranksFromRelegation: status === 'relegation' ? 0 : Math.max(0, myDivisionRank - relegationThreshold),
  };
}

/**
 * 🎮 FIFA SYSTEM: Hook for getting division statistics
 */
export function useDivisionStats(division?: string) {
  const { data: divisionData } = useDivisionLeaderboard(division);

  if (!divisionData?.profiles || divisionData.profiles.length === 0) {
    return null;
  }

  const profiles = divisionData.profiles;

  const avgScore = profiles.reduce((sum, p) => sum + p.performance_score, 0) / profiles.length;
  const avgStreak = profiles.reduce((sum, p) => sum + p.current_streak, 0) / profiles.length;
  const avgWeeklySolves = profiles.reduce((sum, p) => sum + p.weekly_solves, 0) / profiles.length;

  const topPlayer = profiles[0];
  const medianPlayer = profiles[Math.floor(profiles.length / 2)];

  return {
    totalPlayers: profiles.length,
    averages: {
      performanceScore: Math.round(avgScore),
      streak: Math.round(avgStreak),
      weeklySolves: Math.round(avgWeeklySolves),
    },
    topPlayer: {
      username: topPlayer?.leetcode_username,
      performanceScore: topPlayer?.performance_score,
      divisionRank: topPlayer?.division_rank,
    },
    medianPlayer: {
      username: medianPlayer?.leetcode_username,
      performanceScore: medianPlayer?.performance_score,
      divisionRank: medianPlayer?.division_rank,
    },
  };
}

/**
 * 🎮 FIFA SYSTEM: Get all division summaries (for division cards)
 * Fixed: Using useQueries instead of map with useQuery
 */
export function useDivisionSummaries() {
  const divisions = ['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
  
  const queries = useQueries({
    queries: divisions.map(division => ({
      queryKey: ['crackmode', 'division-summary', division],
      queryFn: () =>
        toNativePromise(
          CrackmodeService.getLeaderboardApiV1CrackmodeLeaderboardGet({
            division: division,
            limit: 1, // Only need count and top player
            offset: 0,
          })
        ),
      staleTime: 1000 * 60 * 5,
    })),
  });

  return {
    divisions: divisions.map((division, i) => ({
      name: division,
      data: queries[i].data,
      isLoading: queries[i].isLoading,
    })),
    isLoading: queries.some(q => q.isLoading),
  };
}