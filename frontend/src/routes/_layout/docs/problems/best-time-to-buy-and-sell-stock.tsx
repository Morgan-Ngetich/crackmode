import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyBestTimeToBuyAndSellStock = lazy(() => import("@/components/docs/problems/best-time-to-buy-and-sell-stock.mdx"));

function BestTimeToBuyAndSellStock() {
  return (
      <LazyBestTimeToBuyAndSellStock />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/best-time-to-buy-and-sell-stock")({
  component: BestTimeToBuyAndSellStock,
});