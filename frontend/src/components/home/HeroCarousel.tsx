import { useState, useEffect } from "react";
import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import ViewCalendar from "@/components/calendar/ViewCalendar";
import LeaderboardSlide from "./LeaderboardSlide";
import DivisionsSlide from "./DivisionsSlide";
import { useLeaderboard } from "@/hooks/crackmode/leaderboard/useCrackmode";

const SLIDES = [
  { label: "Calendar" },
  { label: "Leaderboard" },
  { label: "Divisions" },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(1);
  const { data: leaderboardData, isLoading } = useLeaderboard({ limit: 5 });

  const topPlayers = leaderboardData?.profiles.slice(0, 5) ?? [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      flex={1}
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="relative"
      w="full"
      pb={12}
    >
      {/* Slide area */}
      <Box
        w="full"
        overflow="hidden"
        p={currentSlide === 0 ? 0 : 2}
        minH="380px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        <Flex w="full" justify="center">
          {currentSlide === 0 && (
            <Box animation="fadeIn 0.4s" w="full">
              <ViewCalendar />
            </Box>
          )}
          {currentSlide === 1 && (
            <Box animation="fadeIn 0.4s" w="full" display="flex" justifyContent="center">
              <LeaderboardSlide players={topPlayers} isLoading={isLoading} />
            </Box>
          )}
          {currentSlide === 2 && (
            <Box animation="fadeIn 0.4s" w="full" display="flex" justifyContent="center">
              <DivisionsSlide />
            </Box>
          )}
        </Flex>
      </Box>

      {/* Labeled dots */}
      <HStack
        position="absolute"
        bottom={2}
        left="50%"
        transform="translateX(-50%)"
        gap={1}
        zIndex={10}
      >
        {SLIDES.map((slide, index) => {
          const active = currentSlide === index;
          return (
            <Box
              key={slide.label}
              display="flex"
              alignItems="center"
              gap={1}
              px={active ? 3 : 2}
              py={1}
              borderRadius="full"
              bg={active ? "teal.500" : { base: "gray.200", _dark: "gray.700" }}
              cursor="pointer"
              onClick={() => setCurrentSlide(index)}
              transition="all 0.3s"
              overflow="hidden"
            >
              <Box
                w={2}
                h={2}
                borderRadius="full"
                bg={active ? "white" : { base: "gray.400", _dark: "gray.500" }}
                flexShrink={0}
              />
              {active && (
                <Text fontSize="2xs" fontWeight="bold" color="white" whiteSpace="nowrap">
                  {slide.label}
                </Text>
              )}
            </Box>
          );
        })}
      </HStack>
    </Box>
  );
};

export default HeroCarousel;
