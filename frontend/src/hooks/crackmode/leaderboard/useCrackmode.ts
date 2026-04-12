import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CrackmodeService,
  type CrackModeProfilePublic,
  type CrackModeSetupRequest,
  type LeaderboardResponse,
} from '@/client';
import { toNativePromise } from '@/utils/toNativePromisse';
import { getApiErrorMessage } from '@/utils/errorUtils';
import useToaster from '../../public/useToaster';

// ─── Silent background sync ────────────────────────────────────────────────
//
// Call this once in any layout/page where fresh stats matter (e.g. leaderboard).
// It will fire a sync automatically, but only if:
//   1. The user has a CrackMode profile (hasProfile = true)
//   2. The backend cooldown hasn't been hit yet (backend returns cached data if so)
//
// The user sees nothing — no toast, no spinner. Stats just get fresher over time.
//
export function useAutoSync(hasProfile: boolean) {
  const queryClient = useQueryClient();

  const { mutate: silentSync } = useMutation<CrackModeProfilePublic, Error, void>({
    mutationFn: () =>
      toNativePromise(CrackmodeService.syncMyLeetcodeStatsApiV1CrackmodeSyncPost({})),
    onSuccess: () => {
      // Quietly refresh leaderboard + profile data in the background
      queryClient.invalidateQueries({ queryKey: ['crackmode', 'profile'] });
      queryClient.invalidateQueries({ queryKey: ['crackmode', 'leaderboard'] });
    },
    // Silently swallow errors — this is best-effort, never block the UI
    onError: () => {},
  });

  useEffect(() => {
    if (!hasProfile) return;
    silentSync();
  }, [hasProfile, silentSync]); // fires once per mount — backend cooldown prevents API spam
}

// ─── Manual sync (keeps the button for power users) ────────────────────────
export function useSyncLeetCodeStats() {
  const queryClient = useQueryClient();
  const toast = useToaster();

  return useMutation<CrackModeProfilePublic, Error, void>({
    mutationFn: () =>
      // force=true bypasses the 30-min cooldown so the button always works
      toNativePromise(
        CrackmodeService.syncMyLeetcodeStatsApiV1CrackmodeSyncPost({ force: true })
      ),
    onSuccess: (profile) => {
      toast({
        id: 'sync-stats-success',
        title: 'Stats Synced!',
        description: `Rank: #${profile.rank} | Score: ${profile.total_score} pts`,
        status: 'success',
      });
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

// ─── Setup ─────────────────────────────────────────────────────────────────
export function useSetupCrackModeProfile() {
  const queryClient = useQueryClient();
  const toast = useToaster();

  return useMutation<CrackModeProfilePublic, Error, CrackModeSetupRequest>({
    mutationFn: (data) =>
      toNativePromise(
        CrackmodeService.setupCrackmodeProfileApiV1CrackmodeSetupPost({ requestBody: data })
      ),
    onSuccess: (profile) => {
      toast({
        id: 'setup-crackmode-success',
        title: 'CrackMode Profile Created!',
        description: `Welcome to ${profile.division} division, ${profile.leetcode_username}!`,
        status: 'success',
      });
      queryClient.invalidateQueries();
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

// ─── Leaderboard queries ────────────────────────────────────────────────────
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
          division: filters.division ?? undefined,
          season: filters.season ?? undefined,
          limit: filters.limit ?? 100,
          offset: filters.offset ?? 0,
        })
      ),
    staleTime: 1000 * 60 * 5,
  });
}

export function useLeaderboardByDivision(division: string, season?: string | null) {
  return useLeaderboard({ division, season, limit: 100, offset: 0 });
}

export function useTopLeaderboard(limit = 50) {
  return useLeaderboard({ limit, offset: 0 });
}

export function useCompetitionLeaderboard(limit = 100, offset = 0) {
  return useQuery<LeaderboardResponse, Error>({
    queryKey: ['crackmode', 'competition-leaderboard', { limit, offset }],
    queryFn: () =>
      toNativePromise(
        CrackmodeService.getCompetitionLeaderboardApiV1CrackmodeCompetitionLeaderboardGet({
          limit,
          offset,
        })
      ),
    staleTime: 1000 * 60 * 5,
  });
}

// ─── Combined hook ──────────────────────────────────────────────────────────
export function useCrackMode() {
  const setupProfile = useSetupCrackModeProfile();
  const syncStats = useSyncLeetCodeStats();

  return {
    setupProfile,
    syncStats,
    isSettingUp: setupProfile.isPending,
    isSyncing: syncStats.isPending,
  };
}