import { Box, Container, Flex } from "@chakra-ui/react";
import CrackModeHeader from "@/components/common/CrackModeHeader";
import HeroLeft from "../components/home/HeroLeft";
import HeroCarousel from "../components/home/HeroCarousel";

const Home = () => (
  <>
    <CrackModeHeader mode="home" />
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

    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </>
);

export default Home;