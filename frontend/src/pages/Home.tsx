import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  HStack,
  VStack,
  Badge,
  Icon
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FaTrophy, FaBook, FaFire } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import CrackModeHeader from "@/components/common/CrackModeHeader";
import ViewCalendar from "@/components/calendar/ViewCalendar";
import { useLeaderboard } from "@/hooks/crackmode/leaderboard/useCrackmode";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const { data: leaderboardData } = useLeaderboard({ limit: 5 });

  const checkerbgColor = { base: 'gray.200', _dark: 'gray.700' };
  const gradientFrom = { base: 'white', _dark: 'bg' };
  const gradientTo = { base: 'gray.150', _dark: 'gray.800' };

  // Auto-switch carousel every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const topPlayers = leaderboardData?.profiles.slice(0, 5) || [];

  return (
    <>
      <CrackModeHeader mode="home" />
      <Box
        display="flex"
        minH="91vh"
        bgGradient="to-br"
        gradientFrom={gradientFrom}
        gradientTo={gradientTo}
        alignItems="center"
      >
        <Container w="100%" mt={{ base: 0, lg: 0 }} p={0}>
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="center"
            w="100%"
            gap={8}
          >
            {/* Left Section (Text + CTA) */}
            <Box
              flex={1}
              p={{ base: 4, md: 6 }}
            >
              {/* Tagline */}
              <Flex
                bgColor={checkerbgColor}
                w="fit-content"
                gap={{ base: 1, md: 4 }}
                alignItems="center"
                px={3}
                py={1}
                borderRadius="full"
                mb={0}
                mx={{ base: "auto", md: 0 }}
              >
                <Icon color={{ base: "yellow.500", _dark: "yellow.300" }}>
                  <BsFillPatchCheckFill />
                </Icon>
                <Text fontSize={"xs"}>
                  No Gatekeeping. No Flexing. Just Learning Together.
                </Text>
              </Flex>

              {/* Hero Heading */}
              <Heading
                as="h1"
                size={{ base: "3xl", md: "5xl" }}
                mb={4}
                textAlign={{ base: "center", md: "start" }}
                fontWeight="bold"
              >
                Master Coding Interviews.{" "}
                <Text as="span" color="teal.500">
                  Level Up.
                </Text>
                <Text as="span" color="orange.400" ml={2}>
                  Compete.
                </Text>{" "}
              </Heading>

              {/* Two-Column Value Props */}
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mt={6} mb={4}>
                <Box
                  px={3}
                  py={2}
                  borderRadius="lg"
                  borderWidth={2}
                  borderColor={{ base: "teal.200", _dark: "teal.700" }}
                  bg={{ base: "teal.50", _dark: "teal.900/20" }}
                >
                  <HStack mb={2}>
                    <Icon color={{ base: "teal.600", _dark: "teal.400" }} fontSize={{ base: "lg", md: "xl" }}>
                      <FaBook />
                    </Icon>
                    <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                      Learn Together
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="fg.muted">
                    LeetCode 75 + System Design with detailed explanations. From brute force to optimized.
                  </Text>
                </Box>

                <Box
                  px={3}
                  py={2}
                  borderRadius="lg"
                  borderWidth={2}
                  borderColor={{ base: "orange.200", _dark: "orange.700" }}
                  bg={{ base: "orange.50", _dark: "orange.900/20" }}
                >
                  <HStack mb={2}>
                    <Icon color={{ base: "orange.600", _dark: "orange.400" }} fontSize={{ base: "lg", md: "xl" }}>
                      <FaTrophy />
                    </Icon>
                    <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
                      Compete Daily
                    </Text>
                  </HStack>
                  <Text fontSize="xs" color="fg.muted">
                    Weekly grinding determines your rank. Keep grinding or get relegated.
                  </Text>
                </Box>
              </SimpleGrid>

              {/* Scoring System */}
              <Box
                px={4}
                mb={6}
              >
                <VStack align={{ base: "center", md: "start" }} gap={2} >
                  <Text fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }}>
                    Simple Scoring System
                  </Text>
                  <HStack gap={4} flexWrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                    <Badge colorPalette="green" size={{ base: "md", md: "lg" }} variant={"surface"}>Easy = 1pt</Badge>
                    <Badge colorPalette="yellow" size={{ base: "md", md: "lg" }} variant={"surface"}>Medium = 3pts</Badge>
                    <Badge colorPalette="red" size={{ base: "md", md: "lg" }} variant={"surface"}>Hard = 5pts</Badge>
                  </HStack>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="fg.muted" textAlign={{ base: "center", md: "left" }}>
                    Your <strong>weekly velocity</strong> determines your division. Solve more, rank higher.
                  </Text>
                </VStack>
              </Box>

              {/* CTA Buttons */}
              <Flex
                gap={3}
                justify={{ base: "center", md: "flex-start" }}
                flexWrap="wrap"
              >
                <Link to="/docs">
                  <Button size={{ base: "md", md: "lg" }} colorPalette="teal" variant={"outline"}>
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

              {/* Stats Section */}
              <Box
                bg="gray.700"
                borderRadius="lg"
                boxShadow="lg"
                p={{ base: 2, md: 6 }}
                // py={{ base: 4, lg: 7 }}
                textAlign="center"
                mt={6}
              >
                <SimpleGrid columns={4} gap={4}>
                  {/* Active Members */}
                  <Box>
                    <Text
                      fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                      fontWeight="bold"
                      color="#3498EB"
                    >
                      600+
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="white">
                      Active CrackModes
                    </Text>
                  </Box>

                  {/* Daily Problems */}
                  <Box>
                    <Text
                      fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                      fontWeight="bold"
                      color="#C39BBF"
                    >
                      Daily
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="white">
                      Coding Challenges
                    </Text>
                  </Box>

                  {/* LeetCode Coverage */}
                  <Box>
                    <Text
                      fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                      fontWeight="bold"
                      color="#02adad"
                    >
                      75+
                    </Text>
                    <Text fontSize={{ base: "xs", md: "sm" }} color="white">
                      LeetCode Problems
                    </Text>
                  </Box>

                  {/* Sessions */}
                  <Box my="auto">
                    <Text
                      fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                      fontWeight="bold"
                      color="orange"
                      lineHeight={"0.8"}
                    >
                      9:30 <span style={{ fontSize: "15px" }}>PM</span>
                    </Text>
                    {/* <Text fontSize={{ base: "sm", md: "md" }} color="white">
                    Daily Sessions
                  </Text> */}
                  </Box>
                </SimpleGrid>
              </Box>
            </Box>

            {/* Right Section (Auto-Switching Carousel) */}
            {/* Right Section (Auto-Switching Carousel) */}
            <Box
              flex={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="relative"
              w="full"
              px={currentSlide === 0 ? 0 : 3}
              pb={8}
            >
              <Flex w="full" justify="center">
                {/* Slide 1: Calendar */}
                {currentSlide === 0 && (
                  <Box
                    animation="fadeIn 0.5s"
                    w="full"
                    maxW="500px"
                  >
                    <ViewCalendar />
                  </Box>
                )}

                {/* Slide 2: Mini Leaderboard */}
                {currentSlide === 1 && (
                  <Box
                    animation="fadeIn 0.5s"
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
                      <HStack justify="space-between" mb={4}>
                        <Heading size="lg">
                          <Icon color="yellow.400"><FaTrophy /></Icon> Top Grinders
                        </Heading>
                      </HStack>

                      {topPlayers.map((player, index) => (
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
                            <Text fontSize="xl" fontWeight="bold">
                              #{player.rank}
                            </Text>
                            <Text fontWeight="semibold">{player.leetcode_username}</Text>
                          </HStack>
                          <HStack gap={2}>
                            <Icon color="orange.400" fontSize="sm"><FaFire /></Icon>
                            <Text fontWeight="bold">{player.weekly_solves}</Text>
                          </HStack>
                        </HStack>
                      ))}

                      <Box position="absolute" bottom={0} w="100%">
                        <Link to="/leaderboard">
                          <Button w="full">
                            View Full Leaderboard →
                          </Button>
                        </Link>
                      </Box>
                    </VStack>
                  </Box>
                )}

                {/* Slide 3: Division Preview */}
                {currentSlide === 2 && (
                  <Box
                    animation="fadeIn 0.5s"
                    w="full"
                    maxW="430px"
                    minH={{ base: "450px", md: "500px" }}
                    p={{ base: 4, md: 6 }}
                    borderRadius="xl"
                    borderWidth={2}
                    borderColor="border.emphasized"
                    bg="cardbg"
                  >
                    <VStack align="stretch" gap={4} position="relative" h="full">
                      <Heading size="lg">Divisions</Heading>
                      <Text fontSize="sm" color="fg.muted">
                        Climb the ranks based on your weekly grinding velocity!
                      </Text>

                      {/* Grid Layout: 3 cards top row, 2 cards bottom row centered */}
                      <VStack gap={3}>
                        {/* Top Row - 3 cards */}
                        <SimpleGrid columns={3} gap={3} w="full">
                          {[
                            { name: 'Diamond', icon: '💎', color: 'blue', minScore: 150 },
                            { name: 'Platinum', icon: '💿', color: 'cyan', minScore: 80 },
                            { name: 'Gold', icon: '🥇', color: 'yellow', minScore: 40 },
                          ].map((div) => (
                            <Box
                              key={div.name}
                              p={3}
                              borderRadius="md"
                              borderWidth={2}
                              borderColor={{ base: `${div.color}.300`, _dark: `${div.color}.700` }}
                              bg={{ base: `${div.color}.50`, _dark: `${div.color}.900/20` }}
                              textAlign="center"
                            >
                              <VStack gap={1}>
                                <Text fontSize="2xl">{div.icon}</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                  {div.name}
                                </Text>
                                <Badge colorPalette={div.color} size="sm" variant="surface">
                                  {div.minScore}+ pts
                                </Badge>
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>

                        {/* Bottom Row - 2 cards centered */}
                        <SimpleGrid columns={2} gap={3} w="66%">
                          {[
                            { name: 'Silver', icon: '🥈', color: 'gray', minScore: 15 },
                            { name: 'Bronze', icon: '🥉', color: 'orange', minScore: 0 },
                          ].map((div) => (
                            <Box
                              key={div.name}
                              p={3}
                              borderRadius="md"
                              borderWidth={2}
                              borderColor={{ base: `${div.color}.300`, _dark: `${div.color}.700` }}
                              bg={{ base: `${div.color}.50`, _dark: `${div.color}.900/20` }}
                              textAlign="center"
                            >
                              <VStack gap={1}>
                                <Text fontSize="2xl">{div.icon}</Text>
                                <Text fontWeight="bold" fontSize="sm">
                                  {div.name}
                                </Text>
                                <Badge colorPalette={div.color} size="sm" variant="surface">
                                  {div.minScore}+ pts
                                </Badge>
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>
                      </VStack>

                      <Box position="absolute" bottom={0} w="full">
                        <Link to="/leaderboard/divisions">
                          <Button w="full">
                            Explore Divisions →
                          </Button>
                        </Link>
                      </Box>
                    </VStack>
                  </Box>
                )}
              </Flex>

              {/* Carousel Dots - NOW INSIDE WITH PROPER POSITIONING */}
              <HStack
                position="absolute"
                bottom={2}
                left="50%"
                transform="translateX(-50%)"
                gap={2}
                zIndex={10}
              >
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    w={currentSlide === index ? 8 : 2}
                    h={2}
                    borderRadius="full"
                    bg={currentSlide === index ? "teal.500" : "gray.400"}
                    transition="all 0.3s"
                    cursor="pointer"
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </HStack>
            </Box>
          </Flex>
        </Container>
      </Box >

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default Home;