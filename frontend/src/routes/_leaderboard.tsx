import { createFileRoute, Outlet } from "@tanstack/react-router";
import LeaderboardLayout from '@/components/leaderboard/LeaderboardLayout';
import { DivisionProvider } from "@/hooks/context/divisionBgColorContext";
import { useAuth } from "@/hooks/auth/useAuth";
import { useAutoSync } from "@/hooks/crackmode/leaderboard/useCrackmode";


function LeaderboardLayoutRoute() {
  const { user } = useAuth();  
  // Fires once on mount — silently syncs if user has a profile + cooldown has passed
  useAutoSync(!!user?.crackmode_profile);

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