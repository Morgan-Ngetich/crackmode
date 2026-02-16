import { useQuery } from '@tanstack/react-query';
import { CrackmodeService } from '@/client';
import { toNativePromise } from '@/utils/toNativePromisse';
import { useAuth } from '@/hooks/auth/useAuth';

/**
 * Hook for fetching the current user's CrackMode profile
 * Returns the profile from the auth context (no extra API call needed)
 */
export function useCrackModeProfile() {
  const { user, isLoading } = useAuth();
  
  return {
    data: user?.crackmode_profile ?? null,
    isLoading,
    isError: false,
    error: null,
  };
}

/**
 * Hook to check if user has setup CrackMode
 * IMPROVED: Returns clear loading states to prevent premature redirects
 */
export function useHasCrackModeProfile() {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const userProfile = user?.crackmode_profile;

  // The profile exists if there's a leetcode_username
  const hasProfile = !!userProfile?.leetcode_username;

  return {
    hasProfile,
    
    // CRITICAL: Component should wait if EITHER auth OR profile is loading
    // This prevents the false→true transition issue
    isLoading: isLoadingAuth,
    
    // Alias for clarity (same as isLoading)
    isCheckingProfile: isLoadingAuth,
    
    userProfile,
    
    // Helper: Are we done checking? (use this before making redirect decisions)
    isReady: !isLoadingAuth,
  };
}

/**
 * Hook for getting user's rank position and nearby competitors
 */
export function useMyRankPosition() {
  const { data: profile } = useCrackModeProfile();
  
  return useQuery({
    queryKey: ['crackmode', 'rank-position', profile?.rank],
    queryFn: async () => {
      if (!profile?.rank) return null;
      
      // Fetch leaderboard around user's rank
      // Get 5 above and 5 below
      const offset = Math.max(0, profile.rank - 6);
      
      return toNativePromise(
        CrackmodeService.getLeaderboardApiV1CrackmodeLeaderboardGet({
          limit: 11,
          offset,
          division: profile.division,
          season: profile.season,
        })
      );
    },
    enabled: !!profile?.rank,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}