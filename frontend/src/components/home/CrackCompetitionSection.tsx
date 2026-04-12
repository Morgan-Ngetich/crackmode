import {
  Box, Badge, Button, Container, Flex, Heading, HStack, Icon, SimpleGrid, Text, VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FaTrophy, FaBolt, FaCalendarAlt } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

const CrackCompetitionSection = () => (
  <Box
    as="section"
    pt={{ base: 20, md: 28 }}
    position="relative"
    overflow="hidden"
    bg={{ base: "white", _dark: "gray.950" }}
  >
    {/* Background glows */}
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

    <Container maxW="5xl" position="relative">
      <VStack gap={14} align="stretch">

        {/* Header */}
        <VStack gap={4} textAlign="center">
          <Badge
            colorPalette="yellow"
            variant="solid"
            px={4}
            py={1}
            borderRadius="full"
            fontWeight="semibold"
            boxShadow={{ base: "sm", _dark: "0 0 20px rgba(255,215,0,0.6)" }}
            fontSize="lg"
          >
            ⚡ LIVE COMPETITION
          </Badge>

          <Heading
            size={{ base: "2xl", md: "4xl" }}
            fontWeight="black"
            letterSpacing="tight"
            color="green.500"
          >
            CRACK
            <Text as="span" color="yellow.500">MPETITION</Text>
          </Heading>

          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color={{ base: "gray.600", _dark: "gray.400" }}
            maxW="2xl"
          >
            Grind. Solve. Elevate.<br />
            <Text as="span" color={{ base: "yellow.600", _dark: "yellow.400" }} fontWeight="bold">
              April 20 → June 20, 2026
            </Text>
          </Text>

          <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.500" }}>
            No excuses. Just problems, logic, and speed ⚡
          </Text>
        </VStack>

        <Flex
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 12, lg: 16 }}
          align={{ base: "center", md: "start" }}
        >
          {/* Prize Pool */}
          <Box flex="1.2" textAlign="center">
            <VStack gap={8}>
              <Heading size="lg" fontWeight="black" color={{ base: "gray.800", _dark: "white" }}>
                🏆 Prize Pool
              </Heading>

              <Flex align="end" justify="center" gap={{ base: 4, md: 8 }}>
                {[
                  { place: "2nd", amount: "1500 KES", color: "gray",   height: { base: "140px", md: "180px" } },
                  { place: "1st", amount: "2000 KES", color: "yellow", height: { base: "180px", md: "240px" } },
                  { place: "3rd", amount: "1000 KES", color: "orange", height: { base: "120px", md: "160px" } },
                ].map((p) => (
                  <Box
                    key={p.place}
                    w={{ base: "90px", md: "120px" }}
                    h={p.height}
                    borderRadius="2xl"
                    display="flex"
                    flexDir="column"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                    position="relative"
                    bg={{ base: `${p.color}.100`, _dark: `${p.color}.400` }}
                    color={{ base: `${p.color}.800`, _dark: "black" }}
                    border="1px solid"
                    borderColor={{ base: `${p.color}.200`, _dark: `${p.color}.300` }}
                    transition="all 0.3s ease"
                    _hover={{ transform: "translateY(-8px) scale(1.06)" }}
                    boxShadow={{
                      base: "md",
                      _dark:
                        p.place === "1st" ? "0 0 40px rgba(255,215,0,0.9)"
                        : p.place === "2nd" ? "0 0 25px rgba(200,200,200,0.6)"
                        : "0 0 25px rgba(205,127,50,0.6)",
                    }}
                  >
                    {p.place === "1st" && (
                      <Box position="absolute" top="-60px" right="-40px" rotate="30deg" fontSize="6xl">
                        👑
                      </Box>
                    )}
                    <Text fontSize="lg" fontWeight="black">{p.place}</Text>
                    <Text fontSize="lg">{p.amount}</Text>
                  </Box>
                ))}
              </Flex>

              <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
                Top 3 get paid 💰
              </Text>
            </VStack>
          </Box>

          {/* Rules */}
          <Box flex="1">
            <SimpleGrid columns={{ base: 1 }} gap={6}>
              {[
                {
                  icon: <FaCalendarAlt />,
                  color: "blue",
                  title: "Competition Window",
                  desc: "61 days of pure grind. Only progress made during this period counts.",
                },
                {
                  icon: <FaBolt />,
                  color: "yellow",
                  title: "Points System",
                  desc: "Easy = 1pt · Medium = 3pts · Hard = 5pts. Streaks unlock bonus multipliers.",
                },
                {
                  icon: <FaTrophy />,
                  color: "orange",
                  title: "Winner Takes It",
                  desc: "Top scorer wins. No shortcuts. No luck. Just raw consistency.",
                },
              ].map(({ icon, color, title, desc }) => (
                <Box
                  key={title}
                  p={6}
                  borderRadius="2xl"
                  bg={{ base: "white", _dark: "whiteAlpha.50" }}
                  border="1px solid"
                  borderColor={{ base: "gray.200", _dark: "whiteAlpha.200" }}
                  backdropFilter="blur(10px)"
                  transition="all 0.3s ease"
                  _hover={{
                    transform: "translateY(-4px)",
                    borderColor: `${color}.400`,
                    boxShadow: { base: "md", _dark: "0 0 25px rgba(255,255,255,0.08)" },
                  }}
                >
                  <VStack align="start" gap={3}>
                    <HStack>
                      <Icon fontSize="xl" color={`${color}.400`}>{icon}</Icon>
                      <Text fontWeight="bold" fontSize="md" color={{ base: "gray.800", _dark: "white" }}>
                        {title}
                      </Text>
                    </HStack>
                    <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>{desc}</Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </Flex>

        {/* CTA */}
        <Flex justify="center" gap={5} flexWrap="wrap" pt={6}>
          <Link to="/leaderboard" search={{ tab: "competition" } as never}>
            <Button size="lg" px={8} colorPalette="orange" variant="outline">
              🏆 View Leaderboard
            </Button>
          </Link>
          <a href="https://chat.whatsapp.com/Biz5sc2ow3v8Mg2aId6yOH" target="_blank" rel="noopener noreferrer">
            <Button size="lg" colorPalette="green" variant="outline">
              <Icon><IoLogoWhatsapp /></Icon>
              Join WhatsApp
            </Button>
          </a>
        </Flex>
      </VStack>
    </Container>
  </Box>
);

export default CrackCompetitionSection;
