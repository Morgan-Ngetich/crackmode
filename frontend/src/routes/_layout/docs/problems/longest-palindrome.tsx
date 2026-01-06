import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense, lazy } from "react";

// Lazy load the MDX component
const LazyLongestPalindrome= lazy(() => import("@/components/docs/problems/longest-palindrome.mdx"));

function LongestPalindrome() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyLongestPalindrome />
    </Suspense>
  );
}

export const Route = createFileRoute("/_layout/docs/problems/longest-palindrome")({
  component: LongestPalindrome,
});