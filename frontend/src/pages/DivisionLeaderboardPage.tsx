import { Container, VStack, Text, Spinner, Box, HStack, Badge, Icon, Button, Progress } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useDivisionLeaderboard, useDivisionStats } from '@/hooks/crackmode/leaderboard/useCrackmodeComparison';
import { useCrackModeProfile } from '@/hooks/crackmode/leaderboard/useCrackmodeProfile';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { useAuth } from '@/hooks/auth/useAuth';
import { CrackModeProfilePublic } from '@/client';
import { FaArrowLeft, FaFire, FaShieldAlt } from 'react-icons/fa';
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

// Ordered lowest → highest (matches backend scoring.py)
const DIVISIONS_ASCENDING = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] as const;

const DIVISION_MIN_SCORES: Record<string, number> = {
  Bronze: 0,
  Silver: 15,
  Gold: 40,
  Platinum: 80,
  Diamond: 150,
};

// Relegation buffer: must fall 20% below division floor to relegate (mirrors backend)
const RELEGATION_BUFFER = 0.8;

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

  const isMyDivision = myProfile?.division === division;
  const myScore = myProfile?.performance_score || 0;

  // Next division is one step UP in the ascending order
  const currentIndex = DIVISIONS_ASCENDING.indexOf(division as typeof DIVISIONS_ASCENDING[number]);
  const nextDivision = DIVISIONS_ASCENDING[currentIndex + 1] ?? null; // null = Diamond (top)
  const prevDivision = DIVISIONS_ASCENDING[currentIndex - 1] ?? null; // null = Bronze (bottom)

  const currentFloor = DIVISION_MIN_SCORES[division] ?? 0;
  const nextFloor = nextDivision ? DIVISION_MIN_SCORES[nextDivision] : null;
  const relegationThreshold = Math.round(currentFloor * RELEGATION_BUFFER);

  const pointsToNext = nextFloor != null ? Math.max(nextFloor - myScore, 0) : 0;
  const pointsToSafe = myScore < currentFloor ? currentFloor - myScore : 0;   // pts to reclaim floor
  const pointsToRelegate = myScore - relegationThreshold;                         // how much buffer left

  // Progress from current floor → next floor
  const progressPercent = nextFloor != null
    ? Math.min(Math.round(((myScore - currentFloor) / (nextFloor - currentFloor)) * 100), 100)
    : 100;

  // Zone based on score thresholds (real-time, not rank percentages)
  type Zone = 'promotion' | 'safe' | 'danger' | 'relegate';
  const getMyZone = (): Zone => {
    if (!isMyDivision) return 'safe';
    if (myScore >= (nextFloor ?? Infinity)) return 'promotion'; // at/above next floor
    if (myScore >= currentFloor) return 'safe';      // above current floor
    if (myScore >= relegationThreshold) return 'danger';    // in buffer zone
    return 'relegate';                                           // below buffer
  };

  const myZone = getMyZone();

  // Zone status for each row in the table (based on their score, not rank)
  const getZoneStatus = (profile: CrackModeProfilePublic): Zone | null => {
    const score = profile.performance_score || 0;
    const theirFloor = DIVISION_MIN_SCORES[division] ?? 0;
    const theirNext = nextFloor;
    const theirRelegate = Math.round(theirFloor * RELEGATION_BUFFER);

    if (score >= (theirNext ?? Infinity)) return 'promotion';
    if (score >= theirFloor) return 'safe';
    if (score >= theirRelegate) return 'danger';
    return 'relegate';
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
            {/* Division Title */}
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
                  <Badge colorPalette={divisionColor} size="lg">Division</Badge>
                </HStack>
                <Text color="fg.muted">Rankings based on weekly performance score</Text>
              </VStack>
            </HStack>

            {/* User Status Cards */}
            <HStack gap={3} flexWrap="wrap" align="stretch">
              {isMyDivision && myProfile && (
                <>
                  {/* Performance Score */}
                  <Box
                    p={4}
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor={{ base: 'purple.200', _dark: 'purple.700' }}
                    bg={{ base: 'purple.50', _dark: 'purple.900/20' }}
                    minW="140px"
                  >
                    <VStack align="stretch" gap={1}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="fg.muted">My Score</Text>
                        <Icon color={{ base: 'purple.600', _dark: 'purple.400' }} fontSize="sm">
                          <BiTrendingUp />
                        </Icon>
                      </HStack>
                      <Text fontSize="lg" fontWeight="bold">{myScore} pts</Text>
                      <Text fontSize="2xs" color="fg.muted">
                        Floor: {currentFloor} pts
                      </Text>
                    </VStack>
                  </Box>

                  {/* Next Division / Top */}
                  {nextDivision ? (
                    <Box
                      p={4}
                      borderRadius="lg"
                      borderWidth={1}
                      borderColor={
                        pointsToNext === 0
                          ? { base: 'green.200', _dark: 'green.700' }
                          : { base: 'blue.200', _dark: 'blue.700' }
                      }
                      bg={
                        pointsToNext === 0
                          ? { base: 'green.50', _dark: 'green.900/20' }
                          : { base: 'blue.50', _dark: 'blue.900/20' }
                      }
                      minW="160px"
                    >
                      <VStack align="stretch" gap={2}>
                        <HStack justify="space-between">
                          <Text fontSize="sm" color="fg.muted">
                            {pointsToNext === 0 ? '🎉 Ready!' : `To ${DIVISION_ICONS[nextDivision as keyof typeof DIVISION_ICONS]} ${nextDivision}`}
                          </Text>
                          <Icon color={{ base: 'blue.600', _dark: 'blue.400' }} fontSize="sm">
                            <BiTargetLock />
                          </Icon>
                        </HStack>
                        <HStack justify={"space-between"}>
                          <Text fontSize="lg" fontWeight="bold">
                            {pointsToNext > 0 ? `${pointsToNext} pts` : 'Sync to promote'}
                          </Text>
                          <Text fontSize="2xs" color="fg.muted">{progressPercent}% </Text>
                        </HStack>
                        {/* Mini progress bar */}
                        <Progress.Root
                          value={progressPercent}
                          size="xs"
                          colorPalette={divisionColor}
                        >
                          <Progress.Track>
                            <Progress.Range />
                          </Progress.Track>
                        </Progress.Root>
                      </VStack>
                    </Box>
                  ) : (
                    <Box
                      p={4}
                      borderRadius="lg"
                      borderWidth={1}
                      borderColor={{ base: 'yellow.200', _dark: 'yellow.700' }}
                      bg={{ base: 'yellow.50', _dark: 'yellow.900/20' }}
                      minW="140px"
                    >
                      <VStack align="stretch" gap={1}>
                        <Text fontSize="sm" color="fg.muted">🏆 Top Division</Text>
                        <Text fontSize="lg" fontWeight="bold">Diamond</Text>
                        <Text fontSize="2xs" color="fg.muted">Stay above {relegationThreshold} pts</Text>
                      </VStack>
                    </Box>
                  )}

                  {/* Zone Status */}
                  <Box
                    p={4}
                    borderRadius="lg"
                    borderWidth={1}
                    borderColor={{
                      base: myZone === 'promotion' ? 'green.200'
                        : myZone === 'danger' ? 'orange.200'
                          : myZone === 'relegate' ? 'red.200'
                            : 'gray.200',
                      _dark: myZone === 'promotion' ? 'green.700'
                        : myZone === 'danger' ? 'orange.700'
                          : myZone === 'relegate' ? 'red.700'
                            : 'gray.700',
                    }}
                    bg={{
                      base: myZone === 'promotion' ? 'green.50'
                        : myZone === 'danger' ? 'orange.50'
                          : myZone === 'relegate' ? 'red.50'
                            : 'gray.50',
                      _dark: myZone === 'promotion' ? 'green.900/20'
                        : myZone === 'danger' ? 'orange.900/20'
                          : myZone === 'relegate' ? 'red.900/20'
                            : 'gray.800',
                    }}
                    minW="140px"
                  >
                    <VStack align="stretch" gap={1}>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="fg.muted">Status</Text>
                        <Icon fontSize="sm"
                          color={{
                            base: myZone === 'promotion' ? 'green.600'
                              : myZone === 'danger' ? 'orange.600'
                                : myZone === 'relegate' ? 'red.600'
                                  : 'gray.600',
                            _dark: myZone === 'promotion' ? 'green.400'
                              : myZone === 'danger' ? 'orange.400'
                                : myZone === 'relegate' ? 'red.400'
                                  : 'gray.400',
                          }}
                        >
                          <FaShieldAlt />
                        </Icon>
                      </HStack>
                      <Text fontSize="lg" fontWeight="bold">
                        {myZone === 'promotion' ? '⬆️ Promote'
                          : myZone === 'danger' ? '⚠️ Danger'
                            : myZone === 'relegate' ? '🔴 At Risk'
                              : '✅ Safe'}
                      </Text>
                      <Text fontSize="2xs" color="fg.muted">
                        {myZone === 'promotion' ? 'Sync to move up!'
                          : myZone === 'danger' ? `${Math.round(pointsToRelegate)} pts buffer left`
                            : myZone === 'relegate' ? `Need ${pointsToSafe} pts to recover`
                              : prevDivision ? `${Math.round(pointsToRelegate)} pts above drop zone`
                                : 'Bronze — cannot relegate'}
                      </Text>
                    </VStack>
                  </Box>
                </>
              )}

              {/* Division aggregate stats */}
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
                        <Text fontSize="md" fontWeight="semibold">{stats.averages.weeklySolves}</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </Box>
              )}
            </HStack>
          </HStack>
        </VStack>

        {/* Division thresholds info — score-based, not rank-based */}
        <Box
          p={4}
          borderRadius="lg"
          bg={{ base: 'gray.50', _dark: 'gray.800' }}
          borderWidth={1}
          borderColor={{ base: 'gray.200', _dark: 'gray.700' }}
        >
          <HStack justify="space-between" flexWrap="wrap" gap={4}>
            <HStack gap={6} flexWrap="wrap">
              {nextDivision && (
                <HStack gap={2}>
                  <Badge colorPalette="green" size="sm">⬆️ PROMOTE</Badge>
                  <Text fontSize="xs" color="fg.muted">
                    Reach {DIVISION_MIN_SCORES[nextDivision]}+ performance score
                  </Text>
                </HStack>
              )}
              {prevDivision && (
                <HStack gap={2}>
                  <Badge colorPalette="red" size="sm">⬇️ RELEGATE</Badge>
                  <Text fontSize="xs" color="fg.muted">
                    Drop below {relegationThreshold} pts (20% below {currentFloor} floor)
                  </Text>
                </HStack>
              )}
            </HStack>
          </HStack>
        </Box>

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