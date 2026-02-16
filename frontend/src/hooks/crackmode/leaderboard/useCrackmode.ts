import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CrackmodeService, type CrackModeProfilePublic, type CrackModeSetupRequest, type LeaderboardResponse } from '@/client';
import { toNativePromise } from '@/utils/toNativePromisse';
import { getApiErrorMessage } from '@/utils/errorUtils';
import useToaster from '../../public/useToaster';

/**
 * Hook for setting up a CrackMode profile (one-time setup)
 */
export function useSetupCrackModeProfile() {
  const queryClient = useQueryClient();
  const toast = useToaster();

  return useMutation<CrackModeProfilePublic, Error, CrackModeSetupRequest>({
    mutationFn: (data) => 
      toNativePromise(CrackmodeService.setupCrackmodeProfileApiV1CrackmodeSetupPost({ requestBody: data })),
    onSuccess: (profile) => {
      toast({
        id: 'setup-crackmode-success',
        title: 'CrackMode Profile Created!',
        description: `Welcome to ${profile.division} division, ${profile.leetcode_username}!`,
        status: 'success',
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['crackmode', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['crackmode', 'leaderboard'] });
    },
    onError: (error: unknown) => {
      toast({
        id: 'setup-crackmode-error',
        title: 'Failed to setup CrackMode profile',
        description: getApiErrorMessage(error),
        status: 'error',
      });
    },
  });
}

/**
 * Hook for syncing LeetCode stats manually
 */
export function useSyncLeetCodeStats() {
  const queryClient = useQueryClient();
  const toast = useToaster();

  return useMutation<CrackModeProfilePublic, Error, void>({
    mutationFn: () => 
      toNativePromise(CrackmodeService.syncMyLeetcodeStatsApiV1CrackmodeSyncPost()),
    onSuccess: (profile) => {
      toast({
        id: 'sync-stats-success',
        title: 'Stats Synced!',
        description: `Rank: #${profile.rank} | Score: ${profile.total_score} pts`,
        status: 'success',
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['crackmode', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['crackmode', 'leaderboard'] });
    },
    onError: (error: unknown) => {
      toast({
        id: 'sync-stats-error',
        title: 'Failed to sync stats',
        description: getApiErrorMessage(error),
        status: 'error',
      });
    },
  });
}

/**
 * Hook for fetching leaderboard data
 */
interface LeaderboardFilters {
  division?: string | null;
  season?: string | null;
  limit?: number;
  offset?: number;
}

export function useLeaderboard(filters: LeaderboardFilters = {}) {
  return useQuery<LeaderboardResponse, Error>({
    queryKey: ['crackmode', 'leaderboard', filters],
    queryFn: () => 
      toNativePromise(
        CrackmodeService.getLeaderboardApiV1CrackmodeLeaderboardGet({
          division: filters.division,
          season: filters.season,
          limit: filters.limit ?? 100,
          offset: filters.offset ?? 0,
        })
      ),
    staleTime: 1000 * 60 * 5, // 5 minutes - leaderboard doesn't change super frequently
  });
}

/**
 * Hook for fetching leaderboard by division
 */
export function useLeaderboardByDivision(division: string, season?: string | null) {
  return useLeaderboard({
    division,
    season,
    limit: 100,
    offset: 0,
  });
}

/**
 * Hook for fetching top leaderboard (all divisions)
 */
export function useTopLeaderboard(limit: number = 50) {
  return useLeaderboard({
    limit,
    offset: 0,
  });
}

/**
 * Main CrackMode hook - combines all functionality
 */
export function useCrackMode() {
  const setupProfile = useSetupCrackModeProfile();
  const syncStats = useSyncLeetCodeStats();

  return {
    // Mutations
    setupProfile,
    syncStats,

    // Helper methods
    isSettingUp: setupProfile.isPending,
    isSyncing: syncStats.isPending,
  };
}