import {
  Box, Badge, Container, Heading, HStack, Icon, SimpleGrid, Text, VStack,
} from "@chakra-ui/react";
import { FaFire, FaShieldAlt } from "react-icons/fa";

const ScoringSection = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    bg={{ base: "white", _dark: "gray.950" }}
    position="relative"
    overflow="hidden"
  >
    <Box
      position="absolute"
      top="-100px"
      left="-100px"
      w="400px"
      h="400px"
      bg="yellow.400"
      filter="blur(120px)"
      opacity={{ base: 0.4, _dark: 0.2 }}
    />
    <Box
      position="absolute"
      bottom="-120px"
      right="-100px"
      w="400px"
      h="600px"
      bg="green.400"
      filter="blur(140px)"
      opacity={{ base: 0.5, _dark: 0.15 }}
    />

    <Container maxW="5xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="orange" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          Scoring System
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Every problem counts.{" "}<br />
          <Text as="span" color="orange.400">Harder = more points.</Text>
        </Heading>
      </VStack>

      {/* Difficulty cards */}
      <SimpleGrid columns={{ base: 3 }} gap={{ base: 3, md: 6 }} mb={10}>
        {[
          { label: "Easy",   pts: "1 pt",  palette: "green",  sub: "Arrays, strings" },
          { label: "Medium", pts: "3 pts", palette: "yellow", sub: "DP, graphs, trees" },
          { label: "Hard",   pts: "5 pts", palette: "red",    sub: "Advanced patterns" },
        ].map(({ label, pts, palette, sub }) => (
          <Box
            key={label}
            textAlign="center"
            p={{ base: 4, md: 8 }}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${palette}.200`, _dark: `${palette}.700` }}
            bg={{ base: `${palette}.50`, _dark: `${palette}.900/20` }}
          >
            <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="black" color={`${palette}.500`} lineHeight={1}>{pts}</Text>
            <Badge colorPalette={palette} variant="surface" my={2}>{label}</Badge>
            <Text fontSize="xs" color="fg.muted">{sub}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Performance weight */}
      <Heading size="md" textAlign="center" mb={6} color="fg.muted" fontWeight="medium">
        Your Performance Score is weighted:
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={8}>
        {[
          { pct: "65%", label: "This Week",    color: "orange", sub: "Last 7 days of grind" },
          { pct: "25%", label: "Monthly Avg",  color: "teal",   sub: "Consistency over 30 days" },
          { pct: "10%", label: "Legacy Bonus", color: "purple", sub: "All-time — capped at 100 pts" },
        ].map(({ pct, label, color, sub }) => (
          <Box
            key={label}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
            textAlign="center"
          >
            <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="black" color={`${color}.500`} lineHeight={1}>{pct}</Text>
            <Text fontWeight="bold" mt={2}>{label}</Text>
            <Text fontSize="xs" color="fg.muted" mt={1}>{sub}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Streak + Penalty */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <HStack
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          borderWidth={2}
          borderColor={{ base: "yellow.200", _dark: "yellow.700" }}
          bg={{ base: "yellow.50", _dark: "yellow.900/20" }}
          gap={4}
        >
          <Icon fontSize="3xl" color="yellow.500" flexShrink={0}><FaFire /></Icon>
          <Box>
            <Text fontWeight="bold">Streak Multiplier</Text>
            <Text fontSize="sm" color="fg.muted">+2.5%/day · up to <strong>+60% bonus</strong> at 24 days</Text>
          </Box>
        </HStack>
        <HStack
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          borderWidth={2}
          borderColor={{ base: "red.200", _dark: "red.700" }}
          bg={{ base: "red.50", _dark: "red.900/20" }}
          gap={4}
        >
          <Icon fontSize="3xl" color="red.500" flexShrink={0}><FaShieldAlt /></Icon>
          <Box>
            <Text fontWeight="bold">Inactivity Penalty</Text>
            <Text fontSize="sm" color="fg.muted">0 problems → <strong>×0.4</strong> · 5+ problems → no penalty</Text>
          </Box>
        </HStack>
      </SimpleGrid>
    </Container>
  </Box>
);

export default ScoringSection;
