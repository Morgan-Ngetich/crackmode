import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  Spacer,
  Menu,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  IconButton,
  Drawer,
  Portal,
  useBreakpointValue,
  Collapsible,
  useDisclosure,
  Heading,
  Icon
} from '@chakra-ui/react';
import { IoMenu } from "react-icons/io5";
import { FaChevronDown, FaSearch, FaTimes, FaCalendar, FaTrophy, FaBook } from 'react-icons/fa';
import { IoSync } from "react-icons/io5";
import { Avatar } from '@/components/ui/avatar';
import { ColorModeButton } from '@/components/ui';
import Sidebar from './Sidebar';
import LeaderboardSidebar from '@/components/leaderboard/LeaderboardSidebar';
import { DocsSearch } from './DocsSearch';
import ViewCalendar from "@/components/calendar/ViewCalendar";
import { useAuth } from '@/hooks/auth/useAuth';
import { useSession } from '@/hooks/auth/useSession';
import { useNavigate } from '@tanstack/react-router';
import { useNavigateWithRedirect } from '@/hooks/auth/authState';

type HeaderMode = 'home' | 'docs' | 'leaderboard';

interface CrackModeHeaderProps {
  mode?: HeaderMode;
  // Leaderboard-specific props
  onSync?: () => void;
  isSyncing?: boolean;
  isMyProfile?: boolean;
}

