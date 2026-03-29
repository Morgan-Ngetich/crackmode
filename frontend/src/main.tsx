import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, Flex, Text, Button, Icon } from '@chakra-ui/react';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';
import { ColorModeProvider } from '@/components/ui/colormode/color-mode';
import themeSystem from './theme';
import { Toaster } from '@/components/ui/toaster';
import { GlobalStyles } from './components/ui/GlobalStyles';
import { MDXProvider } from '@mdx-js/react';
import MDXComponents from '@/components/common/MDXComponents';
import { HelmetProvider } from 'react-helmet-async';
import { useBannedCheck } from '@/hooks/auth/useBannedCheck';
import { FaWhatsapp } from 'react-icons/fa';
import { useAuth } from './hooks/auth/useAuth';

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

const BannedGuard = ({ children }: { children: React.ReactNode }) => {
  const { isBanned, isLoading } = useBannedCheck();
  const { signOut } = useAuth(); // Get signOut function to allow banned users to sign out

  if (isLoading) return <>{children}</>;

  if (isBanned) {
    return (
      <Flex minH="100vh" align="center" justify="center" direction="column" gap={6}
        bg={{ base: "gray.50", _dark: "gray.950" }}
      >
        <Text fontSize="4xl">🚫</Text>
        <Flex direction="column" align="center" gap={2}>
          <Text fontSize="xl" fontWeight="bold">Account Suspended</Text>
          <Text color="gray.500" textAlign="center" maxW="sm">
            Your account has been suspended. Join our WhatsApp community to appeal or inquire further.
          </Text>
        </Flex>
        <a href="https://chat.whatsapp.com/Biz5sc2ow3v8Mg2aId6yOH" target="_blank" rel="noopener noreferrer">
          <Button
            bg="green.500"
            color="white"
            size="lg"
            gap={2}
            _hover={{ bg: "green.600" }}
          >
            <Icon boxSize={5}>
              <FaWhatsapp />
            </Icon>
            Join our WhatsApp
          </Button>
        </a >
        <Button
          size="lg"
          onClick={async () => {
            await signOut();
            window.location.href = '/signup';
          }}
        >
          Sign in with a different account
        </Button>
      </Flex>
    );
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <BannedGuard>
      <RouterProvider router={router} />
    </BannedGuard>
  );
};

const AppTree = () => (
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider value={themeSystem}>
          <ColorModeProvider>
            <GlobalStyles />
            <MDXProvider components={MDXComponents}>
              <App />
              <Toaster />
            </MDXProvider>
          </ColorModeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);

if (typeof window !== 'undefined') {
  const container = document.getElementById("root")!;
  createRoot(container).render(<AppTree />);
}