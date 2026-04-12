import {
  Box, Badge, Container, Heading, HStack, Icon, SimpleGrid, Text, VStack,
} from "@chakra-ui/react";
import { FaTrophy, FaBolt, FaCalendarAlt, FaChartLine } from "react-icons/fa";

const LeaderboardSection = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    position="relative"
    overflow="hidden"
    bg={{ base: "white", _dark: "gray.950" }}
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

    <Container maxW="5xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="yellow" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          Leaderboard
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Two ways to compete.{" "}<br />
          <Text as="span" color="yellow.500">One way to win.</Text>
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6}>
        {[
          {
            icon: <FaTrophy />,
            color: "yellow",
            title: "Global Leaderboard",
            stat: "All-time",
            items: ["Ranked by total difficulty points", "Easy×1 · Medium×3 · Hard×5", "Career legacy — only goes up"],
          },
          {
            icon: <FaBolt />,
            color: "teal",
            title: "Division Leaderboard",
            stat: "Weekly",
            items: ["Ranked by performance score", "65% = this week's grind", "Top = promoted · Bottom = relegated"],
          },
        ].map(({ icon, color, title, stat, items }) => (
          <Box
            key={title}
            p={{ base: 5, md: 7 }}
            borderRadius="2xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
          >
            <HStack mb={4} justify="space-between">
              <HStack gap={3}>
                <Icon fontSize="2xl" color={`${color}.500`}>{icon}</Icon>
                <Text fontWeight="bold" fontSize="lg">{title}</Text>
              </HStack>
              <Badge colorPalette={color} variant="solid" borderRadius="full">{stat}</Badge>
            </HStack>
            <VStack align="start" gap={3}>
              {items.map((item) => (
                <HStack key={item} gap={2}>
                  <Text color={`${color}.500`} fontWeight="black" fontSize="lg" lineHeight={1}>·</Text>
                  <Text fontSize="sm" color="fg.muted">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Sync stat bubbles */}
      <SimpleGrid columns={{ base: 3 }} gap={4}>
        {[
          { icon: <FaCalendarAlt />, value: "24h",     label: "Auto sync",        color: "teal" },
          { icon: <FaBolt />,        value: "30 min",  label: "Manual cooldown",  color: "orange" },
          { icon: <FaChartLine />,   value: "Instant", label: "Recalculation",    color: "blue" },
        ].map(({ icon, value, label, color }) => (
          <Box
            key={label}
            p={{ base: 2, md: 5 }}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
            textAlign="center"
          >
            <Icon fontSize="xl" color={`${color}.500`} mb={2}>{icon}</Icon>
            <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="black" color={`${color}.500`}>{value}</Text>
            <Text fontSize="xs" color="fg.muted" mt={1}>{label}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

export default LeaderboardSection;
