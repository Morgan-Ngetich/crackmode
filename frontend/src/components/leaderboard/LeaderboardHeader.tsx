import CrackModeHeader from '@/components/common/CrackModeHeader';

interface LeaderboardHeaderProps {
  onSync: () => void;
  isSyncing: boolean;
  isMyProfile: boolean;
}

export function LeaderboardHeader({ onSync, isSyncing, isMyProfile }: LeaderboardHeaderProps) {
  return (
    <CrackModeHeader 
      mode="leaderboard" 
      onSync={onSync} 
      isSyncing={isSyncing} 
      isMyProfile={isMyProfile}
    />
  );
}