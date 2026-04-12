import {
  Box, Badge, Container, Flex, Heading, HStack, Image, SimpleGrid, Text, VStack,
} from "@chakra-ui/react";

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

const AppPreviewSection = () => (
  <Box
    as="section"
    py={{ base: 16, md: 24 }}
    bg={{ base: "white", _dark: "gray.950" }}
    position="relative"
    overflow="hidden"
  >
    <Box
      position="absolute"
      bottom="-100px"
      left="-100px"
      w="400px"
      h="400px"
      bg="yellow.400"
      filter="blur(120px)"
      opacity={{ base: 0.4, _dark: 0.2 }}
    />
    <Box
      position="absolute"
      top="-120px"
      right="-100px"
      w="400px"
      h="600px"
      bg="green.400"
      filter="blur(140px)"
      opacity={{ base: 0.5, _dark: 0.15 }}
    />

    <Container maxW="7xl">
      <VStack gap={4} mb={12} textAlign="center">
        <Badge colorPalette="teal" size="lg" variant="surface" px={4} py={1} borderRadius="full">
          See It In Action
        </Badge>
        <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold">
          Built for serious grinders.{" "}<br />
          <Text as="span" color="teal.500">Looks the part.</Text>
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="fg.muted" maxW="2xl">
          A full leaderboard with division rankings, a structured docs platform with LeetCode 75
          walkthroughs, and a WhatsApp broadcast that drops your daily lesson at 8am.
        </Text>
      </VStack>

      <Flex gap={{ base: 6, md: 10 }} direction={{ base: "column", lg: "row" }} align="stretch">
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

export default AppPreviewSection;
