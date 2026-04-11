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
  Image,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import CrackModeHeader from "@/components/common/CrackModeHeader";
import DocumentSEOHead from "@/seo/DocumentSEOHead";
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
  FaGithub,
  FaCodeBranch,
  FaStar,
  FaReact,
  FaPython,
  FaDocker,
} from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { SiSupabase, SiFastapi, SiPostgresql, SiGooglegemini } from "react-icons/si";

// ─── Section: Social Proof Strip ─────────────────────────────────────────────
const SocialProofStrip = () => (
  <Box
    borderBottom="1px solid"
    borderTop="1px solid"
    borderColor={{ base: "gray.200", _dark: "gray.800" }}
    bg={{ base: "gray.50", _dark: "gray.950" }}
    py={3}
    overflow="hidden"
  >
    <Container maxW="5xl">
      <Flex
        justify="center"
        align="center"
        gap={{ base: 6, md: 12 }}
        flexWrap="wrap"
        fontSize="sm"
        color="fg.muted"
      >
        {[
          { icon: <FaFire />, label: "Daily coding challenges" },
          { icon: <FaBook />, label: "LeetCode 75 covered" },
          { icon: <FaGithub />, label: "Open source" },
          { icon: <IoLogoWhatsapp />, label: "WhatsApp community" },
        ].map(({ icon, label }) => (
          <HStack key={label} gap={2} opacity={0.75}>
            <Icon fontSize="sm">{icon}</Icon>
            <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap">{label}</Text>
          </HStack>
        ))}
      </Flex>
    </Container>
  </Box>
);

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
            <HStack gap={3}>
              <Icon
                fontSize="2xl"
                color={{ base: `${color}.600`, _dark: `${color}.400` }}
                mb={3}
              >
                {icon({ size: 24 })}
              </Icon>
              <Text fontWeight="bold" fontSize="lg" mb={2}>{title}</Text>
            </HStack>
            <Text fontSize="sm" color="fg.muted">{desc}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

// ─── Browser frame mockup ─────────────────────────────────────────────────────
const BrowserFrame = ({
  url,
  label,
  src,
  gradient,
}: {
  url: string;
  label: string;
  src?: string;
  gradient: string;
}) => (
  <Box
    borderRadius="xl"
    overflow="hidden"
    borderWidth="1px"
    borderColor={{ base: "gray.200", _dark: "gray.700" }}
    boxShadow="2xl"
    flex={1}
    minW={0}
  >
    {/* Browser chrome */}
    <Box
      bg={{ base: "gray.100", _dark: "gray.800" }}
      px={4}
      py={2.5}
      borderBottom="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
    >
      <HStack gap={3}>
        <HStack gap={1.5} flexShrink={0}>
          <Box w={3} h={3} borderRadius="full" bg="red.400" />
          <Box w={3} h={3} borderRadius="full" bg="yellow.400" />
          <Box w={3} h={3} borderRadius="full" bg="green.500" />
        </HStack>
        <Box
          flex={1}
          bg={{ base: "white", _dark: "gray.900" }}
          borderRadius="md"
          px={3}
          py={1}
          textAlign="center"
        >
          <Text fontSize="xs" color="fg.subtle" fontFamily="mono">{url}</Text>
        </Box>
      </HStack>
    </Box>

    {/* Screenshot or placeholder */}
    {src ? (
      <Image src={src} alt={label} w="full" display="block" />
    ) : (
      <Box
        h={{ base: "180px", md: "240px" }}
        background={gradient}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative mock UI lines */}
        <Box position="absolute" inset={0} p={4}>
          <Box h={3} w="40%" bg="whiteAlpha.200" borderRadius="md" mb={3} />
          <SimpleGrid columns={3} gap={2} mb={4}>
            {[1, 2, 3].map((i) => (
              <Box key={i} h={16} bg="whiteAlpha.100" borderRadius="lg" />
            ))}
          </SimpleGrid>
          {[80, 60, 90, 50, 70].map((w, i) => (
            <Box key={i} h={2} w={`${w}%`} bg="whiteAlpha.150" borderRadius="full" mb={2} />
          ))}
        </Box>
        {/* Label overlay */}
        <Flex
          position="absolute"
          inset={0}
          align="center"
          justify="center"
          bg="blackAlpha.400"
        >
          <VStack gap={1}>
            <Text color="white" fontWeight="bold" fontSize="sm">{label}</Text>
            <Text color="whiteAlpha.700" fontSize="xs">Add screenshot to /public/screenshots/</Text>
          </VStack>
        </Flex>
      </Box>
    )}
  </Box>
);

