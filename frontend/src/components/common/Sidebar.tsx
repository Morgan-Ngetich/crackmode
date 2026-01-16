import { useEffect } from "react"
import {
  VStack,
  Text,
  Flex,
  Icon,
  Collapsible,
  Box, // ✅ Add Box for styling
} from "@chakra-ui/react"
import { useRouter, Link } from "@tanstack/react-router" // ✅ Import Link from router
import { sidebarConfig } from "@/config/sidebarConfig"
import { FaChevronUp, FaChevronRight } from "react-icons/fa"
import { useSidebarStore } from "@/hooks/crackmode/stores/sidebarStore"

const Sidebar = () => {
  const router = useRouter()
  const {
    expandedSections,
    expandedLinks,
    setExpandedSections,
    toggleSection,
    toggleLink,
  } = useSidebarStore()

  // Initialize expanded sections based on current route (only on first load)
  useEffect(() => {
    const hasInitializedSections = Object.keys(expandedSections).length > 0

    if (!hasInitializedSections) {
      const initialExpanded: Record<string, boolean> = {}
      sidebarConfig.forEach((section) => {
        const hasCurrentPage = section.links.some(link =>
          router.state.location.pathname.startsWith(link.href)
        )
        initialExpanded[section.title] = hasCurrentPage
      })
      setExpandedSections(initialExpanded)
    }
  }, [router.state.location.pathname, expandedSections, setExpandedSections])

  const linkHoverBg = { base: 'gray.100', _dark: 'gray.700' }
  const activeLinkBg = { base: 'blue.50', _dark: 'blue.900' }
  const activeLinkColor = { base: 'blue.600', _dark: 'blue.200' }

  return (
    <VStack align="stretch" gap={1}>
      {sidebarConfig.map((section) => (
        <Collapsible.Root
          key={section.title}
          open={expandedSections[section.title]}
          onOpenChange={() => toggleSection(section.title)}
        >
          {/* Section Header */}
          <Collapsible.Trigger asChild>
            <Flex
              align="center"
              justify="space-between"
              py={2}
              px={3}
              cursor="pointer"
              _hover={{ bg: linkHoverBg }}
              borderRadius="md"
            >
              <Text
                fontWeight="semibold"
                fontSize="sm"
                textTransform="uppercase"
                letterSpacing="wide"
              >
                {section.title}
              </Text>
              <Icon
                as={expandedSections[section.title] ? FaChevronUp : FaChevronRight}
                w={4}
                h={4}
                color="gray.400"
              />
            </Flex>
          </Collapsible.Trigger>

          {/* Collapsible Links */}
          <Collapsible.Content>
            <VStack align="stretch" gap={1} px={4} py={2}>
              {section.links.map((link) => {
                const isActive = router.state.location.pathname === link.href
                const isLinkExpanded = expandedLinks[link.title]

                return (
                  <VStack align="start" key={link.href} gap={0}>
                    {/* Main link with toggle */}
                    <Flex
                      justify="space-between"
                      w="100%"
                      py={1}
                      px={3}
                      borderRadius="md"
                      fontSize="sm"
                      color={isActive ? activeLinkColor : "inherit"}
                      bg={isActive ? activeLinkBg : "transparent"}
                      cursor={link.children ? "pointer" : "default"}
                      _hover={{ bg: linkHoverBg }}
                      fontWeight={isActive ? "medium" : "normal"}
                      onClick={() => link.children && toggleLink(link.title)}
                    >
                      {/* ✅ Use TanStack Router Link */}
                      <Link
                        to={link.href}
                        style={{
                          textDecoration: 'none',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                        }}
                        onClick={(e) => link.children && e.preventDefault()}
                      >
                        {link.title}
                      </Link>

                      {link.children && (
                        <Icon
                          as={isLinkExpanded ? FaChevronUp : FaChevronRight}
                          w={4}
                          h={4}
                          color="gray.400"
                        />
                      )}
                    </Flex>

                    {/* Nested links (collapsible) */}
                    {link.children && isLinkExpanded && (
                      <VStack pl={4} mt={1} align="start" gap={0}>
                        {link.children.map((child) => {
                          const isChildActive = router.state.location.pathname === child.href
                          return (
                            <Link
                              key={child.href}
                              to={child.href}
                              style={{
                                textDecoration: 'none',
                                width: '100%',
                              }}
                            >
                              <Box
                                py={"4px"}
                                px={3}
                                w="100%"
                                borderRadius="md"
                                fontSize="sm"
                                color={isChildActive ? activeLinkColor : "fg.muted"}
                                bg={isChildActive ? activeLinkBg : "transparent"}
                                _hover={{
                                  bg: isChildActive ? activeLinkBg : linkHoverBg,
                                }}
                                fontWeight={isChildActive ? "medium" : "normal"}
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {child.title}
                              </Box>
                            </Link>
                          )
                        })}
                      </VStack>
                    )}
                  </VStack>
                )
              })}
            </VStack>
          </Collapsible.Content>
        </Collapsible.Root>
      ))}
    </VStack>
  )
}

export default Sidebar