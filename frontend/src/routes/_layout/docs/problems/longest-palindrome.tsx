import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyLongestPalindrome= lazy(() => import("@/components/docs/problems/longest-palindrome.mdx"));

function LongestPalindrome() {
  return (
      <LazyLongestPalindrome />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/longest-palindrome")({
  component: LongestPalindrome,
});