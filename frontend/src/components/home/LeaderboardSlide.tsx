import { Box, Button, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FaTrophy } from "react-icons/fa";
import { LeaderboardSkeleton } from "./HeroSkeleton";
import { CrackModeProfilePublic } from "@/client";
import { SiLeetcode } from "react-icons/si";

interface Props {
  players: CrackModeProfilePublic[];
  isLoading: boolean;
}

const LeaderboardSlide = ({ players, isLoading }: Props) => {
  if (isLoading) return <LeaderboardSkeleton />;

  return (
    <Box
      w="full"
      maxW="430px"
      minH={{ base: "430px", md: "500px" }}
      p={{ base: 4, md: 6 }}
      borderRadius="xl"
      borderWidth={2}
      borderColor="border.emphasized"
      bg="cardbg"
      animation="fadeIn 0.5s"
    >
      <VStack align="stretch" gap={2} minH={{ base: "sm", md: "md" }} position="relative">
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">
            <Icon color="yellow.400"><FaTrophy /></Icon> Top Grinders
          </Heading>
        </HStack>

        {players.map((player, index) => (
          <HStack
            key={player.id}
            justify="space-between"
            p={3}
            borderRadius="xl"
            bg={index === 0 ? { base: "yellow.50", _dark: "yellow.900/20" } : "bg.muted"}
            borderWidth={1}
            borderColor={index === 0 ? { base: "yellow.200", _dark: "yellow.700" } : "transparent"}
          >
            <HStack gap={3}>
              <Text fontSize="xl" fontWeight="bold">#{player.rank}</Text>
              <Text fontWeight="semibold">{player.leetcode_username}</Text>
            </HStack>
            <HStack gap={2} justify="center">
              <Icon color="orange.400" fontSize="md"><SiLeetcode /></Icon>
              <Text fontWeight="bold">{player.total_problems_solved}</Text>
            </HStack>
          </HStack>
        ))}

        <Box position="absolute" bottom={0} w="100%">
          <Link to="/leaderboard">
            <Button w="full">View Full Leaderboard →</Button>
          </Link>
        </Box>
      </VStack>
    </Box>
  );
};

export default LeaderboardSlide;