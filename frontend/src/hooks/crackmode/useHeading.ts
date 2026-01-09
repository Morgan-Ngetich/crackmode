import { useMemo } from "react";
import type { HeadingData } from "@/client/types";
import type { EnhancedSearchableDoc } from "@/client/types/search";

export function useHeadings(doc?: EnhancedSearchableDoc): HeadingData[] {
  const headings = useMemo(() => {
    // If doc has headings, use them
    if (doc?.headings && doc.headings.length > 0) {
      return doc.headings.map((heading, index) => ({
        id: heading.id || `heading-${index}`,
        text: heading.text,
        level: heading.level || 2
      }));
    }
    
    return [];
  }, [doc]);

  return headings;
}