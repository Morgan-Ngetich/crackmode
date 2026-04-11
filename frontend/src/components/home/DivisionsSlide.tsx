import { Box, Button, Badge, Heading, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

const DIVISIONS = [
  { name: "Diamond",  icon: "💎", color: "blue",   minScore: 140 },
  { name: "Platinum", icon: "💿", color: "cyan",   minScore: 75  },
  { name: "Gold",     icon: "🥇", color: "yellow", minScore: 38  },
  { name: "Silver",   icon: "🥈", color: "gray",   minScore: 12  },
  { name: "Bronze",   icon: "🥉", color: "orange", minScore: 0   },
] as const;


const DivisionsSlide = () => {
  const top3 = DIVISIONS.slice(0, 3);
  const bottom2 = DIVISIONS.slice(3);

  return (
    <Box
      w="full"
      maxW="430px"
      minH={{ base: "450px", md: "500px" }}
      p={{ base: 4, md: 6 }}
      borderRadius="xl"
      borderWidth={2}
      borderColor="border.emphasized"
      bg="cardbg"
      animation="fadeIn 0.5s"
    >
      <VStack align="stretch" gap={4} position="relative" h="full">
        <Heading size="lg">Divisions</Heading>
        <Text fontSize="sm" color="fg.muted">
          Climb the ranks based on your weekly grinding velocity!
        </Text>

        <VStack gap={3}>
          {/* Top 3 */}
          <SimpleGrid columns={3} gap={3} w="full">
            {top3.map((div) => (
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
                  <Text fontWeight="bold" fontSize="sm">{div.name}</Text>
                  <Badge colorPalette={div.color} size="sm" variant="surface">
                    {div.minScore}+ pts
                  </Badge>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>

          {/* Bottom 2 centered */}
          <SimpleGrid columns={2} gap={3} w="66%">
            {bottom2.map((div) => (
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
                  <Text fontWeight="bold" fontSize="sm">{div.name}</Text>
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
            <Button w="full">Explore Divisions →</Button>
          </Link>
        </Box>
      </VStack>
    </Box>
  );
};

export default DivisionsSlide;