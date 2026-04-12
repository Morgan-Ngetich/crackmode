import { Box, Container, Flex } from "@chakra-ui/react";
import CrackModeHeader from "@/components/common/CrackModeHeader";
import DocumentSEOHead from "@/seo/DocumentSEOHead";

import HeroLeft from "@/components/home/HeroLeft";
import HeroCarousel from "@/components/home/HeroCarousel";
import SocialProofStrip from "@/components/home/SocialProofStrip";
import AppPreviewSection from "@/components/home/AppPreviewSection";
import ScoringSection from "@/components/home/ScoringSection";
import DivisionsSection from "@/components/home/DivisionsSection";
import LeaderboardSection from "@/components/home/LeaderboardSection";
import CrackCompetitionSection from "@/components/home/CrackCompetitionSection";
import OpenSourceSection from "@/components/home/OpenSourceSection";
import FinalCTA from "@/components/home/FinalCTA";

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
    <CrackCompetitionSection />
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
      @keyframes marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50%       { opacity: 0.4; transform: scale(0.8); }
      }
    `}</style>
  </>
);

export default Home;