// ─── Section: App Preview ─────────────────────────────────────────────────────
const AppPreviewSection = () => (
  <Box as="section" py={{ base: 16, md: 24 }} bg={{ base: "white", _dark: "gray.950" }}>
    <Container maxW="7xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="teal" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          See It In Action
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Built for serious grinders.{" "} <br />
          <Text as="span" color="teal.500">Looks the part.</Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" maxW="2xl">
          A full leaderboard with division rankings, a structured docs platform with LeetCode 75
          walkthroughs, and a WhatsApp broadcast that drops your daily lesson at 8am.
        </Text>
      </VStack>

      <Flex
        gap={{ base: 6, md: 10 }}
        direction={{ base: "column", lg: "row" }}
        align="stretch"
      >
        <BrowserFrame
          url="crackmode.vercel.app/leaderboard"
          label="Leaderboard"
          src="/screenshots/leaderboard.png"
          gradient="linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
        />
        <BrowserFrame
          url="crackmode.vercel.app/docs"
          label="Docs — LeetCode 75"
          src="/screenshots/docs.png"
          gradient="linear-gradient(135deg, #0d1f2d 0%, #1a3a4a 50%, #0a4d68 100%)"
        />
      </Flex>
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
          Every problem counts.{" "} <br />
          <Text as="span" color="orange.400">Harder = more points.</Text>
        </Heading>
      </VStack>

      {/* Difficulty cards */}
      <SimpleGrid columns={{ base: 3 }} gap={{ base: 3, md: 6 }} mb={10}>
        {[
          { label: "Easy",   pts: "1 pt",  palette: "green",  sub: "Arrays, strings" },
          { label: "Medium", pts: "3 pts", palette: "yellow", sub: "DP, graphs, trees" },
          { label: "Hard",   pts: "5 pts", palette: "red",    sub: "Advanced patterns" },
        ].map(({ label, pts, palette, sub }) => (
          <Box
            key={label}
            textAlign="center"
            p={{ base: 4, md: 8 }}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${palette}.200`, _dark: `${palette}.700` }}
            bg={{ base: `${palette}.50`, _dark: `${palette}.900/20` }}
          >
            <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="black" color={`${palette}.500`} lineHeight={1}>{pts}</Text>
            <Badge colorPalette={palette} variant="surface" my={2}>{label}</Badge>
            <Text fontSize="xs" color="fg.muted">{sub}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Performance weight breakdown */}
      <Heading size="md" textAlign="center" mb={6} color="fg.muted" fontWeight="medium">
        Your Performance Score is weighted:
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4} mb={8}>
        {[
          { pct: "65%", label: "This Week",    color: "orange", sub: "Last 7 days of grind" },
          { pct: "25%", label: "Monthly Avg",  color: "teal",   sub: "Consistency over 30 days" },
          { pct: "10%", label: "Legacy Bonus", color: "purple", sub: "All-time — capped at 100 pts" },
        ].map(({ pct, label, color, sub }) => (
          <Box
            key={label}
            p={{ base: 4, md: 6 }}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
            textAlign="center"
          >
            <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight="black" color={`${color}.500`} lineHeight={1}>{pct}</Text>
            <Text fontWeight="bold" mt={2}>{label}</Text>
            <Text fontSize="xs" color="fg.muted" mt={1}>{sub}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Streak + Penalty */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        <HStack
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          borderWidth={2}
          borderColor={{ base: "yellow.200", _dark: "yellow.700" }}
          bg={{ base: "yellow.50", _dark: "yellow.900/20" }}
          gap={4}
        >
          <Icon fontSize="3xl" color="yellow.500" flexShrink={0}><FaFire /></Icon>
          <Box>
            <Text fontWeight="bold">Streak Multiplier</Text>
            <Text fontSize="sm" color="fg.muted">+2.5%/day · up to <strong>+60% bonus</strong> at 24 days</Text>
          </Box>
        </HStack>
        <HStack
          p={{ base: 4, md: 6 }}
          borderRadius="xl"
          borderWidth={2}
          borderColor={{ base: "red.200", _dark: "red.700" }}
          bg={{ base: "red.50", _dark: "red.900/20" }}
          gap={4}
        >
          <Icon fontSize="3xl" color="red.500" flexShrink={0}><FaShieldAlt /></Icon>
          <Box>
            <Text fontWeight="bold">Inactivity Penalty</Text>
            <Text fontSize="sm" color="fg.muted">0 problems → <strong>×0.4</strong> · 5+ problems → no penalty</Text>
          </Box>
        </HStack>
      </SimpleGrid>
    </Container>
  </Box>
);

// ─── Section: Divisions ───────────────────────────────────────────────────────
const DIVISIONS = [
  { name: "Diamond", icon: "💎", color: "blue", minScore: 140, desc: "Elite — 28+ weighted problems/week" },
  { name: "Platinum", icon: "💿", color: "cyan", minScore: 75, desc: "Advanced — 18+ weighted problems/week" },
  { name: "Gold", icon: "🥇", color: "yellow", minScore: 38, desc: "Competitive — 8-10 problems/week" },
  { name: "Silver", icon: "🥈", color: "gray", minScore: 12, desc: "Growing — ~4 problems/week" },
  { name: "Bronze", icon: "🥉", color: "orange", minScore: 0, desc: "Starting out — just getting going" },
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
          Climb the ladder.{" "} <br />       
          <Text as="span" color="blue.400">Or get relegated.</Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" maxW="xl">
          Five tiers. Earned weekly. Stop grinding and you drop.
        </Text>
      </VStack>

      {/* Division cards */}
      <SimpleGrid columns={{ base: 2, sm: 2, md: 5 }} gap={4} mb={8}>
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
            <Text fontSize="3xl" mb={1}>{div.icon}</Text>
            <Text fontWeight="bold">{div.name}</Text>
            <Badge colorPalette={div.color} variant="surface" my={2} fontSize="xs">
              {div.minScore > 0 ? `${div.minScore}+ pts` : "Starting"}
            </Badge>
          </Box>
        ))}
      </SimpleGrid>

      {/* Promotion / Relegation — icon-led */}
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
        {[
          {
            icon: <FaChartLine />,
            color: "green",
            title: "Promotion",
            items: ["Hit the full point threshold", "Promoted on next sync", "No grace period"],
          },
          {
            icon: <FaShieldAlt />,
            color: "red",
            title: "Relegation",
            items: ["Fall 20% below your floor", "Gold 38 pts → drop at 30.4", "One bad week won't kill you"],
          },
        ].map(({ icon, color, title, items }) => (
          <Box
            key={title}
            p={6}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
          >
            <HStack mb={4} gap={3}>
              <Icon fontSize="xl" color={`${color}.500`}>{icon}</Icon>
              <Text fontWeight="bold" fontSize="lg">{title}</Text>
            </HStack>
            <VStack align="start" gap={3}>
              {items.map((item) => (
                <HStack key={item} gap={2} align="start">
                  <Text color={`${color}.500`} fontWeight="bold" flexShrink={0}>→</Text>
                  <Text fontSize="sm" color="fg.muted">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
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
          Two ways to compete.{" "} <br />
          <Text as="span" color="yellow.500">One way to win.</Text>
        </Heading>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} mb={6}>
        {[
          {
            icon: <FaTrophy />,
            color: "yellow",
            title: "Global Leaderboard",
            stat: "All-time",
            items: ["Ranked by total difficulty points", "Easy×1 · Medium×3 · Hard×5", "Career legacy — only goes up"],
          },
          {
            icon: <FaBolt />,
            color: "teal",
            title: "Division Leaderboard",
            stat: "Weekly",
            items: ["Ranked by performance score", "65% = this week's grind", "Top = promoted · Bottom = relegated"],
          },
        ].map(({ icon, color, title, stat, items }) => (
          <Box
            key={title}
            p={{ base: 5, md: 7 }}
            borderRadius="2xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
          >
            <HStack mb={4} justify="space-between">
              <HStack gap={3}>
                <Icon fontSize="2xl" color={`${color}.500`}>{icon}</Icon>
                <Text fontWeight="bold" fontSize="lg">{title}</Text>
              </HStack>
              <Badge colorPalette={color} variant="solid" borderRadius="full">{stat}</Badge>
            </HStack>
            <VStack align="start" gap={3}>
              {items.map((item) => (
                <HStack key={item} gap={2}>
                  <Text color={`${color}.500`} fontWeight="black" fontSize="lg" lineHeight={1}>·</Text>
                  <Text fontSize="sm" color="fg.muted">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Sync stats — 3 visual bubbles */}
      <SimpleGrid columns={{ base: 3 }} gap={4}>
        {[
          { icon: <FaCalendarAlt />, value: "24h",     label: "Auto sync",      color: "teal"   },
          { icon: <FaBolt />,        value: "30 min",  label: "Manual cooldown", color: "orange" },
          { icon: <FaChartLine />,   value: "Instant", label: "Recalculation",  color: "blue"   },
        ].map(({ icon, value, label, color }) => (
          <Box
            key={label}
            p={{ base: 2, md: 5 }}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: `${color}.200`, _dark: `${color}.700` }}
            bg={{ base: `${color}.50`, _dark: `${color}.900/20` }}
            textAlign="center"
          >
            <Icon fontSize="xl" color={`${color}.500`} mb={2}>{icon}</Icon>
            <Text fontSize={{ base: "lg", md: "2xl" }} fontWeight="black" color={`${color}.500`}>{value}</Text>
            <Text fontSize="xs" color="fg.muted" mt={1}>{label}</Text>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  </Box>
);

// ─── Section: Open Source ─────────────────────────────────────────────────────
const TECH_STACK = [
  { icon: <FaReact />, label: "React", color: "blue.400" },
  { icon: <SiFastapi />, label: "FastAPI", color: "teal.400" },
  { icon: <SiPostgresql />, label: "PostgreSQL", color: "blue.500" },
  { icon: <SiSupabase />, label: "Supabase", color: "green.500" },
  { icon: <FaDocker />, label: "Docker", color: "blue.400" },
  { icon: <SiGooglegemini />, label: "Gemini AI", color: "purple.400" },
  { icon: <FaPython />, label: "Python", color: "yellow.400" },
];

const CONTRIB_STEPS = [
  { num: "01", title: "Fork the repo", desc: "Star it while you're there 😉" },
  { num: "02", title: "Pick an issue", desc: "Browse open issues or suggest a feature" },
  { num: "03", title: "Open a PR", desc: "We review fast and merge faster" },
];

const OpenSourceSection = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    bg={{ base: "white", _dark: "gray.950" }}
  >
    <Container maxW="5xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="green" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          Open Source
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Built in public.{" "}
          <Text as="span" color="green.500">Open to everyone.</Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" maxW="2xl">
          CrackMode is fully open source. Browse the code, report bugs, suggest features,
          or contribute directly. Every PR is welcome.
        </Text>

        <HStack gap={4} flexWrap="wrap" justify="center" pt={2}>
          <a href="https://github.com/Morgan-Ngetich/crackmode" target="_blank" rel="noopener noreferrer">
            <Button size="lg" colorPalette="gray" variant="solid">
              <Icon><FaGithub /></Icon>
              View on GitHub
            </Button>
          </a>
          <a href="https://github.com/Morgan-Ngetich/crackmode/issues" target="_blank" rel="noopener noreferrer">
            <Button size="lg" variant="outline">
              <Icon><FaCodeBranch /></Icon>
              Open an Issue
            </Button>
          </a>
        </HStack>
      </VStack>

      {/* How to contribute steps */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} mb={12}>
        {CONTRIB_STEPS.map(({ num, title, desc }) => (
          <Box
            key={num}
            p={6}
            borderRadius="xl"
            borderWidth={2}
            borderColor={{ base: "gray.200", _dark: "gray.700" }}
            bg={{ base: "white", _dark: "gray.800" }}
            position="relative"
          >
            <Text
              fontSize="4xl"
              fontWeight="black"
              color={{ base: "gray.100", _dark: "gray.700" }}
              position="absolute"
              top={3}
              right={4}
              lineHeight={1}
            >
              {num}
            </Text>
            <Text fontWeight="bold" fontSize="lg" mb={1}>{title}</Text>
            <Text fontSize="sm" color="fg.muted">{desc}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Tech stack */}
      <Box textAlign="center">
        <Text fontSize="sm" color="fg.subtle" fontWeight="medium" mb={5} textTransform="uppercase" letterSpacing="wider">
          Built with
        </Text>
        <Flex justify="center" gap={{ base: 4, md: 8 }} flexWrap="wrap">
          {TECH_STACK.map(({ icon, label, color }) => (
            <VStack key={label} gap={1}>
              <Icon fontSize="2xl" color={color}>{icon}</Icon>
              <Text fontSize="xs" color="fg.muted">{label}</Text>
            </VStack>
          ))}
        </Flex>
      </Box>

      {/* Star CTA */}
      <Box
        mt={12}
        p={{ base: 5, md: 8 }}
        borderRadius="2xl"
        borderWidth={2}
        borderColor={{ base: "yellow.200", _dark: "yellow.800" }}
        bg={{ base: "yellow.50", _dark: "yellow.900/20" }}
        textAlign="center"
      >
        <HStack justify="center" mb={2}>
          <Icon color="yellow.500" fontSize="xl"><FaStar /></Icon>
          <Heading size="md">Leave a star if this helps you grind</Heading>
        </HStack>
        <Text fontSize="sm" color="fg.muted" mb={4}>
          It helps others discover CrackMode and motivates us to keep building.
        </Text>
        <a href="https://github.com/Morgan-Ngetich/crackmode" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" colorPalette="yellow" size="sm">
            <Icon><FaGithub /></Icon>
            github.com/Morgan-Ngetich/crackmode
          </Button>
        </a>
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
          <Button size="lg" colorPalette="orange" variant="outline">
            <Icon><FaTrophy /></Icon>
            View Leaderboard
          </Button>
        </Link>
        <Link to="/docs">
          <Button size="lg" colorPalette="teal" variant="outline">
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
    <DocumentSEOHead
      title="CrackMode — Master LeetCode. Compete. Level Up."
      description="Join 600+ coders grinding LeetCode daily. Earn your division through weekly performance, follow structured DSA + System Design walkthroughs, and compete with peers at your level."
    />
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

    <SocialProofStrip />

    {/* Landing page sections */}
    <WhatIsCrackMode />
    <AppPreviewSection />
    <ScoringSection />
    <DivisionsSection />
    <LeaderboardSection />
    <OpenSourceSection />
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
