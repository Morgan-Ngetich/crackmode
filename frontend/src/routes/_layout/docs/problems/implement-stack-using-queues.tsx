import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyImplementStacksUsingQueues= lazy(() => import("@/components/docs/problems/implement-stack-using-queues.mdx"));

function ImplementStacksUsingQueues() {
  return (
      <LazyImplementStacksUsingQueues />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/implement-stack-using-queues")({
  component: ImplementStacksUsingQueues,
});