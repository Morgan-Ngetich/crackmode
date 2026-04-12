// MyStatsCard.tsx

import { Box, HStack, VStack, Text, Icon, SimpleGrid, Popover, Portal, Link } from '@chakra-ui/react';
import { FaFire, FaTrophy, FaBolt, FaInfoCircle } from 'react-icons/fa';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
import { MdEmojiEvents } from 'react-icons/md';
import { CrackModeProfilePublic } from '@/client';
import { useState } from 'react';

const DIVISION_ICONS = {
  Diamond: '💎',
  Platinum: '🏆',
  Gold: '🥇',
  Silver: '🥈',
  Bronze: '🥉',
};

// Info content for each card
const CARD_INFO = {
  division: {
    title: 'Your Division',
    body: 'Division is determined by your performance score — not all-time stats. Grind consistently this week to promote. Go inactive and you\'ll relegate. It resets every sync.',
  },
  performance: {
    title: 'Performance Score',
    body: '60% from this week\'s solves, 30% from your monthly average, and 10% from all-time legacy. Your streak adds up to a 60% bonus on top. This single number decides your division.',
  },
  streak: {
    title: 'Daily Streak',
    body: 'Solve at least one problem per day to keep your streak alive. Each day adds +2% to your score multiplier, capped at +60% for a 30-day streak. Miss a day and it resets to 0.',
  },
  weekly: {
    title: 'This Week\'s Solves',
    body: 'Problems solved in the last 7 days. This carries 60% of your performance score weight — the single biggest factor. Easy = 1pt, Medium = 3pts, Hard = 5pts.',
  },
  status: {
    title: 'Division Status',
    body: 'Based on your current performance score vs division thresholds. Promotion zone means you\'ve crossed the next division\'s floor. Danger zone means you\'re in the relegation buffer — keep grinding or you\'ll drop.',
  },
};

