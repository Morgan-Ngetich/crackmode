import { Container, VStack, Text, Spinner, Box, HStack, Badge, Icon, Button, Progress, Flex } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useDivisionLeaderboard, useDivisionStats } from '@/hooks/crackmode/leaderboard/useCrackmodeComparison';
import { useCrackModeProfile } from '@/hooks/crackmode/leaderboard/useCrackmodeProfile';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { useAuth } from '@/hooks/auth/useAuth';
import { CrackModeProfilePublic } from '@/client';
import { FaArrowLeft, FaFire } from 'react-icons/fa';

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

const DIVISIONS_ASCENDING = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'] as const;

const DIVISION_MIN_SCORES: Record<string, number> = {
  Bronze: 0,
  Silver: 15,
  Gold: 40,
  Platinum: 80,
  Diamond: 150,
};

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

  const currentIndex = DIVISIONS_ASCENDING.indexOf(division as typeof DIVISIONS_ASCENDING[number]);
  const nextDivision = DIVISIONS_ASCENDING[currentIndex + 1] ?? null;
  const prevDivision = DIVISIONS_ASCENDING[currentIndex - 1] ?? null;

  const currentFloor = DIVISION_MIN_SCORES[division] ?? 0;
  const nextFloor = nextDivision ? DIVISION_MIN_SCORES[nextDivision] : null;
  const relegationThreshold = Math.round(currentFloor * RELEGATION_BUFFER);

  const pointsToNext = nextFloor != null ? Math.max(nextFloor - myScore, 0) : 0;
  const pointsToSafe = myScore < currentFloor ? currentFloor - myScore : 0;
  const pointsToRelegate = myScore - relegationThreshold;

  const progressPercent = nextFloor != null
    ? Math.min(Math.round(((myScore - currentFloor) / (nextFloor - currentFloor)) * 100), 100)
    : 100;

  type Zone = 'promotion' | 'safe' | 'danger' | 'relegate';
  const getMyZone = (): Zone => {
    if (!isMyDivision) return 'safe';
    if (myScore >= (nextFloor ?? Infinity)) return 'promotion';
    if (myScore >= currentFloor) return 'safe';
    if (myScore >= relegationThreshold) return 'danger';
    return 'relegate';
  };

  const myZone = getMyZone();

  const getZoneStatus = (profile: CrackModeProfilePublic): Zone | null => {
    const score = profile.performance_score || 0;
    const theirFloor = DIVISION_MIN_SCORES[division] ?? 0;
    const theirRelegate = Math.round(theirFloor * RELEGATION_BUFFER);
    if (score >= (nextFloor ?? Infinity)) return 'promotion';
    if (score >= theirFloor) return 'safe';
    if (score >= theirRelegate) return 'danger';
    return 'relegate';
  };

  const ZONE_CONFIG = {
    promotion: { color: 'green', label: '⬆ Ready to promote', detail: 'Sync to move up' },
    safe: { color: 'gray', label: '✓ Safe', detail: prevDivision ? `${Math.round(pointsToRelegate)} pts above drop` : 'Cannot relegate' },
    danger: { color: 'orange', label: '⚠ Danger zone', detail: `${Math.round(pointsToRelegate)} pts buffer left` },
    relegate: { color: 'red', label: '↓ At risk', detail: `Need ${pointsToSafe} pts to recover` },
  } as const;

  if (isLoading) {
    return (
      <Box minH="50vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color={`${divisionColor}.400`} />
      </Box>
    );
  }

  const zone = ZONE_CONFIG[myZone];

  return (
    <Container maxW="container.xl">
      <VStack align="stretch" gap={6}>

        {/* ── Page header ── */}
        <VStack align="stretch" gap={3}>
          <Button
            variant="ghost"
            size="sm"
            alignSelf="start"
            color="fg.muted"
            onClick={() => navigate({ to: '/leaderboard/divisions' })}
          >
            <Icon><FaArrowLeft /></Icon>
            Divisions
          </Button>

          <HStack justify="space-between" align="center" flexWrap="wrap" gap={3}>
            <HStack gap={3}>
              <Text fontSize="3xl" lineHeight={1}>{divisionIcon}</Text>
              <VStack align="start" gap={0.5}>
                <HStack gap={2}>
                  <Text fontSize="2xl" fontWeight="black" color={{ base: `${divisionColor}.600`, _dark: `${divisionColor}.400` }}>
                    {division}
                  </Text>
                  <Badge colorPalette={divisionColor} variant="surface" size="sm">Division</Badge>
                </HStack>
                <HStack gap={3} color="fg.muted" fontSize="sm" textAlign={"center"}>

                  <Text display={{ base: "none", md: "block" }}>Weekly performance score</Text>
                  {stats && (
                    <>
                      <Text color="fg.subtle" display={{ base: "none", md: "block" }}>·</Text>
                      <Text>{stats.totalPlayers} players</Text>
                      <Text color="fg.subtle">·</Text>
                      <HStack gap={1}>
                        <Icon fontSize="xs" color="orange.400"><FaFire /></Icon>
                        <Text>{stats.averages.weeklySolves} avg solves/week</Text>
                      </HStack>
                    </>
                  )}
                </HStack>
              </VStack>
            </HStack>
          </HStack>
        </VStack>

        {/* ── My status strip (only if in this division) ── */}
        {isMyDivision && myProfile && (
          <Box
            p={4}
            borderRadius="xl"
            borderWidth={1}
            borderColor={{ base: `${zone.color}.200`, _dark: `${zone.color}.700` }}
            bg={{ base: `${zone.color}.50`, _dark: `${zone.color}.900/20` }}
          >
            <Flex direction={{ base: "column", md: "row" }} justify="space-between" align={{ base: "stretch", md: "center" }} gap={4}>

              {/* Score + Badge row on mobile */}
              <Flex justify="space-between" align="center">
                <VStack align="start" gap={0}>
                  <Text fontSize="xs" color="fg.muted">My score</Text>
                  <Text fontSize="xl" fontWeight="black">{myScore} pts</Text>
                  <Text fontSize="2xs" color="fg.muted">Floor: {currentFloor} pts</Text>
                </VStack>

                {/* Badge — right of score on mobile, hidden on md (shown at end) */}
                <VStack align="end" gap={0.5} display={{ base: "flex", md: "none" }}>
                  <Badge colorPalette={zone.color} variant="solid" fontSize="sm" px={3} py={1} borderRadius="full">
                    {zone.label}
                  </Badge>
                  <Text fontSize="2xs" color="fg.muted">{zone.detail}</Text>
                </VStack>
              </Flex>

              {/* Progress */}
              <VStack align="start" gap={1} flex={1} minW="160px" maxW={{ base: "full", md: "280px" }}>
                <HStack justify="space-between" w="full">
                  <Text fontSize="xs" color="fg.muted">
                    {nextDivision
                      ? `${DIVISION_ICONS[nextDivision as keyof typeof DIVISION_ICONS]} ${nextDivision}`
                      : '🏆 Top division'}
                  </Text>
                  <Text fontSize="xs" color="fg.muted">{progressPercent}%</Text>
                </HStack>
                <Progress.Root value={progressPercent} size="sm" colorPalette={divisionColor} w="full">
                  <Progress.Track borderRadius="full">
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
                <Text fontSize="2xs" color="fg.muted">
                  {nextDivision && pointsToNext > 0
                    ? `${pointsToNext} pts to ${nextDivision}`
                    : nextDivision ? 'Sync to promote' : `Stay above ${relegationThreshold} pts`}
                </Text>
              </VStack>

              {/* Badge — end of row on desktop only */}
              <VStack align="end" gap={0.5} display={{ base: "none", md: "flex" }}>
                <Badge colorPalette={zone.color} variant="solid" fontSize="sm" px={3} py={1} borderRadius="full">
                  {zone.label}
                </Badge>
                <Text fontSize="2xs" color="fg.muted">{zone.detail}</Text>
              </VStack>

            </Flex>
          </Box>
        )}

        {/* ── Threshold rule line ── */}
        <HStack gap={4} flexWrap="wrap">
          {nextDivision && (
            <HStack gap={1.5}>
              <Badge colorPalette="green" variant="surface" size="sm">⬆ Promote</Badge>
              <Text fontSize="xs" color="fg.muted">
                {DIVISION_MIN_SCORES[nextDivision]}+ pts
              </Text>
            </HStack>
          )}
          {prevDivision && (
            <HStack gap={1.5}>
              <Badge colorPalette="red" variant="surface" size="sm">⬇ Relegate</Badge>
              <Text fontSize="xs" color="fg.muted">
                below {relegationThreshold} pts (20% below {currentFloor} floor)
              </Text>
            </HStack>
          )}
        </HStack>

        {/* ── Table ── */}
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
