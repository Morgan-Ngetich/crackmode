import { Box, Button, Badge, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

const DIVISIONS = [
  { name: "Diamond",  icon: "💎", color: "blue",   minScore: 140, label: "Elite" },
  { name: "Platinum", icon: "💿", color: "cyan",   minScore: 75,  label: "Advanced" },
  { name: "Gold",     icon: "🥇", color: "yellow", minScore: 38,  label: "Competitive" },
  { name: "Silver",   icon: "🥈", color: "gray",   minScore: 12,  label: "Growing" },
  { name: "Bronze",   icon: "🥉", color: "orange", minScore: 0,   label: "Starting" },
] as const;

const MAX_SCORE = 140;

const DivisionsSlide = () => (
  <Box
    w="full"
    maxW="430px"
    minH={{ base: "450px", md: "500px" }}
    p={{ base: 4, md: 6 }}
    borderRadius="2xl"
    borderWidth={1}
    borderColor="border.emphasized"
    bg="cardbg"
    animation="fadeIn 0.5s"
    position="relative"
    overflow="hidden"
  >
    {/* Diamond tier glow */}
    <Box
      position="absolute"
      top="-60px"
      right="-60px"
      w="200px"
      h="200px"
      bg="blue.400"
      filter="blur(80px)"
      opacity={{ base: 0.12, _dark: 0.08 }}
      pointerEvents="none"
    />

    <VStack align="stretch" gap={4} position="relative" h="full">
      <Box>
        <Heading size="md" mb={0.5}>Division Ladder</Heading>
        <Text fontSize="xs" color="fg.muted">Weekly velocity determines your tier</Text>
      </Box>

      {/* Ladder list */}
      <VStack gap={2} align="stretch">
        {DIVISIONS.map((div, i) => {
          const fillPct = div.minScore === 0 ? 8 : Math.round((div.minScore / MAX_SCORE) * 100);
          const isTop = i === 0;
          return (
            <HStack
              key={div.name}
              p={3}
              borderRadius="xl"
              borderWidth={isTop ? 2 : 1}
              borderColor={
                isTop
                  ? { base: `${div.color}.400`, _dark: `${div.color}.600` }
                  : { base: `${div.color}.200`, _dark: `${div.color}.800` }
              }
              bg={{ base: `${div.color}.50`, _dark: `${div.color}.900/20` }}
              gap={3}
              position="relative"
              overflow="hidden"
            >
              {/* Progress fill bar (background) */}
              <Box
                position="absolute"
                left={0}
                top={0}
                bottom={0}
                w={`${fillPct}%`}
                bg={`${div.color}.400`}
                opacity={0.07}
                borderRadius="xl"
                transition="width 1s ease"
              />

              <Text fontSize="xl" flexShrink={0} lineHeight={1}>{div.icon}</Text>

              <Box flex={1} minW={0}>
                <HStack justify="space-between">
                  <Text fontWeight="bold" fontSize="sm">{div.name}</Text>
                  <Badge colorPalette={div.color} variant="surface" size="sm">
                    {div.minScore > 0 ? `${div.minScore}+ pts` : "Start here"}
                  </Badge>
                </HStack>
                <Text fontSize="xs" color="fg.muted" mt={0.5}>{div.label}</Text>
              </Box>
            </HStack>
          );
        })}
      </VStack>

      <Box mt="auto">
        <Link to="/leaderboard">
          <Button w="full" colorPalette="blue" variant="surface" size="sm">
            See Where You Rank →
          </Button>
        </Link>
      </Box>
    </VStack>
  </Box>
);

export default DivisionsSlide;
