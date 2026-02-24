import { Card, Heading, HStack, Stat, VStack, Text, Box, Badge, Progress, Icon } from '@chakra-ui/react';
import { FaArrowUp, FaTrophy, FaFire, FaShieldAlt } from 'react-icons/fa';
import { useCrackModeProfile } from '@/hooks/crackmode/leaderboard/useCrackmodeProfile';

const DIVISIONS = [
  { name: 'Bronze',   minScore: 0,   icon: '🥉', color: 'orange' },
  { name: 'Silver',   minScore: 15,  icon: '🥈', color: 'gray'   },
  { name: 'Gold',     minScore: 40,  icon: '🥇', color: 'yellow' },
  { name: 'Platinum', minScore: 80,  icon: '💿', color: 'cyan'   },
  { name: 'Diamond',  minScore: 150, icon: '💎', color: 'blue'   },
];

interface DivisionStatsCardProps {
  division: string;
  stats: {
    totalPlayers: number;
    averages: {
      score: number;
      streak: number;
    };
    topPlayer: {
      username: string;
      score: number;
    };
  };
}

export function DivisionStatsCard({ division, stats }: DivisionStatsCardProps) {
  const { data: myProfile } = useCrackModeProfile();

  const currentDivision = DIVISIONS.find(d => d.name === division);
  const currentIndex    = DIVISIONS.findIndex(d => d.name === division);
  const nextDivision    = DIVISIONS[currentIndex + 1] ?? null; // null if Diamond

  // Only show progress if this is the user's current division
  const isMyDivision   = myProfile?.division === division;
  const myScore        = myProfile?.performance_score ?? 0;

  // How far through the current division toward next
  const progressPercent = nextDivision
    ? Math.min(Math.round(((myScore - (currentDivision?.minScore ?? 0)) /
        (nextDivision.minScore - (currentDivision?.minScore ?? 0))) * 100), 100)
    : 100;

  const pointsToNext = nextDivision ? Math.max(nextDivision.minScore - myScore, 0) : 0;

  // Relegation buffer: 20% below current floor
  const relegationThreshold = Math.round((currentDivision?.minScore ?? 0) * 0.8);
  const isInDangerZone      = isMyDivision && myScore < (currentDivision?.minScore ?? 0) && myScore >= relegationThreshold;
  const isAboutToRelegate   = isMyDivision && myScore < relegationThreshold && currentIndex > 0;

  return (
    <Card.Root>
      <Card.Body>
        <HStack justify="space-between" mb={4} align="flex-start">
          <Heading size="md">
            {currentDivision?.icon} {division} Division Stats
          </Heading>
          {isMyDivision && (
            <Badge colorPalette="green" size="sm">Your Division</Badge>
          )}
        </HStack>

        {/* General Stats */}
        <HStack gap={8} justify="space-around" wrap="wrap" mb={isMyDivision ? 5 : 0}>
          <Stat.Root>
            <Stat.Label>Total Players</Stat.Label>
            <Stat.ValueText>{stats.totalPlayers}</Stat.ValueText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Avg Score</Stat.Label>
            <Stat.ValueText>{stats.averages.score} pts</Stat.ValueText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Avg Streak</Stat.Label>
            <Stat.ValueText>{stats.averages.streak} days</Stat.ValueText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Top Player</Stat.Label>
            <Stat.ValueText fontSize="lg">{stats.topPlayer.username}</Stat.ValueText>
            <Stat.HelpText>{stats.topPlayer.score} pts</Stat.HelpText>
          </Stat.Root>
        </HStack>

        {/* ===== DYNAMIC PROGRESS SECTION (only for user's division) ===== */}
        {isMyDivision && (
          <VStack align="stretch" gap={3} mt={2}>
            <Box h="1px" bg="border.subtle" />

            {/* Danger Zone Warning */}
            {isAboutToRelegate && (
              <Box
                p={3}
                borderRadius="md"
                bg={{ base: 'red.50', _dark: 'red.900/20' }}
                borderWidth={1}
                borderColor={{ base: 'red.300', _dark: 'red.700' }}
              >
                <HStack gap={2}>
                  <Icon color={{ base: 'red.500', _dark: 'red.400' }} fontSize="sm">
                    <FaShieldAlt />
                  </Icon>
                  <VStack align="start" gap={0}>
                    <Text fontSize="sm" fontWeight="semibold" color={{ base: 'red.700', _dark: 'red.400' }}>
                      Relegation Risk!
                    </Text>
                    <Text fontSize="xs" color="fg.muted">
                      Your score ({myScore}) is below the safe zone ({relegationThreshold} pts). Grind now!
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}

            {isInDangerZone && !isAboutToRelegate && (
              <Box
                p={3}
                borderRadius="md"
                bg={{ base: 'orange.50', _dark: 'orange.900/20' }}
                borderWidth={1}
                borderColor={{ base: 'orange.300', _dark: 'orange.700' }}
              >
                <HStack gap={2}>
                  <Icon color={{ base: 'orange.500', _dark: 'orange.400' }} fontSize="sm">
                    <FaFire />
                  </Icon>
                  <VStack align="start" gap={0}>
                    <Text fontSize="sm" fontWeight="semibold" color={{ base: 'orange.700', _dark: 'orange.400' }}>
                      Below Division Floor
                    </Text>
                    <Text fontSize="xs" color="fg.muted">
                      Need {(currentDivision?.minScore ?? 0) - myScore} pts to reclaim standing.
                      Safe zone starts at {relegationThreshold} pts.
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}

            {/* Progress to Next Division */}
            {nextDivision ? (
              <VStack align="stretch" gap={2}>
                <HStack justify="space-between">
                  <HStack gap={1}>
                    <Icon fontSize="xs" color={{ base: `${currentDivision?.color}.600`, _dark: `${currentDivision?.color}.400` }}>
                      <FaArrowUp />
                    </Icon>
                    <Text fontSize="sm" fontWeight="semibold">
                      Progress to {nextDivision.icon} {nextDivision.name}
                    </Text>
                  </HStack>
                  <Text fontSize="sm" color="fg.muted">
                    {myScore} / {nextDivision.minScore} pts
                  </Text>
                </HStack>

                <Progress.Root
                  value={progressPercent}
                  size="sm"
                  colorPalette={currentDivision?.color}
                >
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>

                <HStack justify="space-between">
                  <Text fontSize="xs" color="fg.muted">
                    {pointsToNext > 0
                      ? `${pointsToNext} pts needed to promote`
                      : '🎉 Promotion threshold reached! Sync to promote.'}
                  </Text>
                  <Text fontSize="xs" color="fg.muted">
                    {progressPercent}%
                  </Text>
                </HStack>

                {/* Quick breakdown of what gets them there */}
                {pointsToNext > 0 && (
                  <Box
                    p={2}
                    borderRadius="md"
                    bg={{ base: 'bg.subtle', _dark: 'whiteAlpha.50' }}
                  >
                    <Text fontSize="2xs" color="fg.muted" fontFamily="mono">
                      To promote: ~{Math.ceil(pointsToNext / 5)}H &nbsp;|&nbsp;
                      ~{Math.ceil(pointsToNext / 3)}M &nbsp;|&nbsp;
                      ~{pointsToNext}E this week
                    </Text>
                  </Box>
                )}
              </VStack>
            ) : (
              /* Diamond — Top division */
              <HStack gap={2} p={3} borderRadius="md" bg={{ base: 'blue.50', _dark: 'blue.900/20' }}>
                <Icon color={{ base: 'yellow.500', _dark: 'yellow.400' }}>
                  <FaTrophy />
                </Icon>
                <VStack align="start" gap={0}>
                  <Text fontSize="sm" fontWeight="semibold">You're at the top!</Text>
                  <Text fontSize="xs" color="fg.muted">
                    Stay active or risk relegation to Platinum (below {relegationThreshold} pts).
                  </Text>
                </VStack>
              </HStack>
            )}
          </VStack>
        )}
      </Card.Body>
    </Card.Root>
  );
}