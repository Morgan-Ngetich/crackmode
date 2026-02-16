import LeaderBoard from "@/pages/Leaderboard";
import { createFileRoute } from "@tanstack/react-router";

function LeaderBoardIndex() {
  return (
      <LeaderBoard />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route: any = createFileRoute("/_leaderboard/leaderboard/")({
  component: LeaderBoardIndex,
});
