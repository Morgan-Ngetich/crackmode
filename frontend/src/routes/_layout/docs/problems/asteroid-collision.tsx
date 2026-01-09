import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

// Lazy load the MDX component
const LazyAsteroidCollision = lazy(() => import("@/components/docs/problems/asteroid-collision.mdx"));

function AsteroidCollision() {
  return (
    <LazyAsteroidCollision />
  );
}

export const Route = createFileRoute("/_layout/docs/problems/asteroid-collision")({
  component: AsteroidCollision,
});