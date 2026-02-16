import { Spinner } from "@chakra-ui/react";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Suspense } from 'react';
import SignupForm from "../pages/SignupForm";
import { isLoggedIn } from "../hooks/auth/authState";
import { z } from "zod";

const signupSearchSchema = z.object({
  redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/signup")({
  validateSearch: signupSearchSchema,
  component: () => (
    <Suspense fallback={<Spinner />}>
      <SignupForm />
    </Suspense>
  ),
  beforeLoad: async ({ search }) => {
    if (await isLoggedIn()) {
      // Redirect to the intended destination or home
      throw redirect({ to: search.redirectTo || "/" });
    }
  }
});