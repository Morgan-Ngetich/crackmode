import { Box, HStack, VStack, Skeleton, Heading, Icon } from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";

export const LeaderboardSkeleton = () => (
  <Box
    w="full"
    maxW="430px"
    minH={{ base: "430px", md: "500px" }}
    p={{ base: 4, md: 6 }}
    borderRadius="xl"
    borderWidth={2}
    borderColor="border.emphasized"
    bg="cardbg"
  >
    <VStack align="stretch" gap={2} minH={{ base: "sm", md: "md" }} position="relative">
      {/* Header */}
      <HStack justify="space-between" mb={4}>
        <Heading size="lg">
          <Icon color="yellow.400"><FaTrophy /></Icon> Top Grinders
        </Heading>
      </HStack>

      {/* Player rows */}
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <HStack
          key={i}
          justify="space-between"
          p={3}
          borderRadius="xl"
          bg={i === 1 ? { base: "yellow.50", _dark: "yellow.900/20" } : "bg.muted"}
          borderWidth={1}
          borderColor={i === 1 ? { base: "yellow.200", _dark: "yellow.700" } : "transparent"}
        >
          <HStack gap={3}>
            <Skeleton height="34px" width="28px" borderRadius="md" />
            <Skeleton height="28px" width={`${60 + i * 12}px`} borderRadius="md" />
          </HStack>
          <Skeleton height="18px" width="44px" borderRadius="md" />
        </HStack>
      ))}

      {/* Button */}
      <Box position="absolute" bottom={0} w="100%">
        <Skeleton height="40px" borderRadius="md" />
      </Box>
    </VStack>
  </Box>
);
