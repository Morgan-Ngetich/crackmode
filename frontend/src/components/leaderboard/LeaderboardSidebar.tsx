import { useState } from "react";
import {
  VStack,
  Text,
  Flex,
  Icon,
  Box,
} from "@chakra-ui/react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  FaHome,
  FaUsers,
  FaChevronLeft,
} from "react-icons/fa";

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ComponentType;
}

const links: SidebarLink[] = [
  { title: "Home", href: "/leaderboard", icon: FaHome },
  { title: "Divisions", href: "/leaderboard/divisions", icon: FaUsers },
];

const LeaderboardSidebar = () => {
  const routerState = useRouterState();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBorderHovered, setIsBorderHovered] = useState(false);

  const linkHoverBg = { base: 'gray.100', _dark: 'gray.800' };
  const activeLinkBg = { base: 'blue.50', _dark: 'blue.900/20' };
  const activeLinkColor = { base: 'blue.600', _dark: 'blue.400' };

  return (
    <Box
      position="sticky"
      top={0}
      h="100%"
      w={{base: "100%", md: isCollapsed ? "20" : "60"}}
      transition="width 0.3s ease"
      bg={{ base: "transparent", md: { base: "white", _dark: "gray.900" } }}
      borderRight={{ base: "none", md: "1px solid" }}
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
    >
      <Box
        w="100%"
        overflow="hidden"
        px={isCollapsed ? 2 : 4}
        pt={8}
        transition="padding 0.3s ease"

      >
        <VStack align="stretch" gap={1}                  >
          {links.map((link) => {
            const isActive = routerState.location.pathname === link.href ||
              routerState.location.pathname.startsWith(link.href + '/');

            return (
              <Link
                key={link.href}
                to={link.href}
                style={{ textDecoration: "none", width: "100%" }}

              >
                <Flex
                  align="center"
                  justify={isCollapsed ? "center" : "flex-start"}
                  gap={isCollapsed ? 0 : 3}
                  py={2.5}
                  px={isCollapsed ? 2 : 3}
                  borderRadius="md"
                  color={isActive ? activeLinkColor : "fg.muted"}
                  bg={isActive ? activeLinkBg : "transparent"}
                  _hover={{ bg: isActive ? activeLinkBg : linkHoverBg }}
                  cursor="pointer"
                  transition="all 0.15s"
                  fontWeight={isActive ? "semibold" : "normal"}
                  position="relative"
                >
                  {/* Active indicator */}
                  {isActive && (
                    <Box
                      position="absolute"
                      left={0}
                      top="50%"
                      transform="translateY(-50%)"
                      w="3px"
                      h="70%"
                      bg="blue.500"
                      borderRadius="full"
                    />
                  )}

                  <Icon
                    as={link.icon}
                    fontSize="lg"
                    ml={isActive && !isCollapsed ? 1.5 : 0}
                  />

                  {!isCollapsed && <Text fontSize="sm">{link.title}</Text>}
                </Flex>
              </Link>
            );
          })}
        </VStack>
      </Box>

      {/* Border right with hover area */}
      <Box
        position="absolute"
        top={0}
        right={-3}
        w={6}
        h="100%"
        onMouseEnter={() => setIsBorderHovered(true)}
        onMouseLeave={() => setIsBorderHovered(false)}
        cursor="col-resize"
        onClick={() => setIsCollapsed(!isCollapsed)}
        zIndex={10}
        display={{ base: "none", md: "block" }}
      >
        <Box
          position="absolute"
          left={3}
          top={0}
          w="1px"
          h="100%"
          bg={isBorderHovered ? "blue.500" : { base: "gray.200", _dark: "gray.700" }}
          transition="background 0.2s"
          display={{ base: "none", md: "block" }}
        />

        {isBorderHovered && (
          <Flex
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w={6}
            h={6}
            align="center"
            justify="center"
            bg={{ base: "white", _dark: "gray.800" }}
            borderWidth={1}
            borderColor={{ base: "gray.300", _dark: "gray.600" }}
            borderRadius="full"
            transition="all 0.2s"
            _hover={{ transform: "translate(-50%, -50%) scale(1.1)" }}
            cursor="pointer"
          >
            <Icon
              as={FaChevronLeft}
              color={{ base: "blue.600", _dark: "blue.400" }}
              fontSize="xs"
              transform={isCollapsed ? "rotate(180deg)" : "rotate(0deg)"}
              transition="transform 0.3s"
            />
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default LeaderboardSidebar;