import {
  Box,
  Badge,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import CrackModeHeader from "@/components/common/CrackModeHeader";
import HeroLeft from "../components/home/HeroLeft";
import HeroCarousel from "../components/home/HeroCarousel";
import {
  FaTrophy,
  FaBook,
  FaBolt,
  FaFire,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

// ─── Section: What is CrackMode ──────────────────────────────────────────────
const WhatIsCrackMode = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    bg={{ base: "gray.50", _dark: "gray.900" }}
  >
    <Container maxW="5xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="teal" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          What is CrackMode?
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          A community built on{" "}
          <Text as="span" color="teal.500">grinding</Text>,{" "}
          <Text as="span" color="orange.400">not gatekeeping</Text>
        </Heading>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="fg.muted"
          maxW="2xl"
        >
          CrackMode is a competitive LeetCode community where your rank is earned
          every week — not handed out for past glory. Link your LeetCode account,
          get placed in a division, and compete with peers at your level.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={8}>
        {[
          {
            icon: FaBook,
            color: "teal",
            title: "Structured Learning",
            desc: "Work through LeetCode 75 + System Design with detailed community walkthroughs. Brute force → optimised, every time.",
          },
          {
            icon: FaBolt,
            color: "yellow",
            title: "Weekly Competition",
            desc: "Your division is recalculated every sync. Solve problems this week or get relegated. No coasting — performance speaks.",
          },
          {
            icon: FaUsers,
            color: "purple",
            title: "Peer Accountability",
            desc: "600+ members grinding at the same time. 9:30 PM daily sessions on WhatsApp. You are never solving alone.",
          },
        ].map(({ icon, color, title, desc }) => (
          <Box
            key={title}
            p={6}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
          >
            <Icon
              fontSize="2xl"
              color={{ base: `${color}.600`, _dark: `${color}.400` }}
              mb={3}
            >
              {icon({ size: 24 })}
            </Icon>
            <Text fontWeight="bold" fontSize="lg" mb={2}>{title}</Text>
            <Text fontSize="sm" color="fg.muted">{desc}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

// ─── Section: Scoring System ──────────────────────────────────────────────────
const ScoringSection = () => (
  <Box as="section" py={{ base: 16, md: 24 }}>
    <Container maxW="5xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="orange" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          Scoring System
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Every problem counts.{" "}
          <Text as="span" color="orange.400">Harder = more points.</Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" maxW="2xl">
          Points are awarded by difficulty. Your{" "}
          <strong>weekly velocity</strong> (65%) is the biggest factor — what you
          did last month matters less than what you did this week.
        </Text>
      </VStack>

      {/* Difficulty badges */}
      <Flex justify="center" gap={6} flexWrap="wrap" mb={12}>
        {[
          { label: "Easy", pts: "1 pt", palette: "green" },
          { label: "Medium", pts: "3 pts", palette: "yellow" },
          { label: "Hard", pts: "5 pts", palette: "red" },
        ].map(({ label, pts, palette }) => (
          <Box
            key={label}
            textAlign="center"
            p={6}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${palette}.200`, _dark: `${palette}.700` }}
            bg={{ base: `${palette}.50`, _dark: `${palette}.900/20` }}
            minW="140px"
          >
            <Text fontSize="3xl" fontWeight="black" color={`${palette}.500`}>{pts}</Text>
            <Badge colorPalette={palette} variant="surface" mt={2}>{label}</Badge>
          </Box>
        ))}
      </Flex>

      {/* Performance score breakdown */}
      <Box
        borderRadius="2xl"
        borderWidth={2}
        borderColor="border.emphasized"
        p={{ base: 6, md: 10 }}
        bg={{ base: "white", _dark: "gray.800" }}
      >
        <Heading size="lg" mb={6} textAlign="center">
          How your Performance Score is calculated
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={8}>
          {[
            {
              pct: "65%",
              label: "This Week's Grind",
              color: "orange",
              desc: "Easy×1 + Medium×3 + Hard×5 points from the last 7 days. The biggest driver of your rank.",
            },
            {
              pct: "25%",
              label: "Monthly Consistency",
              color: "teal",
              desc: "Average weekly points over the last 30 days ÷ 4 weeks. Shows you don't just burst once a month.",
            },
            {
              pct: "10%",
              label: "Legacy Bonus",
              color: "purple",
              desc: "All-time score contribution — capped at 100 pts. Veterans get a small edge, not a free pass.",
            },
          ].map(({ pct, label, color, desc }) => (
            <VStack key={label} align="start" gap={2}>
              <HStack>
                <Text
                  fontSize="3xl"
                  fontWeight="black"
                  color={{ base: `${color}.600`, _dark: `${color}.400` }}
                >
                  {pct}
                </Text>
                <Text fontWeight="bold">{label}</Text>
              </HStack>
              <Text fontSize="sm" color="fg.muted">{desc}</Text>
            </VStack>
          ))}
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
          <Box
            p={4}
            borderRadius="lg"
            bg={{ base: "yellow.50", _dark: "yellow.900/20" }}
            borderWidth={1}
            borderColor={{ base: "yellow.200", _dark: "yellow.700" }}
          >
            <HStack mb={2}>
              <Icon color="yellow.500"><FaFire size={18} /></Icon>
              <Text fontWeight="bold">Streak Multiplier</Text>
            </HStack>
            <Text fontSize="sm" color="fg.muted">
              +2.5% per consecutive day, up to <strong>+60% max bonus</strong> at 24 days.
              Solve at least one problem daily to grow your streak.
            </Text>
          </Box>
          <Box
            p={4}
            borderRadius="lg"
            bg={{ base: "red.50", _dark: "red.900/20" }}
            borderWidth={1}
            borderColor={{ base: "red.200", _dark: "red.700" }}
          >
            <HStack mb={2}>
              <Icon color="red.500"><FaShieldAlt size={18} /></Icon>
              <Text fontWeight="bold">Inactivity Penalty</Text>
            </HStack>
            <Text fontSize="sm" color="fg.muted">
              0 problems this week → <strong>×0.4 multiplier</strong>. Ghost for a week and your
              score craters. 1-2 problems → ×0.70. 3-4 → ×0.90. 5+ → no penalty.
            </Text>
          </Box>
        </SimpleGrid>
      </Box>
    </Container>
  </Box>
);

// ─── Section: Divisions ───────────────────────────────────────────────────────
const DIVISIONS = [
  { name: "Diamond",  icon: "💎", color: "blue",   minScore: 140, desc: "Elite — 28+ weighted problems/week" },
  { name: "Platinum", icon: "💿", color: "cyan",   minScore: 75,  desc: "Advanced — 18+ weighted problems/week" },
  { name: "Gold",     icon: "🥇", color: "yellow", minScore: 38,  desc: "Competitive — 8-10 problems/week" },
  { name: "Silver",   icon: "🥈", color: "gray",   minScore: 12,  desc: "Growing — ~4 problems/week" },
  { name: "Bronze",   icon: "🥉", color: "orange", minScore: 0,   desc: "Starting out — just getting going" },
] as const;

const DivisionsSection = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    bg={{ base: "gray.50", _dark: "gray.900" }}
  >
    <Container maxW="5xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="blue" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          Division System
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Climb the ladder.{" "}
          <Text as="span" color="blue.400">Or get relegated.</Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" maxW="2xl">
          Five divisions, each earned through weekly performance — not career totals.
          Stop grinding and you drop. Stay active and you rise.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 5 }} gap={4} mb={10}>
        {DIVISIONS.map((div) => (
          <Box
            key={div.name}
            p={5}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${div.color}.300`, _dark: `${div.color}.700` }}
            bg={{ base: `${div.color}.50`, _dark: `${div.color}.900/20` }}
            textAlign="center"
          >
            <Text fontSize="3xl" mb={2}>{div.icon}</Text>
            <Text fontWeight="bold" fontSize="lg">{div.name}</Text>
            <Badge colorPalette={div.color} variant="surface" my={2}>
              {div.minScore > 0 ? `${div.minScore}+ pts` : "Starting"}
            </Badge>
            <Text fontSize="xs" color="fg.muted" mt={1}>{div.desc}</Text>
          </Box>
        ))}
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        <Box
          p={6}
          borderRadius="xl"
          borderWidth={2}
          borderColor={{ base: "green.200", _dark: "green.700" }}
          bg={{ base: "green.50", _dark: "green.900/20" }}
        >
          <HStack mb={3}>
            <Icon color="green.500"><FaChartLine size={20} /></Icon>
            <Text fontWeight="bold" fontSize="lg">Promotion Rules</Text>
          </HStack>
          <VStack align="start" gap={2} fontSize="sm" color="fg.muted">
            <Text>• Hit the <strong>full threshold</strong> for the next division</Text>
            <Text>• No grace period — reach it and you're promoted next sync</Text>
            <Text>• Weekly performance is recalculated on every sync</Text>
          </VStack>
        </Box>
        <Box
          p={6}
          borderRadius="xl"
          borderWidth={2}
          borderColor={{ base: "red.200", _dark: "red.700" }}
          bg={{ base: "red.50", _dark: "red.900/20" }}
        >
          <HStack mb={3}>
            <Icon color="red.500"><FaShieldAlt size={20} /></Icon>
            <Text fontWeight="bold" fontSize="lg">Relegation Rules</Text>
          </HStack>
          <VStack align="start" gap={2} fontSize="sm" color="fg.muted">
            <Text>• Must fall <strong>20% below</strong> your division floor to drop</Text>
            <Text>• Example: Gold floor = 38 pts → you drop below 30.4 to relegate</Text>
            <Text>• One bad week won't kill you — two will</Text>
          </VStack>
        </Box>
      </SimpleGrid>
    </Container>
  </Box>
);

// ─── Section: Leaderboard Rules ───────────────────────────────────────────────
const LeaderboardSection = () => (
  <Box as="section" py={{ base: 16, md: 24 }}>
    <Container maxW="5xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="yellow" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          Leaderboard
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Two ways to compete.{" "}
          <Text as="span" color="yellow.500">One way to win.</Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" maxW="2xl">
          The global leaderboard ranks everyone by all-time score. Division
          leaderboards rank peers within your tier by current performance. Grind.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={8} mb={10}>
        <Box
          p={8}
          borderRadius="2xl"
          borderWidth={2}
          borderColor={{ base: "yellow.200", _dark: "yellow.700" }}
          bg={{ base: "yellow.50", _dark: "yellow.900/20" }}
        >
          <HStack mb={4}>
            <Icon fontSize="2xl" color="yellow.500"><FaTrophy size={28} /></Icon>
            <Heading size="md">Global Leaderboard</Heading>
          </HStack>
          <VStack align="start" gap={3} fontSize="sm" color="fg.muted">
            <Text>Ranked by <strong>Total Score</strong> — the sum of all difficulty points earned all-time.</Text>
            <Text>Formula: <strong>(Easy×1) + (Medium×3) + (Hard×5)</strong> across your entire LeetCode history.</Text>
            <Text>Streak bonuses and contest bonuses are added on top.</Text>
            <Text>This is your career legacy — it only ever goes up.</Text>
          </VStack>
        </Box>

        <Box
          p={8}
          borderRadius="2xl"
          borderWidth={2}
          borderColor={{ base: "teal.200", _dark: "teal.700" }}
          bg={{ base: "teal.50", _dark: "teal.900/20" }}
        >
          <HStack mb={4}>
            <Icon fontSize="2xl" color="teal.500"><FaBolt size={28} /></Icon>
            <Heading size="md">Division Leaderboard</Heading>
          </HStack>
          <VStack align="start" gap={3} fontSize="sm" color="fg.muted">
            <Text>Ranked by <strong>Performance Score</strong> within your current division.</Text>
            <Text>Resets with each division change — fresh start at every level.</Text>
            <Text>65% of your score is THIS week's grind. Compete with peers at your level.</Text>
            <Text>Top of your division = promoted. Bottom = relegated.</Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Sync cadence info */}
      <Box
        p={6}
        borderRadius="xl"
        borderWidth={2}
        borderColor="border.emphasized"
        bg={{ base: "white", _dark: "gray.800" }}
        textAlign="center"
      >
        <HStack justify="center" mb={3}>
          <Icon color="teal.500"><FaCalendarAlt size={20} /></Icon>
          <Text fontWeight="bold" fontSize="lg">When does my rank update?</Text>
        </HStack>
        <Text fontSize="sm" color="fg.muted" maxW="xl" mx="auto">
          Stats sync automatically every <strong>24 hours</strong> for all users. You can also
          manually sync from your profile — with a <strong>30-minute cooldown</strong> to prevent
          spam. Rankings are recalculated immediately after every sync.
        </Text>
      </Box>
    </Container>
  </Box>
);

// ─── Section: Final CTA ───────────────────────────────────────────────────────
const FinalCTA = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    bgGradient="to-br"
    gradientFrom={{ base: "teal.50", _dark: "teal.900/30" }}
    gradientTo={{ base: "orange.50", _dark: "orange.900/20" }}
  >
    <Container maxW="3xl" textAlign="center">
      <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold" mb={4}>
        Ready to enter{" "}
        <Text as="span" color="teal.500">CrackMode</Text>?
      </Heading>
      <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" mb={8} maxW="xl" mx="auto">
        Link your LeetCode account, get placed in a division, and start competing
        with the community tonight at 9:30 PM.
      </Text>
      <Flex gap={4} justify="center" flexWrap="wrap">
        <Link to="/leaderboard">
          <Button size="lg" colorPalette="teal">
            <Icon><FaTrophy /></Icon>
            View Leaderboard
          </Button>
        </Link>
        <Link to="/docs">
          <Button size="lg" colorPalette="orange" variant="outline">
            <Icon><FaBook /></Icon>
            Start Learning
          </Button>
        </Link>
        <a href="https://chat.whatsapp.com/Biz5sc2ow3v8Mg2aId6yOH" target="_blank" rel="noopener noreferrer">
          <Button size="lg" variant="surface">
            <Icon color="green.500"><IoLogoWhatsapp /></Icon>
            Join WhatsApp
          </Button>
        </a>
      </Flex>
    </Container>
  </Box>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const Home = () => (
  <>
    <CrackModeHeader mode="home" />

    {/* Hero */}
    <Box
      display="flex"
      minH="91vh"
      bgGradient="to-br"
      gradientFrom={{ base: "white", _dark: "bg" }}
      gradientTo={{ base: "gray.150", _dark: "gray.800" }}
      alignItems="center"
    >
      <Container w="100%" p={0}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="center"
          w="100%"
          gap={8}
        >
          <HeroLeft />
          <HeroCarousel />
        </Flex>
      </Container>
    </Box>

    {/* Landing page sections */}
    <WhatIsCrackMode />
    <ScoringSection />
    <DivisionsSection />
    <LeaderboardSection />
    <FinalCTA />

    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </>
);

export default Home;
