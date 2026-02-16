import { Box, SimpleGrid, VStack, HStack, Text, Badge, Skeleton, Icon, Progress } from '@chakra-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useDivisionSummaries } from '@/hooks/crackmode/leaderboard/useCrackmodeComparison';
import { useCrackModeProfile } from '@/hooks/crackmode/leaderboard/useCrackmodeProfile';
import { FaFire, FaTrophy, FaLock, FaArrowDown, FaCheckCircle, FaChartLine } from 'react-icons/fa';
import { BiTargetLock } from 'react-icons/bi';

const DIVISIONS = [
  { name: 'Diamond', icon: '💎', color: 'blue', minScore: 150 },
  { name: 'Platinum', icon: '💿', color: 'cyan', minScore: 80 },
  { name: 'Gold', icon: '🥇', color: 'yellow', minScore: 40 },
  { name: 'Silver', icon: '🥈', color: 'gray', minScore: 15 },
  { name: 'Bronze', icon: '🥉', color: 'orange', minScore: 0 },
];

// Points: Easy = 1, Medium = 3, Hard = 5
// Ratio: 4 Easy : 2 Medium : 1 Hard
// Total points per set: (4×1) + (2×3) + (1×5) = 4 + 6 + 5 = 15 points
const calculateProblemsNeeded = (pointsNeeded: number) => {
  const sets = Math.ceil(pointsNeeded / 15);

  return {
    easy: sets * 4,
    medium: sets * 2,
    hard: sets * 1,
  };
};

