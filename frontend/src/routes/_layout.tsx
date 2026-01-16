import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppLayout from '../AppLayout';

// Define the loader function with conditional dynamic import
export async function loader({ location }: { location: { pathname: string } }) {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Client-side: return empty data
    return {
      doc: undefined,
      breadcrumbs: [],
      headings: [],
      currentPath: location.pathname,
      baseUrl: window.location.origin
    };
  }

  // Server-side only: dynamic import
  try {
    const { getDocumentFromPath, getBreadcrumbItems, getHeadings } = await import(
      /* @vite-ignore */
      '@/hooks/crackmode/server-data.server'
    );

    const doc = getDocumentFromPath(location.pathname);
    const { structuredDataItems: breadcrumbs } = getBreadcrumbItems(location.pathname);
    const headings = getHeadings(doc);

    return {
      doc,
      breadcrumbs,
      headings,
      currentPath: location.pathname,
      baseUrl: ''
    };
  } catch (error) {
    console.error('Error loading server data:', error);
    return {
      doc: undefined,
      breadcrumbs: [],
      headings: [],
      currentPath: location.pathname,
      baseUrl: ''
    };
  }
}

function Layout() {
  const loaderData = Route.useLoaderData();
  return (
    <AppLayout
      serverDoc={loaderData?.doc}
      serverBreadcrumbs={loaderData?.breadcrumbs || []}
      serverHeadings={loaderData?.headings || []}
      serverCurrentPath={loaderData?.currentPath}
      serverBaseUrl={loaderData?.baseUrl}
    >
      <Outlet />
    </AppLayout>
  );
}

export const Route = createFileRoute('/_layout')({
  component: Layout,
  loader,
  loaderDeps: () => ({ runOnClient: false }),
});