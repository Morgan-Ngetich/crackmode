import { createFileRoute, Outlet } from "@tanstack/react-router";
import AppLayout from '../AppLayout';
import { getDocumentFromPath, getBreadcrumbItems, getHeadings } from "@/hooks/crackmode/server-data";

// Define the loader function
export async function loader({ location }: { location: { pathname: string } }) {
  const doc = getDocumentFromPath(location.pathname);
  const { structuredDataItems: breadcrumbs } = getBreadcrumbItems(location.pathname);
  const headings = getHeadings(doc);
  return {
    doc,
    breadcrumbs,
    headings,
    currentPath: location.pathname,
    baseUrl: typeof window !== 'undefined' ? window.location.origin : ''
  };
}
function Layout() {
  // Get loader data
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
});