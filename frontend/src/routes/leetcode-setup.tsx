import { LeetcodeProfileSetup } from "@/components/leaderboard/LeetcodeProfileSetup";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Define search params schema
const leetcodeSetupSearchSchema = z.object({
  redirectTo: z.string().optional(),
});

export const Route = createFileRoute("/leetcode-setup")({
  validateSearch: leetcodeSetupSearchSchema,
  component: LeetcodeProfileSetup,
});