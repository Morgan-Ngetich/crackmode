import { createFileRoute, Outlet } from '@tanstack/react-router';
import { getDocumentFromPath, getBreadcrumbItems, getHeadings } from "@/hooks/crackmode/server-data";
import DocsLayout from "@/components/common/DocsLayout";
import Sidebar from "@/components/common/Sidebar";
import CrackModeHeader from "@/components/common/CrackModeHeader";
import DocumentSEOHead from "@/seo/DocumentSEOHead";
import { useDocumentFromPath } from "@/hooks/crackmode/useDocumentFromPath";
import { useBreadcrumbItems } from "@/hooks/crackmode/useBreadcrumbItems";
import { useHeadings } from "@/hooks/crackmode/useHeading";
import { Box, Spinner, HStack } from '@chakra-ui/react';
import { Suspense } from "react";

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

function DocsLayoutRoute() {
  const loaderData = Route.useLoaderData();
  const isClient = typeof window !== 'undefined';
  
  // Client-side hooks
  const clientDoc = useDocumentFromPath();
  const clientBreadcrumbData = useBreadcrumbItems();
  const clientHeadings = useHeadings();
  
  // Choose between server data (from loader) and client hooks
  const doc = isClient ? clientDoc : loaderData?.doc;
  const breadcrumbs = isClient ? clientBreadcrumbData.structuredDataItems : (loaderData?.breadcrumbs || []);
  const headings = isClient ? clientHeadings : (loaderData?.headings || []);
  const currentPath = isClient ? window.location.pathname : (loaderData?.currentPath || '/');
  const baseUrl = isClient ? window.location.origin : (loaderData?.baseUrl || '');

  const borderColor = { base: 'gray.200', _dark: 'gray.700' };

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      <DocumentSEOHead
        doc={doc}
        breadcrumbs={breadcrumbs}
        currentPath={currentPath}
        baseUrl={baseUrl}
      />
      <CrackModeHeader page="crackmode/docs" />
      <HStack flex="1" align="start" gap={0} w="100%" overflow="hidden">
        {/* Sidebar */}
        <Box
          as="nav"
          w="280px"
          borderRight="1px solid"
          borderColor={borderColor}
          px={4}
          pt={8}
          display={{ base: "none", md: "block" }}
          position="sticky"
          top={0}
          h="100%"
          overflowY="auto"
        >
          <Sidebar />
        </Box>
        <Suspense fallback={<Spinner />}>
          {/* Main Docs Content */}
          <DocsLayout headings={headings}>
            <Outlet /> {/* This renders nested doc pages */}
          </DocsLayout>
        </Suspense>
      </HStack>
    </Box>
  );
}

export const Route = createFileRoute('/_layout/docs/_layout')({
  component: DocsLayoutRoute,
  loader,
});