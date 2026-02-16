
import { DivisionCards } from "@/components/leaderboard/DivisionCards";
import { createFileRoute } from "@tanstack/react-router";

function DivisionCardsIndex() {
  return (
      <DivisionCards />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route: any = createFileRoute("/_leaderboard/leaderboard/divisions/")({
  component: DivisionCardsIndex,
});
