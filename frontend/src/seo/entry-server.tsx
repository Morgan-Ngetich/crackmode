import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider } from '@/components/ui/colormode/color-mode';
import { MDXProvider } from '@mdx-js/react';
import {
  createMemoryHistory,
  createRouter,
  RouterProvider
} from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';
import themeSystem from '@/theme';

interface RenderResult {
  html: string;
  head: {
    title: string;
    meta: string;
    link: string;
    script: string;
  };
}

interface RenderOptions {
  url: string;
  cookies?: string;
  host?: string;
  protocol?: string;
}

export async function render({ url, cookies, host, protocol }: RenderOptions): Promise<RenderResult> {
  const helmetContext = {};

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        retry: false,
        refetchOnWindowFocus: false,
      }
    }
  });

  const memoryHistory = createMemoryHistory({ initialEntries: [url] });

  // Parse cookies for auth context
  let initialAuthState = null;
  if (cookies) {
    const sessionCookie = parseCookies(cookies)["sb_session"];
    if (sessionCookie) {
      try {
        initialAuthState = JSON.parse(decodeURIComponent(sessionCookie));
      } catch (error) {
        console.warn("Failed to parse auth cookie during SSR:", error);
      }
    }
  }

  const actualHost = host || 'crackmode.vercel.app';
  const actualProtocol = protocol || 'https';

  // Build the server context
  const serverContext = {
    isServer: true,
    queryClient,
    auth: initialAuthState,
    req: {
      url,
      headers: {
        cookie: cookies,
        host: actualHost,
        'x-forwarded-proto': actualProtocol
      }
    }
  };

  const router = createRouter({
    routeTree,
    history: memoryHistory,
    context: serverContext
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);

  // Preload all data for the route - this runs the loaders
  await router.load();

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  let MDXComponents: any = {};

  const mdxModule = await import('@/components/common/MDXComponents');
  MDXComponents = mdxModule.default;

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <ChakraProvider value={themeSystem}>
            <ColorModeProvider>
              <MDXProvider components={MDXComponents}>
                <RouterProvider router={router} />
              </MDXProvider>
            </ColorModeProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </StrictMode>
  );


  // Extract helmet data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { helmet } = helmetContext as any;

  return {
    html,
    head: helmet
      ? {
        title: helmet.title.toString(),
        meta: helmet.meta.toString(),
        link: helmet.link.toString(),
        script: helmet.script.toString(),
      }
      : {
        title: '',
        meta: '',
        link: '',
        script: '',
      }
  };
}

// Helper function to parse cookies
function parseCookies(cookieHeader: string): Record<string, string> {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [name, value] = cookie.split('=').map(c => c.trim());
    if (name) {
      cookies[name] = decodeURIComponent(value || '');
    }
    return cookies;
  }, {} as Record<string, string>);
}