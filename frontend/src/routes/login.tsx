import { Spinner } from "@chakra-ui/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from 'react';
import LoginForm from "../pages/LoginForm";
import { isLoggedIn } from "../hooks/auth/authState";
import { z } from "zod"

const loginSearchSchema = z.object({
  redirectTo: z.string().optional()
})

export const Route = createFileRoute("/login")({
  validateSearch: loginSearchSchema,
  component: () => (
    <Suspense fallback={<Spinner />}>
      <LoginForm />
    </Suspense>
  ),
  beforeLoad: async ({ search }) => {
    if (await isLoggedIn()) {
      throw redirect({ to: search.redirectTo || "/" });
    }
  }
});