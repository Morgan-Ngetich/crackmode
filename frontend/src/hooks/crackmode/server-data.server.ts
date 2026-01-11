import { type EnhancedSearchableDoc } from '@/client/types/search';
import type { BreadcrumbItem, HeadingData } from '@/client/types/docs';
import { sidebarConfig } from '@/config/sidebarConfig';
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';

// Cache for server-side rendering
let searchDataCache: EnhancedSearchableDoc[] | null = null;

function getSearchData(): EnhancedSearchableDoc[] {
  if (searchDataCache) {
    return searchDataCache;
  }

  const searchDataPath = path.join(process.cwd(), 'public/assets/searchData.json');
  
  
  if (!fs.existsSync(searchDataPath)) {
    console.warn('⚠️ searchData.json not found at:', searchDataPath);
    return [];
  }

  const rawData = fs.readFileSync(searchDataPath, 'utf-8');
  searchDataCache = JSON.parse(rawData) as EnhancedSearchableDoc[];
  
  return searchDataCache;
}

// Server-side version of useDocumentFromPath
export function getDocumentFromPath(pathname: string): EnhancedSearchableDoc | undefined {
  const SearchData = getSearchData();
  
  // Handle root path
  if (pathname === '/' || pathname === '/docs') {
    return SearchData.find(item => item.url === '/docs');
  }

  // Find the document that matches the current path
  const foundDoc = SearchData.find((item: EnhancedSearchableDoc) => {
    return item.url === pathname || pathname.endsWith(item.url);
  });

  return foundDoc;
}

// Server-side version of useBreadcrumbItems
export function getBreadcrumbItems(path: string): {
  displayItems: BreadcrumbItem[];
  structuredDataItems: BreadcrumbItem[];
} {
  const breadcrumbItems: BreadcrumbItem[] = [];

  // Build breadcrumbs by finding matching paths
  const findBreadcrumbPath = (currentPath: string) => {
    for (const section of sidebarConfig) {
      for (const link of section.links) {
        // Check direct match
        if (link.href === currentPath) {
          return { title: link.title, url: link.href };
        }

        // Check children
        if (link.children) {
          for (const child of link.children) {
            if (child.href === currentPath) {
              return { title: child.title, url: child.href, parent: link };
            }
          }
        }
      }
    }
    return null;
  };

  // Build breadcrumb trail
  const segments = path.split('/').filter(Boolean);
  let currentPath = '';

  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;

    const match = findBreadcrumbPath(currentPath);
    if (match) {
      // If this is a child item and we haven't added its parent, add it first
      if (match.parent && !breadcrumbItems.some(item => item.url === match.parent?.href)) {
        breadcrumbItems.push({
          title: match.parent.title,
          url: match.parent.href,
          position: breadcrumbItems.length + 1
        });
      }
      breadcrumbItems.push({
        title: match.title,
        url: match.url,
        position: breadcrumbItems.length + 1
      });
    } else {
      // Fallback for unmatched segments
      const label = segments[i]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      breadcrumbItems.push({
        title: label,
        url: currentPath,
        position: breadcrumbItems.length + 1
      });
    }
  }

  // Filter out items you don't want to display
  const displayItems = breadcrumbItems.filter(item =>
    item.url && (
      !item.url.startsWith('/docs') ||
      item.url !== '/'
    )
  );

  // For structured data, include the full path
  const structuredDataItems: BreadcrumbItem[] = [
    { title: 'CrackMode', url: '/', position: 1 },
    ...breadcrumbItems.map((item, index) => ({
      ...item,
      position: index + 2
    }))
  ];

  return {
    displayItems,
    structuredDataItems
  };
}

// Server-side version of useHeadings - Option 1: Pre-extracted headings
function getHeadingsFromDoc(doc: EnhancedSearchableDoc | undefined): HeadingData[] {
  if (!doc || !doc.headings) return [];
  
  return doc.headings.map((heading, index) => ({
    id: heading.id || `heading-${index}`,
    text: heading.text,
    level: heading.level || 2
  }));
}

// Server-side version of useHeadings - Option 2: Parse HTML content
function extractHeadingsFromHtml(htmlContent: string): HeadingData[] {
  const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h\1>/gi;
  const headings: HeadingData[] = [];
  const idCountMap: Record<string, number> = {};
  
  let match;
  while ((match = headingRegex.exec(htmlContent)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    let baseId = slugify(text, { lower: true, strict: true });
    
    if (idCountMap[baseId]) {
      idCountMap[baseId] += 1;
      baseId = `${baseId}-${idCountMap[baseId]}`;
    } else {
      idCountMap[baseId] = 1;
    }
    
    headings.push({
      id: baseId,
      text,
      level
    });
  }
  
  return headings;
}

// Combined function that tries both approaches
export function getHeadings(doc: EnhancedSearchableDoc | undefined, htmlContent?: string): HeadingData[] {
  if (doc?.headings?.length) {
    return getHeadingsFromDoc(doc);
  }
  
  if (htmlContent) {
    return extractHeadingsFromHtml(htmlContent);
  }
  
  return [];
}