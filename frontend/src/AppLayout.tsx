// src/AppLayout.tsx
import { Box, Spinner, HStack } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';
import { Suspense } from "react";
import { useAuthPromptStore } from '@/hooks/auth/store/useAuthPromptStore';
import AuthPromptDialog from '@/components/auth/AuthPromptDialog';
import { useAuthPromptController } from '@/hooks/auth/store/useAuthPromptController';
import DocsLayout from "@/components/common/DocsLayout";
import Sidebar from "@/components/common/Sidebar";
import CrackModeHeader from "@/components/common/CrackModeHeader";
import DocumentSEOHead from "@/seo/DocumentSEOHead";
import { useDocumentFromPath } from "@/hooks/crackmode/useDocumentFromPath";
import { useBreadcrumbItems } from "@/hooks/crackmode/useBreadcrumbItems";
import { useHeadings } from "@/hooks/crackmode/useHeading";
import { type EnhancedSearchableDoc } from "@/client/types/search";
import { type BreadcrumbItem, type HeadingData } from "@/client/types/docs";

interface AppLayoutProps {
  serverDoc?: EnhancedSearchableDoc;
  serverBreadcrumbs?: BreadcrumbItem[];
  serverHeadings?: HeadingData[];
  serverCurrentPath?: string;
  serverBaseUrl?: string;
  children?: React.ReactNode; // Only if you want to use children instead of Outlet
}

const AppLayout: React.FC<AppLayoutProps> = ({
  serverDoc,
  serverBreadcrumbs = [],
  serverHeadings = [],
  serverCurrentPath,
  serverBaseUrl
}) => {
  useAuthPromptController();
  const { open, mode, setOpen } = useAuthPromptStore();

  const borderColor = { base: 'gray.200', _dark: 'gray.700' };
  const isClient = typeof window !== 'undefined';

  // Client-side hooks
  const clientDoc = useDocumentFromPath();
  const clientBreadcrumbData = useBreadcrumbItems();
  const clientHeadings = useHeadings();

  // Choose between server data (from loader) and client hooks
  const doc = isClient ? clientDoc : serverDoc;
  const breadcrumbs = isClient ? clientBreadcrumbData.structuredDataItems : serverBreadcrumbs;
  const headings = isClient ? clientHeadings : serverHeadings;
  const currentPath = isClient ? window.location.pathname : (serverCurrentPath || '/');
  const baseUrl = isClient ? window.location.origin : (serverBaseUrl || '');

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
            <Outlet /> {/* This renders child routes */}
          </DocsLayout>
        </Suspense>
      </HStack>
      {open && (
        <AuthPromptDialog
          open={open}
          showStayLoggedOut={mode === 'full'}
          onClose={() => setOpen(false)}
        />
      )}
    </Box>
  );
};

export default AppLayout;