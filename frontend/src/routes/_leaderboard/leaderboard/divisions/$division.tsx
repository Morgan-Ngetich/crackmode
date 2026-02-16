import { createFileRoute } from "@tanstack/react-router";
import { DivisionLeaderboardPage } from "@/pages/DivisionLeaderboardPage";
import { useDivision } from "@/hooks/context/divisionBgColorContext";
import { useEffect } from "react";

function DivisionLeaderboardRoute() {
  const { division } = Route.useParams();
  const { setCurrentDivision } = useDivision();

  // Set division background when entering
  useEffect(() => {
    setCurrentDivision(division);

    // Clean up when leaving
    return () => setCurrentDivision(null);
  }, [division, setCurrentDivision]);

  return <DivisionLeaderboardPage division={division} />;
}

export const Route = createFileRoute("/_leaderboard/leaderboard/divisions/$division")({
  component: DivisionLeaderboardRoute,
});