import { useEffect, useState } from "react";
import type { HeadingData } from "@/client/types";
import type { EnhancedSearchableDoc } from "@/client/types/search";

export function useHeadings(doc?: EnhancedSearchableDoc): HeadingData[] {
  const [headings, setHeadings] = useState<HeadingData[]>([]);

  useEffect(() => {
    const syncHeadingsWithDOM = () => {
      // Use doc headings as the source of truth initially
      const sourceHeadings = doc?.headings || [];
      
      const elements = Array.from(
        document.querySelectorAll("h2, h3, h4")
      ) as HTMLElement[];

      if (elements.length === 0) {
        // Fall back to doc headings
        if (sourceHeadings.length > 0) {
          setHeadings(sourceHeadings.map((heading, index) => ({
            id: heading.id || `heading-${index}`,
            text: heading.text,
            level: heading.level || 2
          })));
        }
        return;
      }

      const processedHeadings: HeadingData[] = [];
      
      elements.forEach((el, index) => {
        // Try to find matching heading from doc
        const matchingHeading = sourceHeadings[index];
        
        // Use doc heading ID if available, otherwise generate from text
        let id = matchingHeading?.id;
        
        if (!id) {
          // Try to get ID from DOM element
          id = el.id || `heading-${index}`;
          
          // Ensure the DOM element has the ID
          el.id = id;
        } else {
          // Ensure DOM element has the doc-provided ID
          el.id = id;
        }

        processedHeadings.push({
          id,
          text: el.innerText || el.textContent || matchingHeading?.text || "",
          level: Number(el.tagName.replace("H", "")) || matchingHeading?.level || 2,
        });
      });

      setHeadings(processedHeadings);
    };

    // Run initially
    syncHeadingsWithDOM();

    // Optional: Set up a MutationObserver to handle dynamic content
    const observer = new MutationObserver(syncHeadingsWithDOM);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => observer.disconnect();
  }, [doc]);

  return headings;
}