export function DivisionCards() {
  const navigate = useNavigate();
  const { divisions, isLoading } = useDivisionSummaries();
  const { data: myProfile } = useCrackModeProfile();

  const getDivisionMotivation = (div: typeof DIVISIONS[0], index: number) => {
    // const divisionData = divisions.find(d => d.name === div.name);
    // const playerCount = divisionData?.data?.total || 0;
    // const topPlayer = divisionData?.data?.profiles?.[0];

    // NO PROFILE: Show general info about each division
    if (!myProfile) {
      const problems = calculateProblemsNeeded(div.minScore);
      return {
        type: 'neutral',
        icon: FaChartLine,
        color: div.color,
        title: 'Join to Compete',
        message: `${div.minScore}+ performance score required`,
        sublabel: `~${problems.easy}E • ${problems.medium}M • ${problems.hard}H per week`,
      };
    }

    const myDivision = myProfile.division;
    const myScore = myProfile.performance_score || 0;
    const isMyDivision = myDivision === div.name;
    const myDivisionIndex = DIVISIONS.findIndex(d => d.name === myDivision);
    const currentDivIndex = index;

    // Case 1: User is IN this division
    if (isMyDivision) {
      const nextDivision = DIVISIONS[index - 1]; // Higher division
      const pointsNeeded = nextDivision ? nextDivision.minScore - myScore : 0;

      return {
        type: 'current',
        icon: FaCheckCircle,
        color: 'green',
        title: 'Your Division',
        message: pointsNeeded > 0
          ? `${pointsNeeded} pts to ${nextDivision?.name}`
          : 'Top division! Stay active!',
        progress: nextDivision ? (myScore / nextDivision.minScore) * 100 : 100,
      };
    }

    // Case 2: Division ABOVE user (locked, show requirements)
    if (currentDivIndex < myDivisionIndex) {
      const pointsNeeded = div.minScore - myScore;
      const problems = calculateProblemsNeeded(pointsNeeded);

      return {
        type: 'above',
        icon: FaLock,
        color: 'orange',
        title: 'Locked',
        message: `Need ${pointsNeeded} pts to unlock`,
        sublabel: `~ ${problems.easy}E • ${problems.medium}M • ${problems.hard}H`,
        progress: (myScore / div.minScore) * 100,
      };
    }

    // Case 3: Division BELOW user (danger zone)
    if (currentDivIndex > myDivisionIndex) {
      return {
        type: 'below',
        icon: FaArrowDown,
        color: 'red',
        title: 'Danger Zone',
        message: 'Stop grinding = relegation',
        sublabel: 'Stay active to avoid this',
      };
    }

    // Fallback
    return {
      type: 'neutral',
      icon: BiTargetLock,
      color: 'blue',
      title: 'Requirements',
      message: `${div.minScore}+ performance score`,
      sublabel: `Join to start competing`,
    };
  };

  return (
    <Box w="full" mt={{ base: "auto", md: 3 }} px={4} py={{ base: 0, md: 4 }}>
      <VStack align="stretch" gap={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {DIVISIONS.map((div, index) => {
            const divisionData = divisions.find(d => d.name === div.name);
            const playerCount = divisionData?.data?.total || 0;
            const topPlayer = divisionData?.data?.profiles?.[0];
            const motivation = getDivisionMotivation(div, index);

            return (
              <Box
                key={div.name}
                px={4}
                pb={3}
                pt={2}
                borderWidth={2}
                borderRadius="xl"
                borderColor={
                  motivation.type === 'current'
                    ? { base: `${div.color}.600`, _dark: `${div.color}.500` }
                    : { base: `${div.color}.300`, _dark: `${div.color}.700` }
                }
                bg={
                  motivation.type === 'current'
                    ? { base: `${div.color}.50`, _dark: `${div.color}.900/30` }
                    : 'cardbg'
                }
                cursor="pointer"
                onClick={() => navigate({
                  to: '/leaderboard/divisions/$division',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  params: { division: div.name } as any
                })}
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                  borderColor: { base: `${div.color}.500`, _dark: `${div.color}.500` },
                }}
                _before={{
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: {
                    base: `linear-gradient(135deg, var(--chakra-colors-${div.color}-500) 0%, transparent 50%,  var(--chakra-colors-${div.color}-300) 100%)`,
                    _dark: `linear-gradient(135deg, var(--chakra-colors-${div.color}-500) 0%, transparent 40%, transparent 60%, var(--chakra-colors-${div.color}-400) 100%)`,
                  },
                  opacity: 0.3,
                  pointerEvents: 'none',
                }}
                transition="all 0.2s"
              >
                <VStack align="stretch" gap={4} position="relative" zIndex={1}>
                  {/* Header */}
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="4xl">{div.icon}</Text>
                      {/* Division Name */}
                      <VStack align="start" gap={1}>
                        <Text
                          fontSize="2xl"
                          fontWeight="black"
                          color={{ base: `${div.color}.700`, _dark: `${div.color}.400` }}
                          letterSpacing="tight"
                        >
                          {div.name}
                        </Text>
                        <Text fontSize="sm" color="fg.subtle">
                          {div.minScore}+ performance score
                        </Text>
                      </VStack>
                    </Box>

                    <VStack align="flex-end">
                      <Badge
                        colorPalette={motivation.color}
                        size="sm"
                        px={2}
                        py={1}
                      >
                        {motivation.title}
                      </Badge>

                      {/* Top Player */}
                      {topPlayer && (
                        <>
                          <HStack gap={2} fontSize="xs" color="fg.muted">
                            <HStack gap={1}>
                              <Icon fontSize="xs"><FaFire /></Icon>
                              <Text>{topPlayer.weekly_solves}/week</Text>
                            </HStack>
                            <Text>•</Text>
                            <Text>{topPlayer.performance_score} pts</Text>
                          </HStack>
                          <Box>
                            <HStack gap={2} align="flex-end">
                              <HStack gap={1}>
                                <Icon color={{ base: 'yellow.600', _dark: 'yellow.400' }} fontSize="2xs">
                                  <FaTrophy />
                                </Icon>
                                <Text fontSize="2xs" color="fg.muted">Top Player</Text>
                              </HStack>
                              <Text fontSize="sm" fontWeight="semibold" lineClamp={1}>
                                {topPlayer.leetcode_username}
                              </Text>
                            </HStack>
                          </Box>
                        </>
                      )}
                    </VStack>
                  </HStack>


                  {/* Stats or Motivation */}
                  {isLoading || divisionData?.isLoading ? (
                    <VStack align="stretch" gap={3}>
                      {/* Player Count Skeleton */}
                      <HStack justify="space-between">
                        <Skeleton height="16px" width="60px" />
                        <Skeleton height="20px" width="40px" />
                      </HStack>

                      {/* Motivation Section Skeleton */}
                      <Box
                        p={3}
                        borderRadius="md"
                        bg={{
                          base: `${div.color}.100`,
                          _dark: `${div.color}.900/20`,
                        }}
                        borderWidth={1}
                        borderColor={{
                          base: `${div.color}.300`,
                          _dark: `${div.color}.700`,
                        }}
                      >
                        <VStack align="stretch" gap={2}>
                          <HStack gap={2} justify="space-between">
                            <HStack flex={1}>
                              <Skeleton height="16px" width="16px" borderRadius="md" />
                              <Skeleton height="16px" width="120px" />
                            </HStack>
                            <Skeleton height="14px" width="60px" />
                          </HStack>

                          {/* Sublabel Skeleton */}
                          <Skeleton height="12px" width="100px" />

                          {/* Progress Bar Skeleton */}
                          <Skeleton height="8px" width="100%" borderRadius="full" />
                        </VStack>
                      </Box>
                    </VStack>
                  ) : (
                    <VStack align="stretch" gap={3}>
                      {/* Player Count */}
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="fg.muted">Players</Text>
                        <Text fontSize="md" fontWeight="bold">{playerCount}</Text>
                      </HStack>

                      {/* Motivation Section */}
                      <Box
                        p={3}
                        borderRadius="md"
                        bg={{
                          base: `${motivation.color}.100`,
                          _dark: `${motivation.color}.900/20`,
                        }}
                        borderWidth={1}
                        borderColor={{
                          base: `${motivation.color}.300`,
                          _dark: `${motivation.color}.700`,
                        }}
                      >
                        <VStack align="stretch" gap={2}>
                          <HStack gap={2} justify="space-between">
                            <HStack>
                              <Icon
                                color={{
                                  base: `${motivation.color}.600`,
                                  _dark: `${motivation.color}.400`,
                                }}
                                fontSize="sm"
                              >
                                {<motivation.icon />}
                              </Icon>
                              <Text
                                fontSize="sm"
                                fontWeight="semibold"
                                color={{
                                  base: `${motivation.color}.700`,
                                  _dark: `${motivation.color}.400`,
                                }}
                              >
                                {motivation.message}
                              </Text>
                            </HStack>
                            <HStack>
                              {motivation.progress !== undefined && motivation.type === 'above' && (
                                <Text fontSize="xs" color="fg.subtle" mt={1}>
                                  {Math.round(motivation.progress)}% there
                                </Text>
                              )}
                            </HStack>
                          </HStack>

                          {motivation.sublabel && (
                            <Text fontSize="2xs" color="fg.muted" fontFamily="mono">
                              {motivation.sublabel}
                            </Text>
                          )}

                          {motivation.progress !== undefined && motivation.type === 'above' && (
                            <Box>
                              <Progress.Root
                                value={motivation.progress}
                                size="sm"
                                colorPalette={motivation.color}
                              >
                                <Progress.Track>
                                  <Progress.Range />
                                </Progress.Track>
                              </Progress.Root>
                            </Box>
                          )}
                        </VStack>
                      </Box>
                    </VStack>
                  )}

                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>
      </VStack>
    </Box>
  );
}