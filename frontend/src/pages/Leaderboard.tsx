import { Container, VStack, Flex, Spinner, Box, Text, Button, HStack, Icon } from '@chakra-ui/react';
import { FaFire } from 'react-icons/fa';

import { MyStatsCard } from '@/components/leaderboard/MyStatsCard';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';

import { useLeaderboard } from '@/hooks/crackmode/leaderboard/useCrackmode';
import { useCrackModeProfile, useHasCrackModeProfile } from '@/hooks/crackmode/leaderboard/useCrackmodeProfile';
import { usePromotionStatus } from '@/hooks/crackmode/leaderboard/useCrackmodeComparison';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/auth/useAuth';
import { CrackModeProfilePublic } from '@/client';

export default function Leaderboard() {
  const navigate = useNavigate();

  const { data: myProfile } = useCrackModeProfile();
  const { user, isLoading: isLoadingAuth } = useAuth();
  // const { syncStats, isSyncing } = useCrackMode();
  
  // const { hasProfile, isLoading: isLoadingProfile } = useHasCrackModeProfile();
  const { hasProfile } = useHasCrackModeProfile();

  const { data: globalLeaderboard, isLoading: isLoadingGlobal } = useLeaderboard({
    limit: 100,
    offset: 0,
  });

  const promotionStatus = usePromotionStatus();

  const getZoneStatus = (profile: CrackModeProfilePublic) => {
    if (!promotionStatus) return null;
    
    const { promotionThreshold, relegationThreshold } = promotionStatus;
    
    if (profile.division_rank <= promotionThreshold) return 'promotion';
    if (profile.division_rank >= relegationThreshold) return 'relegation';
    return 'safe';
  };

  const handleJoinCrackMode = () => {
    if (!user) {
      navigate({ 
        to: '/login',
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        search: { redirectTo: '/leetcode-setup' } as any
      });
    } else {
      navigate({ to: '/leetcode-setup' });
    }
  };

  if (isLoadingAuth) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="yellow.400" />
          <Text color="gray.400">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  const shouldShowJoinCTA = !user || !hasProfile;

  return (
    <Box minH="100vh" py={{base: 0, md: 8}} overflow="visible">
      <Container maxW="container.xl" overflow="visible">
        <VStack gap={6} align="stretch">
          {/* Hero CTA Card - Gaming Style */}
          {shouldShowJoinCTA && (
            <Box 
              position="relative"
              overflow="visible"
              mb={{base: 4, md: 8}}
            >
              <Box
                bg={{ 
                  base: 'linear-gradient(135deg, rgba(234, 179, 8, 0.05) 0%, rgba(251, 146, 60, 0.05) 100%)',
                  _dark: 'linear-gradient(135deg, rgba(234, 179, 8, 0.05) 0%, rgba(251, 146, 60, 0.1) 100%)'
                }}
                borderRadius="2xl"
                position="relative"
                overflow="visible"
                border="1px solid"
                borderColor={{ base: 'gray.200', _dark: 'gray.800' }}
                minH="300px"
              >
                {/* Background glow effects */}
                <Box
                  position="absolute"
                  top="0"
                  right="0"
                  w="500px"
                  h="500px"
                  // bg={{base: "yellow.400", _dark: "yellow.900"}}
                  opacity={{ base: 0.05, _dark: 0.1 }}
                  filter="blur(100px)"
                  pointerEvents="none"
                  zIndex={0}
                />

                <Flex
                  direction={{ base: 'column', md: 'row' }}
                  align="center"
                  position="relative"
                  zIndex={1}
                  minH="300px"
                >
                  {/* Left side - Content */}
                  <VStack
                    align={{ base: 'center', md: 'start' }}
                    gap={6}
                    p={{ base: 4, md: 12 }}
                    flex={1}
                    textAlign={{ base: 'center', md: 'left' }}
                  >
                    {/* Badge */}
                    <HStack
                      bg={{ base: 'yellow.400/10', _dark: 'yellow.400/20' }}
                      borderRadius="full"
                      px={4}
                      py={1.5}
                      border="1px solid"
                      borderColor={{ base: 'yellow.400/20', _dark: 'yellow.400/30' }}
                    >
                      <Icon color="orange.400" fontSize="sm">
                        <FaFire />
                      </Icon>
                      <Text fontSize="sm" fontWeight="bold" color={{base: "yellow.500", _dark: "yellow.400"}}>
                        BETA ACCESS
                      </Text>
                    </HStack>

                    {/* Title */}
                    <VStack align={{ base: 'center', md: 'start' }} gap={2}>
                      <Text
                        fontSize={{ base: '3xl', md: '5xl' }}
                        fontWeight="black"
                        color={{ base: 'gray.900', _dark: 'gray.50' }}
                        letterSpacing="tight"
                        lineHeight="1"
                      >
                        CRACKMODE LEADERBOARD
                      </Text>
                      <Text
                        fontSize={{ base: 'md', md: 'lg' }}
                        color={{ base: 'gray.600', _dark: 'gray.400' }}
                        fontWeight="600"
                        maxW="600px"
                      >
                        The competitive LeetCode platform. Climb divisions, compete weekly, dominate the leaderboard.
                      </Text>
                    </VStack>

                    {/* CTA Buttons */}
                    <HStack gap={3} pt={2}>
                      <Button
                        size="lg"
                        bg="yellow.400"
                        color="gray.900"
                        fontWeight="black"
                        fontSize="md"
                        px={8}
                        h="56px"
                        borderRadius="xl"
                        _hover={{
                          bg: 'yellow.300',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 32px rgba(234, 179, 8, 0.5)'
                        }}
                        _active={{ bg: 'yellow.500' }}
                        onClick={handleJoinCrackMode}
                        transition="all 0.2s"
                      >
                        Join Now
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        borderColor={{ base: 'gray.300', _dark: 'gray.700' }}
                        color={{ base: 'gray.700', _dark: 'gray.300' }}
                        fontWeight="semibold"
                        fontSize="md"
                        px={6}
                        h="56px"
                        borderRadius="xl"
                        _hover={{
                          bg: { base: 'gray.100', _dark: 'gray.800' },
                          borderColor: { base: 'gray.400', _dark: 'gray.600' }
                        }}
                        transition="all 0.2s"
                      >
                        Learn More
                      </Button>
                    </HStack>
                  </VStack>

                  {/* Right side - Illustration BREAKING OUT */}
                  <Box
                    display={{ base: 'none', md: 'block' }}
                    position="absolute"
                    right="-60px"
                    top="50%"
                    transform="translateY(-50%)"
                    w="500px"
                    h="500px"
                    zIndex={2}
                  >
                    {/* Glow behind character */}
                    <Box
                      position="absolute"
                      inset={0}
                      bg="radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, transparent 70%)"
                      filter="blur(40px)"
                    />

                    {/* Floating code symbols */}
                    <Box
                      position="absolute"
                      top="20%"
                      left="10%"
                      animation="float 4s ease-in-out infinite"
                    >
                      <Box
                        bg={{ base: 'blue.500/10', _dark: 'blue.500/20' }}
                        borderRadius="lg"
                        p={3}
                        border="1px solid"
                        borderColor={{ base: 'blue.500/30', _dark: 'blue.500/40' }}
                        backdropFilter="blur(10px)"
                      >
                        <Text fontSize="xs" fontFamily="monospace" color="blue.400" fontWeight="bold">
                          {'</>'}
                        </Text>
                      </Box>
                    </Box>

                    <Box
                      position="absolute"
                      bottom="30%"
                      left="5%"
                      animation="float 3s ease-in-out infinite"
                      animationDelay="1s"
                    >
                      <Box
                        bg={{ base: 'green.500/10', _dark: 'green.500/20' }}
                        borderRadius="lg"
                        p={3}
                        border="1px solid"
                        borderColor={{ base: 'green.500/30', _dark: 'green.500/40' }}
                        backdropFilter="blur(10px)"
                      >
                        <Text fontSize="xs" fontFamily="monospace" color="green.400" fontWeight="bold">
                          {'{}'}
                        </Text>
                      </Box>
                    </Box>

                    {/* Main character */}
                    <Flex
                      position="relative"
                      w="full"
                      h="full"
                      align="center"
                      justify="center"
                    >
                      <Box
                        position="relative"
                        w="350px"
                        h="350px"
                        bgGradient="to-br"
                        gradientFrom={{base: "green.300", _dark: "green.500"}}
                        gradientVia={{base: "orange.400", _dark: "orange.500"}}
                        gradientTo={{base: "red.300", _dark: "red.400"}}
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow={{base: "0 30px 80px rgba(234, 179, 8, 0.4)", _dark: "0 30px 80px rgba(234, 179, 8, 0.3)"}}
                      >
                        <Text fontSize="9xl" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))">
                          🚀
                        </Text>
                      </Box>
                    </Flex>

                    {/* Rank badge floating */}
                    <Box
                      position="absolute"
                      top="10%"
                      right="10%"
                      animation="float 3.5s ease-in-out infinite"
                      animationDelay="0.5s"
                      css={{
                        '@keyframes float': {
                          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                          '50%': { transform: 'translateY(-12px) scale(1.05)' },
                        },
                      }}
                    >
                      <Box
                        bg="yellow.400"
                        borderRadius="full"
                        w="80px"
                        h="80px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxShadow="0 8px 24px rgba(234, 179, 8, 0.5)"
                        border="3px solid"
                        borderColor="yellow.300"
                      >
                        <VStack gap={0}>
                          <Text fontSize="2xl" fontWeight="black" color="gray.900">
                            #1
                          </Text>
                          <Text fontSize="xs" fontWeight="bold" color="gray.900">
                            RANK
                          </Text>
                        </VStack>
                      </Box>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            </Box>
          )}

          {/* User's Stats Card (only if they have a profile) */}
          {myProfile && (
            <MyStatsCard
              profile={myProfile}
              promotionStatus={promotionStatus}
            />
          )}

          {/* Leaderboard Table */}
          {isLoadingGlobal ? (
            <Flex justify="center" py={10}>
              <Spinner size="xl" color="yellow.400" />
            </Flex>
          ) : (
            <LeaderboardTable
              profiles={globalLeaderboard?.profiles || []}
              myProfile={myProfile}
              showDivision={true}
              getZoneStatus={getZoneStatus}
            />
          )}
        </VStack>
      </Container>
    </Box>
  );
}