import { Box, Button, Container, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { FaTrophy, FaBook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";

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

export default FinalCTA;
