import {
  Box, Badge, Container, Heading, HStack, Icon, SimpleGrid, Text, VStack,
} from "@chakra-ui/react";
import { FaChartLine, FaShieldAlt } from "react-icons/fa";

const DIVISIONS = [
  { name: "Diamond",  icon: "💎", color: "blue",   minScore: 140, desc: "Elite — 28+ weighted problems/week" },
  { name: "Platinum", icon: "💿", color: "cyan",   minScore: 75,  desc: "Advanced — 18+ weighted problems/week" },
  { name: "Gold",     icon: "🥇", color: "yellow", minScore: 38,  desc: "Competitive — 8-10 problems/week" },
  { name: "Silver",   icon: "🥈", color: "gray",   minScore: 12,  desc: "Growing — ~4 problems/week" },
  { name: "Bronze",   icon: "🥉", color: "orange", minScore: 0,   desc: "Starting out — just getting going" },
] as const;

const DivisionsSection = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    bg={{ base: "white", _dark: "gray.950" }}
    position="relative"
    overflow="hidden"
  >
    <Box
      position="absolute"
      bottom="-100px"
      left="-100px"
      w="400px"
      h="400px"
      bg="yellow.400"
      filter="blur(120px)"
      opacity={{ base: 0.4, _dark: 0.2 }}
    />
    <Box
      position="absolute"
      top="-120px"
      right="-100px"
      w="400px"
      h="600px"
      bg="green.400"
      filter="blur(140px)"
      opacity={{ base: 0.5, _dark: 0.15 }}
    />

    <Container maxW="5xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="blue" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          Division System
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Climb the ladder.{" "}<br />
          <Text as="span" color="blue.400">Or get relegated.</Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" maxW="xl">
          Five tiers. Earned weekly. Stop grinding and you drop.
        </Text>
      </VStack>

      {/* Division cards */}
      <SimpleGrid columns={{ base: 2, sm: 2, md: 5 }} gap={4} mb={8}>
        {DIVISIONS.map((div) => (
          <Box
            key={div.name}
            p={5}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${div.color}.300`, _dark: `${div.color}.700` }}
            bg={{ base: `${div.color}.50`, _dark: `${div.color}.900/20` }}
            textAlign="center"
          >
            <Text fontSize="3xl" mb={1}>{div.icon}</Text>
            <Text fontWeight="bold">{div.name}</Text>
            <Badge colorPalette={div.color} variant="surface" my={2} fontSize="xs">
              {div.minScore > 0 ? `${div.minScore}+ pts` : "Starting"}
            </Badge>
          </Box>
        ))}
      </SimpleGrid>

      {/* Promotion / Relegation */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {[
          {
            icon: <FaChartLine />,
            color: "green",
            title: "Promotion",
            items: ["Hit the full point threshold", "Promoted on next sync", "No grace period"],
          },
          {
            icon: <FaShieldAlt />,
            color: "red",
            title: "Relegation",
            items: ["Fall 20% below your floor", "Gold 38 pts → drop at 30.4", "One bad week won't kill you"],
          },
        ].map(({ icon, color, title, items }) => (
          <Box
            key={title}
            p={6}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
          >
            <HStack mb={4} gap={3}>
              <Icon fontSize="xl" color={`${color}.500`}>{icon}</Icon>
              <Text fontWeight="bold" fontSize="lg">{title}</Text>
            </HStack>
            <VStack align="start" gap={3}>
              {items.map((item) => (
                <HStack key={item} gap={2} align="start">
                  <Text color={`${color}.500`} fontWeight="bold" flexShrink={0}>→</Text>
                  <Text fontSize="sm" color="fg.muted">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

export default DivisionsSection;
