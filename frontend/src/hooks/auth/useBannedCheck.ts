import { useAuthQuery } from '@/hooks/auth/useAuthQuery';

export function useBannedCheck() {
  const { error, isLoading } = useAuthQuery();
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isBanned = (error as any)?.body?.detail === "ACCOUNT_SUSPENDED";
  return { isBanned, isLoading };
}