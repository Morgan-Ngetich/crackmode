import {
  Box, Button, Flex, Heading, SimpleGrid,
  Text, HStack, Badge, Icon,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaTrophy, FaBook, FaFire } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

const HeroLeft = () => (
  <Box flex={1} p={{ base: 4, md: 6 }}>
    {/* Tagline pill */}
    <Flex
      bg={{ base: "teal.50", _dark: "teal.900/30" }}
      border="1px solid"
      borderColor={{ base: "teal.200", _dark: "teal.700" }}
      w="fit-content"
      gap={2}
      alignItems="center"
      px={3} py={1}
      borderRadius="full"
      mb={5}
      mx={{ base: "auto", md: 0 }}
    >
      <Icon color={{ base: "teal.500", _dark: "teal.300" }} fontSize="sm">
        <BsFillPatchCheckFill />
      </Icon>
      <Text fontSize="xs" fontWeight="medium" color={{ base: "teal.700", _dark: "teal.300" }}>
        No Gatekeeping. No Flexing. Just Learning Together.
      </Text>
    </Flex>

    {/* Heading — gradient text for the coloured spans */}
    <Heading
      as="h1"
      size={{ base: "3xl", md: "5xl" }}
      mb={5}
      textAlign={{ base: "center", md: "start" }}
      fontWeight="black"
      lineHeight="1.05"
      letterSpacing="tight"
    >
      Master Coding{" "}
      <Text
        as="span"
        bgGradient="to-r"
        gradientFrom="teal.400"
        gradientTo="teal.600"
        bgClip="text"
      >
        Interviews.
      </Text>
      <br />
      <Text
        as="span"
        bgGradient="to-r"
        gradientFrom="orange.400"
        gradientTo="red.400"
        bgClip="text"
      >
        Level Up. Compete.
      </Text>
    </Heading>

    {/* Value props — left accent bar */}
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={3} mt={2} mb={5}>
      {[
        {
          icon: <FaBook />,
          color: "teal",
          title: "Learn Together",
          desc: "LeetCode 75 + System Design with step-by-step walkthroughs. Brute force to optimal.",
        },
        {
          icon: <FaTrophy />,
          color: "orange",
          title: "Compete Daily",
          desc: "Weekly grinding decides your rank. Keep solving or get relegated.",
        },
      ].map(({ icon, color, title, desc }) => (
        <Box
          key={title}
          px={4} py={3}
          borderRadius="xl"
          borderLeftWidth={3}
          borderLeftColor={`${color}.400`}
          borderWidth={1}
          borderColor={{ base: "gray.100", _dark: "gray.700" }}
          bg={{ base: "white", _dark: "gray.800/60" }}
          boxShadow="sm"
        >
          <HStack mb={1.5}>
            <Icon color={`${color}.500`} fontSize="md">{icon}</Icon>
            <Text fontWeight="bold" fontSize="sm">{title}</Text>
          </HStack>
          <Text fontSize="xs" color="fg.muted" lineHeight="tall">{desc}</Text>
        </Box>
      ))}
    </SimpleGrid>

    {/* Scoring pills */}
    <Box px={1} mb={5}>
      <HStack gap={2} flexWrap="wrap" justify={{ base: "center", md: "flex-start" }} mb={1.5}>
        <Badge colorPalette="green" size="md" variant="surface" fontWeight="bold">Easy = 1 pt</Badge>
        <Badge colorPalette="yellow" size="md" variant="surface" fontWeight="bold">Medium = 3 pts</Badge>
        <Badge colorPalette="red" size="md" variant="surface" fontWeight="bold">Hard = 5 pts</Badge>
      </HStack>
      <Text fontSize="xs" color="fg.muted" textAlign={{ base: "center", md: "left" }}>
        <Text as="span" fontWeight="semibold">Weekly velocity</Text> (65%) decides your division. Grind more, rank higher.
      </Text>
    </Box>

    {/* CTAs — clear hierarchy */}
    <Flex gap={3} justify={{ base: "center", md: "flex-start" }} flexWrap="wrap" mb={6}>
      <Link to="/docs">
        <Button
          size={{ base: "md", md: "lg" }}
          colorPalette="teal"
          variant="solid"
          fontWeight="bold"
          boxShadow={{ _dark: "0 0 20px rgba(20,184,166,0.35)" }}
          _hover={{ transform: "translateY(-1px)", boxShadow: "0 8px 24px rgba(20,184,166,0.4)" }}
          transition="all 0.2s"
        >
          <Icon fontSize="lg"><FaBook /></Icon>
          Start Learning
        </Button>
      </Link>
      <Link to="/leaderboard">
        <Button size={{ base: "md", md: "lg" }} colorPalette="orange" variant="outline" fontWeight="semibold">
          <Icon fontSize="lg"><FaTrophy /></Icon>
          View Leaderboard
        </Button>
      </Link>
      <a href="https://chat.whatsapp.com/Biz5sc2ow3v8Mg2aId6yOH" target="_blank" rel="noopener noreferrer">
        <Button size={{ base: "md", md: "lg" }} variant="outline" color="fg.muted">
          <Icon fontSize="lg" color="green.500"><IoLogoWhatsapp /></Icon>
          Community
        </Button>
      </a>
    </Flex>

    {/* Stats bar */}
    <Box
      bg={{ base: "gray.900", _dark: "gray.800" }}
      borderRadius="2xl"
      borderWidth={1}
      borderColor={{ base: "gray.700", _dark: "gray.600" }}
      boxShadow={{ base: "xl", _dark: "0 4px 32px rgba(0,0,0,0.5)" }}
      p={{ base: 3, md: 5 }}
      textAlign="center"
    >
      <SimpleGrid columns={4} gap={4}>
        <Box>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="black"
            bgGradient="to-r"
            gradientFrom="blue.400"
            gradientTo="cyan.400"
            bgClip="text"
          >
            600+
          </Text>
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">Members</Text>
        </Box>
        <Box>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="black"
            bgGradient="to-r"
            gradientFrom="purple.400"
            gradientTo="pink.400"
            bgClip="text"
          >
            Daily
          </Text>
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">Challenges</Text>
        </Box>
        <Box>
          <Text
            fontSize={{ base: "xl", md: "2xl" }}
            fontWeight="black"
            bgGradient="to-r"
            gradientFrom="teal.400"
            gradientTo="green.400"
            bgClip="text"
          >
            75+
          </Text>
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">LC Problems</Text>
        </Box>
        <Box my="auto">
          <HStack gap={1} justify="center" align="baseline">
            <Text
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="black"
              color="orange.400"
              lineHeight="1"
            >
              9:30
            </Text>
            <Text fontSize={{ base: "2xs", md: "xs" }} color="orange.400" fontWeight="bold">PM</Text>
          </HStack>
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">Daily Session</Text>
        </Box>
      </SimpleGrid>
    </Box>

    {/* Streak indicator */}
    <HStack justify={{ base: "center", md: "flex-start" }} gap={1.5} mt={3} opacity={0.7}>
      <Icon fontSize="xs" color="orange.400"><FaFire /></Icon>
      <Text fontSize="xs" color="fg.subtle">Daily sessions at 9:30 PM · Join tonight</Text>
    </HStack>
  </Box>
);

export default HeroLeft;
