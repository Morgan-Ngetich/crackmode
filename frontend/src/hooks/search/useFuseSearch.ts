import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { CrackModeProfilePublic } from '@/client';

interface UseFuseSearchOptions {
  profiles: CrackModeProfilePublic[];
  searchQuery: string;
}

/**
 * Hook for fuzzy searching through leaderboard profiles using Fuse.js
 * @param profiles - Array of profiles to search through
 * @param searchQuery - Search query string
 * @returns Filtered profiles based on search query
 */
export function useFuseSearch({ profiles, searchQuery }: UseFuseSearchOptions) {
  // Configure Fuse.js options
  const fuseOptions = useMemo(
    () => ({
      keys: [
        {
          name: 'leetcode_username',
          weight: 2, // Higher weight for username matches
        },
        {
          name: 'division',
          weight: 1,
        },
      ],
      threshold: 0.3, // Lower = more strict matching (0.0 = perfect match, 1.0 = match anything)
      ignoreLocation: true,
      minMatchCharLength: 1,
    }),
    []
  );

  // Create Fuse instance with profiles
  const fuse = useMemo(
    () => new Fuse(profiles, fuseOptions),
    [profiles, fuseOptions]
  );

  // Perform search
  const filteredProfiles = useMemo(() => {
    if (!searchQuery.trim()) {
      return profiles;
    }

    const results = fuse.search(searchQuery);
    return results.map((result) => result.item);
  }, [fuse, searchQuery, profiles]);

  return {
    filteredProfiles,
    resultCount: filteredProfiles.length,
    isSearching: searchQuery.trim().length > 0,
  };
}