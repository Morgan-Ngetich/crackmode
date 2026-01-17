import { Box, HStack } from '@chakra-ui/react';
import { Outlet } from '@tanstack/react-router';
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

  // Use doc to get headings (works for both client and server)
  const doc = isClient ? clientDoc : serverDoc;
  const headings = useHeadings(doc); // Pass the document, not serverHeadings

  const breadcrumbs = isClient ? clientBreadcrumbData.structuredDataItems : serverBreadcrumbs;
  const currentPath = isClient ? window.location.pathname : (serverCurrentPath || '/');
  const baseUrl = isClient ? window.location.origin : (serverBaseUrl || '');

  console.log("docs", doc);
  console.log("headings", headings);
  console.log("breadcrumbs", breadcrumbs);
  console.log("currentPath", currentPath);
  console.log("baseUrl", baseUrl);
  
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
        <DocsLayout headings={headings} breadcrumbs={breadcrumbs}>
          <Outlet />
        </DocsLayout>
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