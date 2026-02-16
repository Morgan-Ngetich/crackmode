import { Box, Table, Input, InputGroup, Text, Icon } from '@chakra-ui/react';
import { CrackModeProfilePublic, UserPublic } from '@/client';
import { PlayerRow } from './PlayerRow';
import { useState } from 'react';
import { useDebounce } from '@/hooks/search/useDebounce';
import { useFuseSearch } from '@/hooks/search/useFuseSearch';
import { FaSearch } from 'react-icons/fa';

interface LeaderboardTableProps {
  profiles: CrackModeProfilePublic[];
  myProfile?: CrackModeProfilePublic | null;
  showDivision: boolean;
  getZoneStatus?: ((profile: CrackModeProfilePublic) => 'promotion' | 'relegation' | 'safe' | null) | null;
  currentUser?: UserPublic | null;
}

export function LeaderboardTable({
  profiles,
  myProfile,
  showDivision,
  getZoneStatus,
  currentUser,
}: LeaderboardTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { filteredProfiles, resultCount, isSearching } = useFuseSearch({
    profiles,
    searchQuery: debouncedSearch,
  });

  // Check if any user needs actions column
  const showActionsColumn = profiles.some(profile => {
    const isCurrentUser = profile.leetcode_username === myProfile?.leetcode_username;
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
    return isCurrentUser || isAdmin;
  });

  const bgColor = { base: 'white', _dark: 'gray.800' }
  const borderColor = { base: 'gray.200', _dark: 'gray.600' }

  return (
    <Box>
      {/* Search bar */}
      <Box mb={4}>
        <InputGroup
          startElement={<Icon color="gray.400"><FaSearch /></Icon>}
          w={{ base: "100%", md: "400px" }}
        >
          <Input
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
            borderRadius="lg"
            bg={bgColor}
            border="2px solid"
            borderColor={borderColor}
            _hover={{ borderColor: "green.300" }}
            _focus={{ borderColor: "green.500", boxShadow: "0 0 0 1px var(--chakra-colors-orange-500)" }}
          />
        </InputGroup>

        {isSearching && (
          <Text fontSize="sm" color="gray.500" mt={2}>
            Found {resultCount} {resultCount === 1 ? 'player' : 'players'}
          </Text>
        )}
      </Box>

      {/* Table */}
      <Box overflowX="auto" borderWidth={1} borderRadius="lg">
        <Table.Root size="sm" variant="outline" interactive stickyHeader>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader p={4}>Rank</Table.ColumnHeader>
              <Table.ColumnHeader>Player</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Solved</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Score</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Streak</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end">Weekly</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Status</Table.ColumnHeader>
              {showDivision && <Table.ColumnHeader>Division</Table.ColumnHeader>}
              {showActionsColumn && <Table.ColumnHeader width="60px" textAlign="right">Actions</Table.ColumnHeader>}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredProfiles.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={showDivision ? 9 : 8} textAlign="center" py={8}>
                  <Text color="gray.500">
                    {isSearching ? 'The players were just here, where did they go?' : 'Imagine there are no players here. Grind to be the first'}
                  </Text>
                </Table.Cell>
              </Table.Row>
            ) : (
              filteredProfiles.map((profile) => (
                <PlayerRow
                  key={profile.id}
                  profile={profile}
                  isCurrentUser={profile.leetcode_username === myProfile?.leetcode_username}
                  showDivision={showDivision}
                  zone={getZoneStatus ? getZoneStatus(profile) : null}
                  currentUser={currentUser}
                />
              ))
            )}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}