// Reusable info icon with popover
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function InfoPopover({ info }: { info: { title: string; body: string } }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          cursor="pointer"
        >
          {/* Original icon slot — parent passes via children but we show (i) on hover */}
          <Icon
            fontSize="sm"
            color={hovered ? 'fg.muted' : 'transparent'}
            transition="all 0.15s"
            position="absolute"
          >
            <FaInfoCircle />
          </Icon>
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content maxW="220px" p={3}>
            <Popover.Arrow />
            <VStack align="start" gap={1}>
              <Text fontSize="xs" fontWeight="700">{info.title}</Text>
              <Text fontSize="xs" color="fg.muted" lineHeight="1.5">{info.body}</Text>
            </VStack>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

// Icon button that shows original icon, swaps to (i) on hover
function CardIconButton({
  icon,
  bg,
  color,
  info,
}: {
  icon: React.ReactNode;
  bg: string;
  color: string;
  info: { title: string; body: string };
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Box
          p={2}
          borderRadius="lg"
          bg={bg}
          cursor="pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          transition="all 0.15s"
          _hover={{ bg: 'bg.subtle' }}
          position="relative"
          w="32px"
          h="32px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            color={hovered ? 'fg.muted' : color}
            fontSize="lg"
            transition="all 0.15s"
            position="absolute"
            opacity={hovered ? 0 : 1}
          >
            {icon}
          </Icon>
          <Icon
            color="fg.muted"
            fontSize="sm"
            transition="all 0.15s"
            position="absolute"
            opacity={hovered ? 1 : 0}
          >
            <FaInfoCircle />
          </Icon>
        </Box>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content maxW="220px" p={3}>
            <Popover.Arrow />
            <VStack align="start" gap={1}>
              <Text fontSize="xs" fontWeight="700">{info.title}</Text>
              <Text fontSize="xs" color="fg.muted" lineHeight="1.5">{info.body}</Text>
            </VStack>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

// Shared stat card shell
function StatCard({
  label,
  gradient,
  iconBg,
  iconColor,
  icon,
  info,
  children,
  borderColor,
  borderWidth,
  gridColumn,
}: {
  label: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  info: { title: string; body: string };
  children: React.ReactNode;
  borderColor?: string;
  borderWidth?: number;
  gridColumn?: object;
}) {
  return (
    <Box
      gridColumn={gridColumn}
      bg="cardbg"
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor ?? 'border.emphasized'}
      borderWidth={borderWidth ?? 1}
      p={4}
      position="relative"
      overflow="hidden"
      _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
      transition="all 0.2s"
      cursor="default"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        background: gradient,
        pointerEvents: 'none',
      }}
    >
      <VStack align="stretch" gap={3} position="relative" zIndex={1}>
        <HStack justify="space-between">
          <Text fontSize="sm" color="fg.muted" fontWeight="500">{label}</Text>
          <CardIconButton icon={icon} bg={iconBg} color={iconColor} info={info} />
        </HStack>
        {children}
      </VStack>
    </Box>
  );
}

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
      <SimpleGrid columns={{ base: 2, md: 5 }} gap={{ base: 3, md: 4 }} w="full">

        {/* 1. Division */}
        <StatCard
          label="Division"
          gradient="linear-gradient(135deg, rgba(59,130,246,0.5) 0%, transparent 40%, rgba(59,130,246,0.1) 100%)"
          iconBg="rgba(59,130,246,0.1)"
          iconColor="blue.400"
          icon={<FaTrophy />}
          info={CARD_INFO.division}
        >
          <Link
            href={`/leaderboard/divisions/${profile.division.charAt(0).toUpperCase() +
              profile.division.slice(1).toLowerCase()
              }`}
          >
            <VStack align="stretch" gap={1}>
              <HStack gap={2} align="baseline">
                <Text fontSize="2xl">
                  {DIVISION_ICONS[profile.division as keyof typeof DIVISION_ICONS]}
                </Text>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700">
                  {profile.division}
                </Text>
              </HStack>
              <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
                Rank #{profile.division_rank}
              </Text>
            </VStack>
          </Link>
        </StatCard>

        {/* 2. Performance Score */}
        <StatCard
          label="Performance"
          gradient="linear-gradient(135deg, rgba(234,179,8,0.4) 0%, transparent 40%, rgba(234,179,8,0.1) 100%)"
          iconBg="rgba(234,179,8,0.1)"
          iconColor="yellow.400"
          icon={<FaBolt />}
          info={CARD_INFO.performance}
        >
          <VStack align="stretch" gap={1}>
            <Text fontSize="3xl" fontWeight="700">{profile.performance_score}</Text>
            <Text fontSize="sm" color="fg.muted" fontWeight="semibold">Velocity score</Text>
          </VStack>
        </StatCard>

        {/* 3. Streak */}
        <StatCard
          label="Streak"
          gradient="linear-gradient(135deg, rgba(251,146,60,0.4) 0%, transparent 40%, rgba(251,146,60,0.1) 100%)"
          iconBg="rgba(251,146,60,0.1)"
          iconColor="orange.400"
          icon={<FaFire />}
          info={CARD_INFO.streak}
        >
          <VStack align="stretch" gap={1}>
            <HStack gap={2} align="baseline">
              <Text fontSize="3xl" fontWeight="700">{profile.current_streak}</Text>
              <Text fontSize="sm" color="fg.muted" fontWeight="500">days</Text>
            </HStack>
            <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
              Best: {profile.longest_streak} days
            </Text>
          </VStack>
        </StatCard>

        {/* 4. This Week */}
        <StatCard
          label="This Week"
          gradient="linear-gradient(135deg, rgba(34,197,94,0.4) 0%, transparent 40%, rgba(34,197,94,0.1) 100%)"
          iconBg="rgba(34,197,94,0.1)"
          iconColor="green.400"
          icon={<MdEmojiEvents />}
          info={CARD_INFO.weekly}
        >
          <VStack align="stretch" gap={1}>
            <HStack gap={2} align="baseline">
              <Text fontSize="3xl" fontWeight="700">{profile.weekly_solves}</Text>
              <Text fontSize="sm" color="fg.muted" fontWeight="500">solved</Text>
            </HStack>
            <Text fontSize="sm" color="fg.muted" fontWeight="semibold">
              Keep grinding! ⚡
            </Text>
          </VStack>
        </StatCard>

        {/* 5. Promotion Status */}
        {promotionStatus && (
          <StatCard
            label="Status"
            gridColumn={{ base: 'span 2', md: 'span 1' }}
            gradient={
              promotionStatus.status === 'promotion'
                ? 'linear-gradient(135deg, rgba(34,197,94,0.2) 0%, transparent 50%, rgba(34,197,94,0.15) 100%)'
                : promotionStatus.status === 'relegation'
                  ? 'linear-gradient(135deg, rgba(239,68,68,0.2) 0%, transparent 50%, rgba(239,68,68,0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, transparent 50%, rgba(59,130,246,0.1) 100%)'
            }
            iconBg={
              promotionStatus.status === 'promotion' ? 'rgba(34,197,94,0.1)'
                : promotionStatus.status === 'relegation' ? 'rgba(239,68,68,0.1)'
                  : 'rgba(59,130,246,0.1)'
            }
            iconColor={
              promotionStatus.status === 'promotion' ? 'green.400'
                : promotionStatus.status === 'relegation' ? 'red.400'
                  : 'blue.400'
            }
            icon={
              promotionStatus.status === 'promotion' ? <BiTrendingUp />
                : promotionStatus.status === 'relegation' ? <BiTrendingDown />
                  : <MdEmojiEvents />
            }
            info={CARD_INFO.status}
            borderWidth={2}
            borderColor={
              promotionStatus.status === 'promotion' ? 'green.600'
                : promotionStatus.status === 'relegation' ? 'red.600'
                  : 'border.emphasized'
            }
          >
            <VStack align="stretch" gap={1}>
              <Text
                fontSize="xl"
                fontWeight="700"
                color={
                  promotionStatus.status === 'promotion' ? 'green.400'
                    : promotionStatus.status === 'relegation' ? 'red.400'
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
                {promotionStatus.status === 'promotion' && 'Keep going! ⬆️'}
                {promotionStatus.status === 'relegation' && 'Grind more! ⚠️'}
              </Text>
            </VStack>
          </StatCard>
        )}

      </SimpleGrid>
    </Box>
  );
}