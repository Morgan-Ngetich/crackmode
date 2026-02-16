import { createFileRoute, Outlet } from "@tanstack/react-router";
import LeaderboardLayout from '@/components/leaderboard/LeaderboardLayout';
import { DivisionProvider } from "@/hooks/context/divisionBgColorContext";

function LeaderboardLayoutRoute() {
  return (
    <DivisionProvider>
      <LeaderboardLayout>
        <Outlet />
      </LeaderboardLayout>
    </DivisionProvider>
  );
}

export const Route = createFileRoute('/_leaderboard')({
  component: LeaderboardLayoutRoute,
});