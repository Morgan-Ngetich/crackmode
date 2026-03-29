import { useState, useEffect } from "react";
import { Box, Flex, HStack } from "@chakra-ui/react";
import ViewCalendar from "@/components/calendar/ViewCalendar";
import LeaderboardSlide from "./LeaderboardSlide";
import DivisionsSlide from "./DivisionsSlide";
import { useLeaderboard } from "@/hooks/crackmode/leaderboard/useCrackmode";

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
      px={currentSlide === 0 ? 0 : 3}
      pb={8}
    >
      <Flex w="full" justify="center">
        {currentSlide === 0 && (
          <Box animation="fadeIn 0.5s" w="full">
            <ViewCalendar />
          </Box>
        )}

        {currentSlide === 1 && (
          <LeaderboardSlide players={topPlayers} isLoading={isLoading} />
        )}

        {currentSlide === 2 && (
          <DivisionsSlide />
        )}
      </Flex>

      {/* Dots */}
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
  );
};

export default HeroCarousel;