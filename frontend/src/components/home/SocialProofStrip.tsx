import { Box, Flex, HStack, Icon, Text } from "@chakra-ui/react";
import { FaFire, FaBook, FaGithub, FaTrophy, FaChartLine } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

const STRIP_ITEMS = [
  { icon: <FaFire />,         label: "Daily coding challenges", color: "orange.400" },
  { icon: <FaBook />,         label: "LeetCode 75 covered",     color: "teal.400" },
  { icon: <FaGithub />,       label: "Open source",             color: "fg.muted" },
  { icon: <IoLogoWhatsapp />, label: "WhatsApp community",      color: "green.400" },
  { icon: <FaTrophy />,       label: "600+ active members",     color: "yellow.400" },
  { icon: <FaChartLine />,    label: "5 competitive divisions", color: "blue.400" },
];

const SocialProofStrip = () => (
  <Box
    borderBottom="1px solid"
    borderTop="1px solid"
    borderColor={{ base: "gray.200", _dark: "gray.800" }}
    bg={{ base: "gray.50", _dark: "gray.950" }}
    py={3}
    overflow="hidden"
    position="relative"
  >
    {/* Fade edges */}
    <Box
      position="absolute" left={0} top={0} bottom={0} w={16} zIndex={1}
      bgGradient="to-r"
      gradientFrom={{ base: "gray.50", _dark: "gray.950" }}
      gradientTo="transparent"
      pointerEvents="none"
    />
    <Box
      position="absolute" right={0} top={0} bottom={0} w={16} zIndex={1}
      bgGradient="to-l"
      gradientFrom={{ base: "gray.50", _dark: "gray.950" }}
      gradientTo="transparent"
      pointerEvents="none"
    />

    <Flex
      gap={10}
      align="center"
      w="max-content"
      css={{ animation: "marquee 70s linear infinite" }}
    >
      {[...STRIP_ITEMS, ...STRIP_ITEMS].map(({ icon, label, color }, i) => (
        <HStack key={i} gap={2} flexShrink={0} opacity={0.8}>
          <Icon fontSize="sm" color={color}>{icon}</Icon>
          <Text fontSize="xs" fontWeight="medium" whiteSpace="nowrap" color="fg.muted">{label}</Text>
          <Text color="fg.subtle" fontSize="xs" mx={2}>·</Text>
        </HStack>
      ))}
    </Flex>
  </Box>
);

export default SocialProofStrip;
