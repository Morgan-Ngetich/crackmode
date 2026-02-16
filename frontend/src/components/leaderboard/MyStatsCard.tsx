import { Box, HStack, VStack, Text, Icon, SimpleGrid } from '@chakra-ui/react';
import { FaFire, FaTrophy, FaBolt } from 'react-icons/fa';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
import { MdEmojiEvents } from 'react-icons/md';
import { CrackModeProfilePublic } from '@/client';

const DIVISION_ICONS = {
  Diamond: '💎',
  Platinum: '🏆',
  Gold: '🥇',
  Silver: '🥈',
  Bronze: '🥉',
};

interface MyStatsCardProps {
  profile: CrackModeProfilePublic;
  promotionStatus?: {
    status: 'promotion' | 'relegation' | 'safe';
    ranksToPromotion?: number;
  } | null;
}

export function MyStatsCard({ profile, promotionStatus }: MyStatsCardProps) {
  return (
    <Box w="full">
      <SimpleGrid columns={{ base: 2, md: 5 }} gap={{base: 3, md: 4}} w="full">
        {/* Rank Card */}
        <Box
          bg="cardbg"
          borderRadius="xl"
          border="1px solid"
          borderColor="border.emphasized"
          p={4}
          position="relative"
          overflow="hidden"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
          transition="all 0.2s"
          cursor="default"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, transparent 40%, rgba(59, 130, 246, 0.1) 100%)',
            pointerEvents: 'none',
          }}
        >
          <VStack align="stretch" gap={3} position="relative" zIndex={1}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="fg.muted" fontWeight="500">
                Division
              </Text>
              <Box
                p={2}
                borderRadius="lg"
                bg="rgba(59, 130, 246, 0.1)"
              >
                <Icon color={{ base: "blue.500", _dark: "blue.400" }} fontSize="lg">
                  <FaTrophy />
                </Icon>
              </Box>
            </HStack>

            <VStack align="stretch" gap={1}>
              <HStack gap={2} align="baseline">
                <Text fontSize="2xl">
                  {DIVISION_ICONS[profile.division as keyof typeof DIVISION_ICONS]}
                </Text>
                <Text
                  fontSize={{base: "2xl", md: "3xl"}}
                  fontWeight="700"
                >
                  {profile.division}
                </Text>
              </HStack>

              <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                Rank #{profile.division_rank}
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* 🎮 Performance Score Card (FIFA System) */}
        <Box
          bg="cardbg"
          borderRadius="xl"
          border="1px solid"
          borderColor="border.emphasized"
          p={4}
          position="relative"
          overflow="hidden"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
          transition="all 0.2s"
          cursor="default"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.4) 0%, transparent 40%, rgba(234, 179, 8, 0.1) 100%)',
            pointerEvents: 'none',
          }}
        >
          <VStack align="stretch" gap={3} position="relative" zIndex={1}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="fg.muted" fontWeight="500">
                Performance
              </Text>
              <Box
                p={2}
                borderRadius="lg"
                bg="rgba(234, 179, 8, 0.1)"
              >
                <Icon color={{ base: "yellow.600", _dark: "yellow.400" }} fontSize="lg">
                  <FaBolt />
                </Icon>
              </Box>
            </HStack>

            <VStack align="stretch" gap={1}>
              <Text
                fontSize="3xl"
                fontWeight="700"
              >
                {profile.performance_score}
              </Text>

              <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                Velocity score
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Streak Card */}
        <Box
          bg="cardbg"
          borderRadius="xl"
          border="1px solid"
          borderColor="border.emphasized"
          p={4}
          position="relative"
          overflow="hidden"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
          transition="all 0.2s"
          cursor="default"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.4) 0%, transparent 40%, rgba(251, 146, 60, 0.1) 100%)',
            pointerEvents: 'none',
          }}
        >
          <VStack align="stretch" gap={3} position="relative" zIndex={1}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="fg.muted" fontWeight="500">
                Streak
              </Text>
              <Box
                p={2}
                borderRadius="lg"
                bg="rgba(251, 146, 60, 0.1)"
              >
                <Icon color="orange.400" fontSize="lg">
                  <FaFire />
                </Icon>
              </Box>
            </HStack>

            <VStack align="stretch" gap={1}>
              <HStack gap={2} align="baseline">
                <Text
                  fontSize="3xl"
                  fontWeight="700"
                >
                  {profile.current_streak}
                </Text>
                <Text fontSize="sm" color="fg.muted" fontWeight="500">
                  days
                </Text>
              </HStack>

              <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                Best: {profile.longest_streak} days
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Weekly Progress Card */}
        <Box
          bg="cardbg"
          borderRadius="xl"
          border="1px solid"
          borderColor="border.emphasized"
          p={4}
          position="relative"
          overflow="hidden"
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg'
          }}
          transition="all 0.2s"
          cursor="default"
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.4) 0%, transparent 40%, rgba(34, 197, 94, 0.1) 100%)',
            pointerEvents: 'none',
          }}
        >
          <VStack align="stretch" gap={3} position="relative" zIndex={1}>
            <HStack justify="space-between">
              <Text fontSize="sm" color="fg.muted" fontWeight="500">
                This Week
              </Text>
              <Box
                p={2}
                borderRadius="lg"
                bg="rgba(34, 197, 94, 0.1)"
              >
                <Icon color={{ base: "green.500", _dark: "green.400" }} fontSize="lg">
                  <MdEmojiEvents />
                </Icon>
              </Box>
            </HStack>

            <VStack align="stretch" gap={1}>
              <HStack gap={2} align="baseline">
                <Text
                  fontSize="3xl"
                  fontWeight="700"
                >
                  {profile.weekly_solves}
                </Text>
                <Text fontSize="sm" color="fg.muted" fontWeight="500">
                  solved
                </Text>
              </HStack>

              <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                Keep grinding! ⚡
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Promotion Status Card (if applicable) */}
        {promotionStatus && (
          <Box
            gridColumn={{ base: "span 2", md: "span 1" }}
            bg="cardbg"
            borderRadius="xl"
            p={4}
            position="relative"
            overflow="hidden"
            borderWidth={2}
            borderColor={
              promotionStatus.status === 'promotion'
                ? 'green.600'
                : promotionStatus.status === 'relegation'
                  ? 'red.600'
                  : 'border.emphasized'
            }
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg'
            }}
            transition="all 0.2s"
            cursor="default"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: promotionStatus.status === 'promotion'
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, transparent 50%, rgba(34, 197, 94, 0.15) 100%)'
                : promotionStatus.status === 'relegation'
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, transparent 50%, rgba(239, 68, 68, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, transparent 50%, rgba(59, 130, 246, 0.1) 100%)',
              pointerEvents: 'none',
            }}
          >
            <VStack align="stretch" gap={3} position="relative" zIndex={1}>
              <HStack justify="space-between">
                <Text fontSize="sm" color="fg.muted" fontWeight="500">
                  Status
                </Text>
                <Box
                  p={2}
                  borderRadius="lg"
                  bg={
                    promotionStatus.status === 'promotion'
                      ? 'rgba(34, 197, 94, 0.1)'
                      : promotionStatus.status === 'relegation'
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(59, 130, 246, 0.1)'
                  }
                >
                  <Icon
                    color={
                      promotionStatus.status === 'promotion'
                        ? 'green.400'
                        : promotionStatus.status === 'relegation'
                          ? 'red.400'
                          : 'blue.400'
                    }
                    fontSize="lg"
                  >
                    {promotionStatus.status === 'promotion' ? (
                      <BiTrendingUp />
                    ) : promotionStatus.status === 'relegation' ? (
                      <BiTrendingDown />
                    ) : (
                      <MdEmojiEvents />
                    )}
                  </Icon>
                </Box>
              </HStack>

              <VStack align="stretch" gap={1}>
                <Text
                  fontSize="xl"
                  fontWeight="700"
                  color={
                    promotionStatus.status === 'promotion'
                      ? 'green.400'
                      : promotionStatus.status === 'relegation'
                        ? 'red.400'
                        : 'fg'
                  }
                >
                  {promotionStatus.status === 'promotion' && 'Promotion Zone'}
                  {promotionStatus.status === 'relegation' && 'Danger Zone'}
                  {promotionStatus.status === 'safe' && 'Safe'}
                </Text>

                <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                  {promotionStatus.status === 'safe' && promotionStatus.ranksToPromotion &&
                    `${promotionStatus.ranksToPromotion} ranks to promotion`}
                  {promotionStatus.status === 'promotion' && 'Top 20% - Keep going! ⬆️'}
                  {promotionStatus.status === 'relegation' && 'Bottom 20% - Grind more! ⚠️'}
                </Text>
              </VStack>
            </VStack>
          </Box>
        )}
      </SimpleGrid>
    </Box>
  );
}