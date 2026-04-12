import { Box, Button, Heading, HStack, Icon, Text, VStack, Badge } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FaTrophy, FaFire } from "react-icons/fa";
import { LeaderboardSkeleton } from "./HeroSkeleton";
import { CrackModeProfilePublic } from "@/client";

interface Props {
  players: CrackModeProfilePublic[];
  isLoading: boolean;
}

const MEDALS = ["🥇", "🥈", "🥉"];
const RANK_COLORS = ["yellow.400", "gray.400", "orange.400"];

const LeaderboardSlide = ({ players, isLoading }: Props) => {
  if (isLoading) return <LeaderboardSkeleton />;

  return (
    <Box
      w="full"
      maxW="430px"
      minH={{ base: "430px", md: "500px" }}
      p={{ base: 4, md: 6 }}
      borderRadius="2xl"
      borderWidth={1}
      borderColor="border.emphasized"
      bg="cardbg"
      animation="fadeIn 0.5s"
      position="relative"
      overflow="hidden"
    >
      {/* Subtle glow behind #1 */}
      <Box
        position="absolute"
        top="-40px"
        right="-40px"
        w="200px"
        h="200px"
        bg="yellow.400"
        filter="blur(80px)"
        opacity={{ base: 0.15, _dark: 0.1 }}
        pointerEvents="none"
      />

      <VStack align="stretch" gap={3} minH={{ base: "sm", md: "md" }} position="relative">
        {/* Header */}
        <HStack justify="space-between" mb={2}>
          <HStack gap={2}>
            <Icon color="yellow.400" fontSize="lg"><FaTrophy /></Icon>
            <Heading size="md">Top Grinders</Heading>
          </HStack>
          {/* Live indicator */}
          <HStack gap={1.5}>
            <Box w={2} h={2} borderRadius="full" bg="green.400" css={{ animation: "pulse 2s infinite" }} />
            <Text fontSize="xs" color="green.400" fontWeight="semibold">LIVE</Text>
          </HStack>
        </HStack>

        {players.map((player, index) => {
          const isFirst = index === 0;
          return (
            <HStack
              key={player.id}
              justify="space-between"
              p={isFirst ? 4 : 3}
              borderRadius="xl"
              bg={
                isFirst
                  ? { base: "yellow.50", _dark: "yellow.900/20" }
                  : "bg.muted"
              }
              borderWidth={isFirst ? 2 : 1}
              borderColor={
                isFirst
                  ? { base: "yellow.300", _dark: "yellow.700" }
                  : { base: "gray.100", _dark: "gray.700/50" }
              }
              position="relative"
              transition="all 0.2s"
              _hover={{ transform: "translateX(2px)" }}
            >
              {/* Rank + name */}
              <HStack gap={3}>
                <Text fontSize={isFirst ? "2xl" : "xl"} lineHeight={1} w="28px" textAlign="center">
                  {MEDALS[index] ?? `#${player.rank}`}
                </Text>
                <VStack align="start" gap={0}>
                  <Text
                    fontWeight={isFirst ? "black" : "semibold"}
                    fontSize={isFirst ? "md" : "sm"}
                    color={isFirst ? { base: "yellow.700", _dark: "yellow.300" } : "fg"}
                  >
                    {player.leetcode_username}
                  </Text>
                  <Badge
                    colorPalette={
                      player.division === "Diamond" ? "blue"
                      : player.division === "Platinum" ? "cyan"
                      : player.division === "Gold" ? "yellow"
                      : player.division === "Silver" ? "gray"
                      : "orange"
                    }
                    size="sm"
                    variant="surface"
                    fontSize="2xs"
                  >
                    {player.division}
                  </Badge>
                </VStack>
              </HStack>

              {/* Score */}
              <VStack gap={0} align="end">
                <Text
                  fontWeight="black"
                  fontSize={isFirst ? "lg" : "md"}
                  color={RANK_COLORS[index] ?? "fg.muted"}
                >
                  {player.total_score.toLocaleString()}
                </Text>
                <HStack gap={1}>
                  <Icon fontSize="2xs" color="orange.400"><FaFire /></Icon>
                  <Text fontSize="2xs" color="fg.subtle">{player.current_streak}d streak</Text>
                </HStack>
              </VStack>
            </HStack>
          );
        })}

        <Box mt="auto" pt={2}>
          <Link to="/leaderboard">
            <Button w="full" colorPalette="yellow" variant="surface" size="sm">
              View Full Leaderboard →
            </Button>
          </Link>
        </Box>
      </VStack>
    </Box>
  );
};

export default LeaderboardSlide;
