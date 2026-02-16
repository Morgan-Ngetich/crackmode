import { ReactNode } from 'react';
import { LeaderboardHeader } from './LeaderboardHeader';
import { useCrackMode } from '@/hooks/crackmode/leaderboard/useCrackmode';
import { useCrackModeProfile } from '@/hooks/crackmode/leaderboard/useCrackmodeProfile';
import { Box, Flex } from '@chakra-ui/react';
import LeaderboardSidebar from './LeaderboardSidebar';
import { useDivision } from '@/hooks/context/divisionBgColorContext';

interface LeaderboardLayoutProps {
  children: ReactNode;
}

const DIVISION_GRADIENTS = {
  Diamond: {
    light: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-blue-300) 100%)',
    dark: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-blue-900) 100%)',
  },
  Platinum: {
    light: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-cyan-300) 100%)',
    dark: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-cyan-800) 100%)',
  },
  Gold: {
    light: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-yellow-200) 100%)',
    dark: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-yellow-700) 100%)',
  },
  Silver: {
    light: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-gray-400) 100%)',
    dark: 'linear-gradient(135deg, transparent 60%, var(--chakra-colors-gray-700) 100%)',
  },
  Bronze: {
    light: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-orange-300) 100%)',
    dark: 'linear-gradient(135deg, transparent 50%, var(--chakra-colors-orange-700) 100%)',
  },
};

export default function LeaderboardLayout({ children }: LeaderboardLayoutProps) {
  const { syncStats, isSyncing } = useCrackMode();
  const { data: myProfile } = useCrackModeProfile();
  const { currentDivision } = useDivision();

  // Get gradient based on current division, fallback to default
  const divisionGradient = currentDivision
    ? DIVISION_GRADIENTS[currentDivision as keyof typeof DIVISION_GRADIENTS]
    : null;

  const background = divisionGradient
    ? {
      base: divisionGradient.light,
      _dark: divisionGradient.dark,
    }
    : {
      base: 'linear-gradient(135deg, var(--chakra-colors-gray-50) 0%, var(--chakra-colors-gray-100) 50%, var(--chakra-colors-gray-150) 100%)',
      _dark: 'linear-gradient(135deg, var(--chakra-colors-gray-950) 0%, var(--chakra-colors-gray-900) 50%, var(--chakra-colors-gray-800) 100%)',
    };

  return (
    <Box
      minH="100vh"
      background={background}
      transition="background 0.5s ease-in-out"
    >
      <LeaderboardHeader
        onSync={() => syncStats.mutate()}
        isSyncing={isSyncing}
        isMyProfile={!!myProfile}
      />

      <Flex w="100vw" h="calc(100vh - 80px)"> {/* Subtract header height */}
        {/* Sidebar */}
        <Box display={{ base: "none", md: "block" }}>
          <LeaderboardSidebar />
        </Box>

        {/* Main content */}
        <Box flex="1" overflowY="auto" overflowX="hidden" p={6} py={{ base: "-moz-initial", md: 8 }} px={{ base: 0, md: "-moz-initial" }}>
          {children}
        </Box>
      </Flex>
    </Box>
  );
}