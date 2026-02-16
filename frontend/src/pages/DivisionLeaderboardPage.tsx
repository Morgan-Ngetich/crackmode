import { Container, VStack, Text, Spinner, Box, HStack, Badge, Icon, Button } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useDivisionLeaderboard, useDivisionStats } from '@/hooks/crackmode/leaderboard/useCrackmodeComparison';
import { useCrackModeProfile } from '@/hooks/crackmode/leaderboard/useCrackmodeProfile';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { useAuth } from '@/hooks/auth/useAuth';
import { CrackModeProfilePublic } from '@/client';
import { FaArrowLeft, FaFire } from 'react-icons/fa';
import { BiTrendingUp, BiTargetLock } from 'react-icons/bi';

const DIVISION_COLORS = {
  Diamond: 'blue',
  Platinum: 'cyan',
  Gold: 'yellow',
  Silver: 'gray',
  Bronze: 'orange',
} as const;

const DIVISION_ICONS = {
  Diamond: '💎',
  Platinum: '💿',
  Gold: '🥇',
  Silver: '🥈',
  Bronze: '🥉',
} as const;

const DIVISIONS = ['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'];
const DIVISION_MIN_SCORES = {
  Diamond: 150,
  Platinum: 80,
  Gold: 40,
  Silver: 15,
  Bronze: 0,
};

interface DivisionLeaderboardPageProps {
  division: string;
}

