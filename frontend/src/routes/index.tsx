import { Spinner } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from 'react';
import Home from "@/pages/Home"

export const Route = createFileRoute("/")({
  component: () => (
    <Suspense fallback={<Spinner />}>
      <Home />
    </Suspense>
  ),
});