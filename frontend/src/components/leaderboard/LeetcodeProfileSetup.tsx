import { useState } from 'react';
import { Box, Container, VStack, HStack, Text, Input, Button } from '@chakra-ui/react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useSetupCrackModeProfile } from '@/hooks/crackmode/leaderboard/useCrackmode';
import { useAuthRouteGuard } from '@/hooks/auth/useAuthRouteGuard';

export function LeetcodeProfileSetup() {
  const [leetcodeUsername, setLeetcodeUsername] = useState('');
  const setupProfile = useSetupCrackModeProfile();
  const navigate = useNavigate();
  const { user, isBlocked } = useAuthRouteGuard();
  const router = useRouter();

  const handleSetup = async () => {
    if (!leetcodeUsername.trim()) return;

    await setupProfile.mutateAsync({
      leetcode_username: leetcodeUsername.trim(),
    });

    // On success, navigate to leaderboard
    navigate({ to: '/leaderboard' });
  };

  if (!user && !isBlocked) {
    router.navigate({
      to: "/login",
      search: {
        redirectTo: "/leetcode-setup"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    });
    return null;
  }

  if (isBlocked) {
    return <div>Loading...</div>;
  }

  if (user && user.crackmode_profile?.leetcode_username) {
    router.navigate({
      to: "/leaderboard"
    });
    return null;
  }
  return (
    <Box
      minH="100vh"
      bg="gray.950"
      bgGradient="radial(circle at top, gray.900, gray.950)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={8}
    >
      <Container maxW="2xl">
        <VStack gap={8}>
          {/* Hero Section */}
          <VStack gap={4} textAlign="center">
            <VStack gap={2}>
              <Text
                fontSize="5xl"
                fontWeight="black"
                bgGradient="linear(to-r, yellow.300, yellow.500, orange.400)"
                bgClip="text"
                letterSpacing="tight"
              >
                CRACKMODE
              </Text>
              <Text fontSize="xl" color="gray.400" fontWeight="semibold">
                Competitive LeetCode Leaderboard
              </Text>
            </VStack>
          </VStack>

          {/* Setup Form */}
          <Box
            w="full"
            maxW="xl"
            bg="gray.900"
            borderWidth={2}
            borderColor="gray.700"
            borderRadius="2xl"
            p={8}
            className="setup-form"
          >
            <VStack gap={6}>
              <VStack gap={2} w="full">
                <Text fontSize="lg" fontWeight="bold" color="gray.200">
                  Enter Your LeetCode Username
                </Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  We'll verify your profile and place you in the appropriate division
                </Text>
              </VStack>

              <VStack gap={4} w="full">
                <Input
                  placeholder="e.g., john_doe"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  size="lg"
                  bg="gray.800"
                  borderColor="gray.600"
                  _hover={{ borderColor: 'gray.500' }}
                  _focus={{ borderColor: 'yellow.400', boxShadow: '0 0 0 1px var(--chakra-colors-yellow-400)' }}
                  disabled={setupProfile.isPending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSetup();
                  }}
                />

                <Button
                  size="lg"
                  w="full"
                  color="gray.900"
                  fontWeight="black"
                  fontSize="md"
                  _hover={{ bg: 'yellow.300', transform: 'translateY(-2px)' }}
                  _active={{ bg: 'yellow.500' }}
                  onClick={handleSetup}
                  disabled={!leetcodeUsername.trim() || setupProfile.isPending}
                  loading={setupProfile.isPending}
                  transition="all 0.2s"
                >
                  {setupProfile.isPending ? 'Verifying Profile...' : 'Join CrackMode 🚀'}
                </Button>
              </VStack>

              <Text fontSize="xs" color="gray.600" textAlign="center">
                Make sure your LeetCode profile is public so we can fetch your stats
              </Text>
            </VStack>
          </Box>

          {/* Info Box */}
          <Box
            w="full"
            maxW="xl"
            bg="rgba(59, 130, 246, 0.1)"
            borderWidth={1}
            borderColor="blue.500/30"
            borderRadius="xl"
            p={4}
          >
            <HStack gap={3}>
              <Text fontSize="2xl">ℹ️</Text>
              <VStack align="start" gap={1}>
                <Text fontSize="sm" fontWeight="semibold" color="blue.400">
                  How it works
                </Text>
                <Text fontSize="xs" color="gray.400">
                  1. We fetch your current LeetCode stats
                  <br />
                  2. You're placed in a division based on your skill level
                  <br />
                  3. Compete weekly to climb divisions and earn rewards!
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}