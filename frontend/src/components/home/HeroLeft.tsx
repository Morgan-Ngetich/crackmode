import {
  Box, Button, Flex, Heading, SimpleGrid,
  Text, HStack, VStack, Badge, Icon,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaTrophy, FaBook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

const HeroLeft = () => (
  <Box flex={1} p={{ base: 4, md: 6 }}>
    {/* Tagline */}
    <Flex
      bgColor={{ base: "gray.200", _dark: "gray.700" }}
      w="fit-content"
      gap={{ base: 1, md: 4 }}
      alignItems="center"
      px={3} py={1}
      borderRadius="full"
      mb={0}
      mx={{ base: "auto", md: 0 }}
    >
      <Icon color={{ base: "yellow.500", _dark: "yellow.300" }}>
        <BsFillPatchCheckFill />
      </Icon>
      <Text fontSize="xs">No Gatekeeping. No Flexing. Just Learning Together.</Text>
    </Flex>

    {/* Heading */}
    <Heading
      as="h1"
      size={{ base: "3xl", md: "5xl" }}
      mb={4}
      textAlign={{ base: "center", md: "start" }}
      fontWeight="bold"
    >
      Master Coding Interviews.{" "}
      <Text as="span" color="teal.500">Level Up.</Text>
      <Text as="span" color="orange.400" ml={2}>Compete.</Text>
    </Heading>

    {/* Value Props */}
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={6} mb={4}>
      <Box px={3} py={2} borderRadius="lg" borderWidth={2}
        borderColor={{ base: "teal.200", _dark: "teal.700" }}
        bg={{ base: "teal.50", _dark: "teal.900/20" }}>
        <HStack mb={2}>
          <Icon color={{ base: "teal.600", _dark: "teal.400" }} fontSize={{ base: "lg", md: "xl" }}>
            <FaBook />
          </Icon>
          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>Learn Together</Text>
        </HStack>
        <Text fontSize="xs" color="fg.muted">
          LeetCode 75 + System Design in detailed explanation. From brute force to optimized.
        </Text>
      </Box>

      <Box px={3} py={2} borderRadius="lg" borderWidth={2}
        borderColor={{ base: "orange.200", _dark: "orange.700" }}
        bg={{ base: "orange.50", _dark: "orange.900/20" }}>
        <HStack mb={2}>
          <Icon color={{ base: "orange.600", _dark: "orange.400" }} fontSize={{ base: "lg", md: "xl" }}>
            <FaTrophy />
          </Icon>
          <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>Compete Daily</Text>
        </HStack>
        <Text fontSize="xs" color="fg.muted">
          Weekly grinding determines your rank. Keep grinding or get relegated.
        </Text>
      </Box>
    </SimpleGrid>

    {/* Scoring System */}
    <Box px={4} mb={6}>
      <VStack align={{ base: "center", md: "start" }} gap={2}>
        <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }}>Simple Scoring System</Text>
        <HStack gap={4} flexWrap="wrap" justify={{ base: "center", md: "flex-start" }}>
          <Badge colorPalette="green" size={{ base: "md", md: "lg" }} variant="surface">Easy = 1pt</Badge>
          <Badge colorPalette="yellow" size={{ base: "md", md: "lg" }} variant="surface">Medium = 3pts</Badge>
          <Badge colorPalette="red" size={{ base: "md", md: "lg" }} variant="surface">Hard = 5pts</Badge>
        </HStack>
        <Text fontSize={{ base: "xs", md: "sm" }} color="fg.muted" textAlign={{ base: "center", md: "left" }}>
          Your <strong>weekly velocity</strong> (65% of your score) determines your division. Solve more, rank higher.
        </Text>
      </VStack>
    </Box>

    {/* CTAs */}
    <Flex gap={3} justify={{ base: "center", md: "flex-start" }} flexWrap="wrap">
      <Link to="/docs">
        <Button size={{ base: "md", md: "lg" }} colorPalette="teal" variant="outline">
          <Icon fontSize="lg"><FaBook /></Icon>
          Start Learning
        </Button>
      </Link>
      <Link to="/leaderboard">
        <Button size={{ base: "md", md: "lg" }} colorPalette="orange" variant="outline">
          <Icon fontSize="lg"><FaTrophy /></Icon>
          View Leaderboard
        </Button>
      </Link>
      <a href="https://chat.whatsapp.com/Biz5sc2ow3v8Mg2aId6yOH" target="_blank" rel="noopener noreferrer">
        <Button size={{ base: "md", md: "lg" }} variant="surface">
          <Icon fontSize="lg" color="green.500"><IoLogoWhatsapp /></Icon>
          Join Community
        </Button>
      </a>
    </Flex>

    {/* Stats */}
    <Box bg="gray.700" borderRadius="lg" boxShadow="lg" p={{ base: 2, md: 6 }} textAlign="center" mt={6}>
      <SimpleGrid columns={4} gap={4}>
        <Box>
          <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="bold" color="#3498EB">600+</Text>
          <Text fontSize={{ base: "xs", md: "sm" }} color="white">Active CrackModes</Text>
        </Box>
        <Box>
          <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="bold" color="#C39BBF">Daily</Text>
          <Text fontSize={{ base: "xs", md: "sm" }} color="white">Coding Challenges</Text>
        </Box>
        <Box>
          <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} fontWeight="bold" color="#02adad">75+</Text>
          <Text fontSize={{ base: "xs", md: "sm" }} color="white">LeetCode Problems</Text>
        </Box>
        <Box my="auto">
          <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }} fontWeight="bold" color="orange" lineHeight="0.8">
            9:30 <span style={{ fontSize: "15px" }}>PM</span>
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  </Box>
);

export default HeroLeft;