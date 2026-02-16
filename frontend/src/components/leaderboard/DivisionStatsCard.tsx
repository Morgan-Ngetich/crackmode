import { Card, Heading, HStack, Stat } from '@chakra-ui/react';

interface DivisionStatsCardProps {
  division: string;
  stats: {
    totalPlayers: number;
    averages: {
      score: number;
      streak: number;
    };
    topPlayer: {
      username: string;
      score: number;
    };
  };
}

export function DivisionStatsCard({ division, stats }: DivisionStatsCardProps) {
  return (
    <Card.Root>
      <Card.Body>
        <Heading size="md" mb={4}>
          {division} Division Stats
        </Heading>
        <HStack gap={8} justify="space-around" wrap="wrap">
          <Stat.Root>
            <Stat.Label>Total Players</Stat.Label>
            <Stat.ValueText>{stats.totalPlayers}</Stat.ValueText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Avg Score</Stat.Label>
            <Stat.ValueText>{stats.averages.score} pts</Stat.ValueText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Avg Streak</Stat.Label>
            <Stat.ValueText>{stats.averages.streak} days</Stat.ValueText>
          </Stat.Root>
          <Stat.Root>
            <Stat.Label>Top Player</Stat.Label>
            <Stat.ValueText fontSize="lg">{stats.topPlayer.username}</Stat.ValueText>
            <Stat.HelpText>{stats.topPlayer.score} pts</Stat.HelpText>
          </Stat.Root>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}