export function DivisionLeaderboardPage({ division }: DivisionLeaderboardPageProps) {
  const navigate = useNavigate();
  const { data: leaderboardData, isLoading } = useDivisionLeaderboard(division);
  const { data: myProfile } = useCrackModeProfile();
  const { user } = useAuth();
  const stats = useDivisionStats(division);

  const divisionColor = DIVISION_COLORS[division as keyof typeof DIVISION_COLORS] || 'gray';
  const divisionIcon = DIVISION_ICONS[division as keyof typeof DIVISION_ICONS] || '🏆';

  // Calculate user's status in this division
  const isMyDivision = myProfile?.division === division;
  // const myDivisionRank = myProfile?.division_rank || 0;
  const myPerformanceScore = myProfile?.performance_score || 0;

  const promotionThreshold = stats ? Math.ceil(stats.totalPlayers * 0.2) : 0;
  const relegationThreshold = stats ? Math.floor(stats.totalPlayers * 0.8) : 0;

  const currentDivisionIndex = DIVISIONS.indexOf(division);
  const nextDivision = DIVISIONS[currentDivisionIndex - 1];

  const pointsToNextDivision = nextDivision
    ? DIVISION_MIN_SCORES[nextDivision as keyof typeof DIVISION_MIN_SCORES] - myPerformanceScore
    : 0;

  const getZoneStatus = (profile: CrackModeProfilePublic) => {
    if (!stats) return null;
    if (profile.division_rank <= promotionThreshold) return 'promotion';
    if (profile.division_rank >= relegationThreshold) return 'relegation';
    return 'safe';
  };

  if (isLoading) {
    return (
      <Box minH="50vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color={`${divisionColor}.400`} />
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" h="100%">
      <VStack align="stretch" gap={6}>
        <VStack align="stretch" gap={4}>
          <Button
            variant="surface"
            size="sm"
            onClick={() => navigate({ to: '/leaderboard/divisions' })}
            alignSelf="start"
          >
            <HStack gap={2}>
              <Icon><FaArrowLeft /></Icon>
              <Text>Back to Divisions</Text>
            </HStack>
          </Button>

          <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
            <HStack gap={4}>
              <Text fontSize="5xl">{divisionIcon}</Text>
              <VStack align="start" gap={1}>
                <HStack gap={3}>
                  <Text
                    fontSize="4xl"
                    fontWeight="black"
                    color={{ base: `${divisionColor}.700`, _dark: `${divisionColor}.400` }}
                  >
                    {division}
                  </Text>
                  <Badge colorPalette={divisionColor} size="lg">
                    Division
                  </Badge>
                </HStack>
                <Text color="fg.muted">
                  Rankings based on weekly performance
                </Text>
              </VStack>
            </HStack>

            <HStack gap={3} flexWrap="wrap">
              {/* User's Status Cards - Only show if user is in this division */}
              {isMyDivision && myProfile && (
                <>
                  {/* <Box
                    p={4}
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor={{ base: 'blue.200', _dark: 'blue.700' }}
                    bg={{ base: 'blue.50', _dark: 'blue.900/20' }}
                    minW="140px"
                  >
                    <VStack align="stretch" gap={2}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="fg.muted">Your Rank</Text>
                        <Icon color={{ base: 'blue.600', _dark: 'blue.400' }} fontSize="sm">
                          <FaTrophy />
                        </Icon>
                      </HStack>
                      <Text fontSize="lg" fontWeight="bold">
                        #{myDivisionRank}
                      </Text>
                    </VStack>
                  </Box>


                  <Box
                    p={4}
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor={
                      myDivisionRank <= promotionThreshold
                        ? { base: 'green.200', _dark: 'green.700' }
                        : myDivisionRank >= relegationThreshold
                          ? { base: 'red.200', _dark: 'red.700' }
                          : { base: 'gray.200', _dark: 'gray.700' }
                    }
                    bg={
                      myDivisionRank <= promotionThreshold
                        ? { base: 'green.50', _dark: 'green.900/20' }
                        : myDivisionRank >= relegationThreshold
                          ? { base: 'red.50', _dark: 'red.900/20' }
                          : { base: 'gray.50', _dark: 'gray.800' }
                    }
                    minW="140px"
                  >
                    <VStack align="stretch" gap={2}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="fg.muted">Zone</Text>
                        <Icon
                          color={
                            myDivisionRank <= promotionThreshold
                              ? { base: 'green.600', _dark: 'green.400' }
                              : myDivisionRank >= relegationThreshold
                                ? { base: 'red.600', _dark: 'red.400' }
                                : { base: 'gray.600', _dark: 'gray.400' }
                          }
                          fontSize="sm"
                        >
                          {myDivisionRank <= promotionThreshold ? (
                            <FaArrowUp />
                          ) : myDivisionRank >= relegationThreshold ? (
                            <FaArrowDown />
                          ) : (
                            <FaShieldAlt />
                          )}
                        </Icon>
                      </HStack>
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color={
                          myDivisionRank <= promotionThreshold
                            ? { base: 'green.700', _dark: 'green.400' }
                            : myDivisionRank >= relegationThreshold
                              ? { base: 'red.700', _dark: 'red.400' }
                              : 'fg'
                        }
                      >
                        {myDivisionRank <= promotionThreshold
                          ? 'Promote'
                          : myDivisionRank >= relegationThreshold
                            ? 'Danger'
                            : 'Safe'}
                      </Text>
                    </VStack>
                  </Box> */}

                  {/* Performance Score Card */}
                  <Box
                    p={4}
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor={{ base: 'purple.200', _dark: 'purple.700' }}
                    bg={{ base: 'purple.50', _dark: 'purple.900/20' }}
                    minW="140px"
                  >
                    <VStack align="stretch" gap={2}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="fg.muted">Score</Text>
                        <Icon color={{ base: 'purple.600', _dark: 'purple.400' }} fontSize="sm">
                          <BiTrendingUp />
                        </Icon>
                      </HStack>
                      <Text fontSize="lg" fontWeight="bold">
                        {myPerformanceScore}
                      </Text>
                    </VStack>
                  </Box>

                  {/* Next Division Goal Card */}
                  {nextDivision && (
                    <Box
                      p={4}
                      borderRadius="lg"
                      borderWidth={1}
                      borderColor={{ base: 'green.200', _dark: 'green.700' }}
                      bg={{ base: 'green.50', _dark: 'green.900/20' }}
                      minW="140px"
                    >
                      <VStack align="stretch" gap={2}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="fg.muted">Next Div</Text>
                          <Icon color={{ base: 'green.600', _dark: 'green.400' }} fontSize="sm">
                            <BiTargetLock />
                          </Icon>
                        </HStack>
                        <Text fontSize="lg" fontWeight="bold">
                          {pointsToNextDivision > 0 ? `${pointsToNextDivision} pts` : '✓'}
                        </Text>
                      </VStack>
                    </Box>
                  )}
                </>
              )}

              {stats && (
                <Box
                  p={4}
                  borderRadius="lg"
                  borderWidth={1}
                  borderColor={{ base: `${divisionColor}.200`, _dark: `${divisionColor}.700` }}
                  bg={{ base: `${divisionColor}.50`, _dark: `${divisionColor}.900/20` }}
                >
                  <VStack align="stretch" gap={2}>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="fg.muted">Total Players</Text>
                      <Text fontSize="lg" fontWeight="bold">{stats.totalPlayers}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color="fg.muted">Avg Weekly</Text>
                      <HStack gap={1}>
                        <Icon color={{ base: 'orange.600', _dark: 'orange.400' }} fontSize="xs"><FaFire /></Icon>
                        <Text fontSize="md" fontWeight="semibold">
                          {stats.averages.weeklySolves}
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </HStack>
          </HStack>
        </VStack>

        {/* Promotion/Relegation Info */}
        {stats && (
          <Box
            p={4}
            borderRadius="lg"
            bg={{ base: 'gray.50', _dark: 'gray.800' }}
            borderWidth={1}
            borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
          >
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <HStack gap={6} flexWrap="wrap">
                <HStack gap={2}>
                  <Badge colorPalette="green" size="sm">⬆️ PROMOTION</Badge>
                  <Text fontSize="sm" color="fg.muted">
                    Top {Math.ceil(stats.totalPlayers * 0.2)} players
                  </Text>
                </HStack>
                <HStack gap={2}>
                  <Badge colorPalette="red" size="sm">⬇️ RELEGATION</Badge>
                  <Text fontSize="sm" color="fg.muted">
                    Bottom {Math.floor(stats.totalPlayers * 0.2)} players
                  </Text>
                </HStack>
              </HStack>
              <Text fontSize="xs" color="fg.muted">
                Updated every Sunday
              </Text>
            </HStack>
          </Box>
        )}

        <LeaderboardTable
          profiles={leaderboardData?.profiles || []}
          myProfile={myProfile}
          showDivision={false}
          getZoneStatus={getZoneStatus}
          currentUser={user}
        />
      </VStack>
    </Container>
  );
}