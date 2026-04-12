import {
  Box, Badge, Button, Container, Flex, Heading, HStack, Icon, SimpleGrid, Text, VStack,
} from "@chakra-ui/react";
import {
  FaGithub, FaCodeBranch, FaStar,
  FaReact, FaPython, FaDocker,
} from "react-icons/fa";
import { SiSupabase, SiFastapi, SiPostgresql, SiGooglegemini } from "react-icons/si";

const TECH_STACK = [
  { icon: <FaReact />,       label: "React",       color: "blue.400" },
  { icon: <SiFastapi />,     label: "FastAPI",      color: "teal.400" },
  { icon: <SiPostgresql />,  label: "PostgreSQL",   color: "blue.500" },
  { icon: <SiSupabase />,    label: "Supabase",     color: "green.500" },
  { icon: <FaDocker />,      label: "Docker",       color: "blue.400" },
  { icon: <SiGooglegemini />,label: "Gemini AI",    color: "purple.400" },
  { icon: <FaPython />,      label: "Python",       color: "yellow.400" },
];

const CONTRIB_STEPS = [
  { num: "01", title: "Fork the repo",   desc: "Star it while you're there 😉" },
  { num: "02", title: "Pick an issue",   desc: "Browse open issues or suggest a feature" },
  { num: "03", title: "Open a PR",       desc: "We review fast and merge faster" },
];

const OpenSourceSection = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    bg={{ base: "gray.100", _dark: "gray.950" }}
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

      {/* Contribute steps */}
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
              color={{ base: "gray.200", _dark: "gray.600" }}
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

export default OpenSourceSection;
