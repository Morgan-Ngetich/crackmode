import { useState, useRef, useEffect } from "react"
import {
  Box,
  Container,
  Flex,
  IconButton,
  Link
} from "@chakra-ui/react"
import { FaGithub } from "react-icons/fa"
import TableOfContents from "./TableOfContents"
import type { HeadingData, BreadcrumbItem } from "@/client/types/docs"
import { BreadcrumbRoot, BreadcrumbLink, BreadcrumbCurrentLink, Tooltip } from "@/components/ui"

const GITHUB_BASE = "https://github.com/Morgan-Ngetich/crackmode/blob/master/frontend/src/components/docs"

const PATH_EXCEPTIONS: Record<string, string> = {
  "/docs": "introduction.mdx",
  "/docs/introduction": "introduction.mdx",
  "/docs/leetcode75": "leetcode75/leetcode75.mdx",
  "/docs/leetcode75/arrays-strings/introduction": "leetcode75/arrays-strings/intro.mdx",
}

function getGitHubFileUrl(pathname: string): string {
  const path = pathname.replace(/\/$/, "")
  if (PATH_EXCEPTIONS[path]) {
    return `${GITHUB_BASE}/${PATH_EXCEPTIONS[path]}`
  }
  const slug = path.replace(/^\/docs/, "")
  return `${GITHUB_BASE}${slug}.mdx`
}

interface DocsLayoutProps {
  children: React.ReactNode
  headings: HeadingData[]
  breadcrumbs?: BreadcrumbItem[] // Add breadcrumbs prop
}

const DocsLayout = ({ children, headings, breadcrumbs = [] }: DocsLayoutProps) => {
  const [scrolled, setScrolled] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const githubUrl = typeof window !== "undefined" ? getGitHubFileUrl(window.location.pathname) : "#"

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrolled(scrollRef.current.scrollTop > 0)
    }
  }

  useEffect(() => {
    const current = scrollRef.current
    if (current) {
      current.addEventListener("scroll", handleScroll)
      return () => current.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const borderColor = { base: 'gray.200', _dark: 'gray.700' }

  // Convert breadcrumbs to display format
  const displayItems = breadcrumbs.map(item => ({
    title: item.title,
    url: item.url,
  }))

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Main Content (scrollable) */}
      <Box flex="1" h="100vh" overflowY="auto" ref={scrollRef}>
        <Container maxW="4xl" pt={4} pb={8} px={{ base: 4, md: 8 }}>
          {displayItems && displayItems.length > 0 && (
            <Flex
              align="center"
              justify="space-between"
              mb={{ base: 1, md: 6 }}
              position="sticky"
              top={0}
              zIndex="5"
              bg={scrolled ? { base: 'white', _dark: 'gray.900' } : 'transparent'}
              pb={2}
              pt={{ base: 1, md: 2 }}
              w="full"
            >
              <Box overflowX="auto" whiteSpace="nowrap" scrollbar="hidden" flex="1">
                <BreadcrumbRoot separator="/" separatorGap={2}>
                  {displayItems.map((item, index) => {
                    const isLast = index === displayItems.length - 1

                    return isLast ? (
                      <BreadcrumbCurrentLink key={index}>
                        {item.title}
                      </BreadcrumbCurrentLink>
                    ) : (
                      <BreadcrumbLink key={index} href={item.url}>
                        {item.title}
                      </BreadcrumbLink>
                    )
                  })}
                </BreadcrumbRoot>
              </Box>
              <Tooltip content="View source on GitHub">
                <Link href={githubUrl} target="_blank">
                  <IconButton
                    rel="noopener noreferrer"
                    aria-label="View source on GitHub"
                    variant="ghost"
                    size="xl"
                    flexShrink={0}
                  >
                    <FaGithub />
                  </IconButton>
                </Link>
              </Tooltip>
            </Flex>
          )}

          {/* Content */}
          <Box pb={16}>{children}</Box>
        </Container>
      </Box>

      {/* Desktop TOC */}
      <Box
        as="aside"
        w="300px"
        borderLeft="1px"
        borderColor={borderColor}
        py={6}
        display={{ base: "none", lg: "block" }}
        position="sticky"
        top={0}
        h="100vh"
        overflowY="auto"
      >
        <TableOfContents headings={headings} />
      </Box>
    </Flex>
  )
}

export default DocsLayout