const CrackModeHeader: React.FC<CrackModeHeaderProps> = ({
  mode = 'docs',
  onSync,
  isSyncing = false,
  isMyProfile = false
}) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { open: isSearchOpen, onToggle: toggleSearch, onClose: closeSearch } = useDisclosure();

  const { isLoggingOut, signOut } = useAuth();
  const { user, isLoading } = useSession();
  const navigate = useNavigate();
  const navigateWithRedirect = useNavigateWithRedirect();

  // Responsive breakpoints
  const isMobile = useBreakpointValue({ base: true, md: false });
  const showFullSearch = useBreakpointValue({ base: false, lg: true });

  // Color mode values
  const bgColor = { base: 'white', _dark: 'gray.900' };
  const borderColor = { base: 'gray.200', _dark: 'gray.700' };

  const handleNavigation = (url: string) => {
    navigate({ to: url });
    closeSearch();
  };

  // Mode-specific content
  const getModeContent = () => {
    switch (mode) {
      case 'leaderboard':
        return {
          icon: <FaTrophy />,
          iconColor: 'yellow.400',
          title: 'Leaderboard',
          showCalendar: false,
          showSearch: false,
          rightAction: onSync && isMyProfile && (
            <Button onClick={onSync} loading={isSyncing} loadingText="Syncing..." size="sm">
              <Icon fontSize="sm" fontWeight={"bold"}>
                <IoSync />
              </Icon>
              Sync Stats
            </Button>
          )
        };
      case 'docs':
      default:
        return {
          icon: <FaBook />,
          iconColor: 'teal.500',
          title: 'Docs',
          showCalendar: true,
          showSearch: true,
          searchPlaceholder: 'Search CrackMode docs...',
          rightAction: null
        };
    }
  };

  const modeContent = getModeContent();

  return (
    <>
      <Box
        as="header"
        w="100%"
        bg={bgColor}
        borderBottom="1px solid"
        borderColor={borderColor}
        position="sticky"
        top="0"
        zIndex="100"
        transition="all 0.2s"
        py={0}
      >
        {/* Main Header Row */}
        <Flex
          px={{ base: 4, md: 6, lg: 8 }}
          py={3}
          align="center"
          minH="60px"
        >
          {mode !== "home" && (
            <IconButton
              aria-label="Open menu"
              display={{ base: "flex", md: "none" }}
              variant="ghost"
              onClick={() => setDrawerOpen(true)}
              mr={2}
            >
              <IoMenu />
            </IconButton>
          )}

          {/* Logo/Branding + Mode Title */}
          <HStack gap={2} flex={{ base: "1", md: "0" }} justifySelf={'start'}>
            <HStack
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
              fontWeight="bold"
              letterSpacing="-0.5px"
              cursor="pointer"
              onClick={() => navigate({ to: "/" })}
              gap={0}
            >
              <Text color="teal.500">Crack</Text>
              <Text color="orange.400">Mode</Text>

              {isMobile && mode !== "home" && (
                <Box
                  ml={1}
                  mb={1}
                  p={0}
                >
                  <Icon color={modeContent.iconColor} fontSize={"sm"}>
                    {modeContent.icon}
                  </Icon>
                </Box>
              )}
            </HStack>

            {/* Mode Title (Desktop) */}
            {mode !== "home" && (
              <HStack gap={0} display={{ base: "none", md: "flex" }} mt="2">
                <Icon fontSize="xs" color={modeContent.iconColor}>
                  {modeContent.icon}
                </Icon>
                <Heading size="xs" color={modeContent.iconColor}>
                  {modeContent.title}
                </Heading>
              </HStack>
            )}
          </HStack>

          {/* Desktop Search (Only for docs mode) */}
          {mode !== "home" && modeContent.showSearch && typeof window !== "undefined" && showFullSearch && (
            <Box flex="1" maxW="600px" mx={6}>
              <DocsSearch
                onNavigate={handleNavigation}
                placeholder={modeContent.searchPlaceholder!}
                maxWidth="100%"
                showFilters={true}
              />
            </Box>
          )}

          {/* Tablet Search Icon (Only for docs mode) */}
          {mode !== "home" && modeContent.showSearch && typeof window !== "undefined" && !showFullSearch && !isMobile && (
            <IconButton
              aria-label="Toggle Search"
              variant="ghost"
              size="sm"
              onClick={toggleSearch}
              mx={2}
            >
              {isSearchOpen ? <FaTimes /> : <FaSearch />}
            </IconButton>
          )}

          <Spacer />

          {/* User Menu & Controls */}
          <HStack gap={2}>
            {/* Mobile Search Icon (Only for docs mode) */}
            {mode !== "home" && modeContent.showSearch && typeof window !== "undefined" && isMobile && (
              <IconButton
                aria-label="Toggle Search"
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
              >
                {isSearchOpen ? <FaTimes /> : <FaSearch />}
              </IconButton>
            )}

            {/* Calendar (Docs mode only) */}
            {mode !== "home" && modeContent.showCalendar && (
              <>
                <IconButton
                  variant="plain"
                  onClick={() => setIsCalendarOpen(true)}
                  aria-label="Open Calendar"
                >
                  <FaCalendar />
                </IconButton>
                <ViewCalendar
                  isOpen={isCalendarOpen}
                  onClose={() => setIsCalendarOpen(false)}
                  page="crackmode/docs"
                />
              </>
            )}

            {/* Mode-specific right action (e.g., Sync button) */}
            {!isMobile && modeContent.rightAction}

            {/* Color Mode Toggle */}
            {(!isMobile || mode !== "docs") && <ColorModeButton size="sm" />}

            {/* User Menu */}
            {isLoading ? (
              <HStack gap={2} align="center">
                <SkeletonCircle size="8" />
                <SkeletonText noOfLines={1} width="80px" display={{ base: "none", sm: "block" }} />
              </HStack>
            ) : user ? (
              <Menu.Root>
                <Menu.Trigger asChild>
                  <Button variant="ghost" size="sm" disabled={isLoggingOut}>
                    {isLoggingOut ? (
                      <HStack gap={2}>
                        <Spinner size="sm" />
                        <Text display={{ base: "none", sm: "inline" }}>Logging out...</Text>
                      </HStack>
                    ) : (
                      <HStack gap={2}>
                        <Avatar size="sm" name={user.user_metadata?.full_name} src={user.user_metadata?.avatar_url} />
                        <Text display={{ base: 'none', lg: 'inline' }} fontWeight="medium">
                          {user.user_metadata?.full_name}
                        </Text>
                        <FaChevronDown size={10} />
                      </HStack>
                    )}
                  </Button>
                </Menu.Trigger>

                <Menu.Positioner>
                  <Menu.Content
                    bg={bgColor}
                    border="1px solid"
                    borderColor={borderColor}
                    borderRadius="md"
                    shadow="lg"
                    py={2}
                    minW="180px"
                  >
                    {mode === 'leaderboard' && isMobile && modeContent.rightAction && (
                      <Menu.Item value='sync_button'>
                        {/* Mobile Sync Button (Leaderboard mode only) */}
                        <Box>
                          {modeContent.rightAction}
                        </Box>
                      </Menu.Item>
                    )}
                    <Menu.Item
                      value="logout"
                      color="red.500"
                      onSelect={() => {
                        if (!isLoggingOut) signOut();
                      }}
                      _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <HStack gap={2}>
                          <Spinner size="sm" />
                          <Text>Logging out...</Text>
                        </HStack>
                      ) : (
                        'Logout'
                      )}
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>
            ) : (
              <Button
                size="sm"
                onClick={() => navigateWithRedirect('/login')}
                _hover={{ bg: { base: 'gray.100', _dark: 'gray.700' } }}
                border="1px solid"
                borderColor={borderColor}
              >
                <Text display={{ base: "none", sm: "inline" }}>Get Started for Free</Text>
                <Text display={{ base: "inline", sm: "none" }}>Login</Text>
              </Button>
            )}
          </HStack>
        </Flex>

        {/* Mobile/Tablet Search Row (Docs mode only) */}
        {modeContent.showSearch && !showFullSearch && (
          <Collapsible.Root open={isSearchOpen}>
            <Collapsible.Content>
              <Box px={{ base: 4, md: 6 }} pb={3} borderColor={borderColor}>
                <DocsSearch
                  onNavigate={handleNavigation}
                  placeholder={modeContent.searchPlaceholder!}
                  maxWidth="100%"
                  showFilters={true}
                />
              </Box>
            </Collapsible.Content>
          </Collapsible.Root>
        )}
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer.Root
        open={drawerOpen}
        onOpenChange={(e) => setDrawerOpen(e.open)}
        placement="start"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header borderBottom="1px solid" borderColor={borderColor} bg={bgColor}>
                <Drawer.Title>
                  <HStack justify="space-between" w="full">
                    <HStack
                      fontSize="xl"
                      fontWeight="bold"
                      letterSpacing="-0.5px"
                      cursor="pointer"
                      onClick={() => {
                        navigate({ to: '/' });
                        setDrawerOpen(false);
                      }}
                      gap={0}
                    >
                      <Text color="teal.500">Crack</Text>
                      <Text color="orange.400">Mode</Text>
                    </HStack>
                    <ColorModeButton variant="surface" />
                  </HStack>
                </Drawer.Title>
                <Drawer.CloseTrigger />
              </Drawer.Header>

              <Drawer.Body p={0}>
                {/* Show appropriate sidebar based on mode */}
                {mode === 'leaderboard' ? <LeaderboardSidebar /> : <Sidebar />}
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default CrackModeHeader;