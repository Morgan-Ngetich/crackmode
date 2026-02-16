import { Table, HStack, VStack, Text, Icon, Badge, IconButton, Button, Menu, Portal } from '@chakra-ui/react';
import { Avatar } from '@/components/ui/avatar';
import { FaTrophy, FaMedal, FaFire, FaEllipsisV, FaTrash, FaUserShield, FaUserSlash } from 'react-icons/fa';
import { BiTrendingUp, BiTrendingDown } from 'react-icons/bi';
import { CrackModeProfilePublic, UserPublic } from '@/client';
import { ProblemsPopover } from './ProblemsPopover';
import { useAuth } from '@/hooks/auth/useAuth';
import { useState } from 'react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
} from '@/components/ui/dialog';
import { useAdmin } from '@/hooks/auth/useAdmin';

const DIVISION_COLORS = {
  Diamond: 'blue',
  Platinum: 'cyan',
  Gold: 'yellow',
  Silver: 'gray',
  Bronze: 'orange',
};

const DIVISION_ICONS = {
  Diamond: '💎',
  Platinum: '🏆',
  Gold: '🥇',
  Silver: '🥈',
  Bronze: '🥉',
};

interface PlayerRowProps {
  profile: CrackModeProfilePublic;
  isCurrentUser: boolean;
  showDivision: boolean;
  zone: 'promotion' | 'relegation' | 'safe' | null;
  currentUser?: UserPublic | null;
}

export function PlayerRow({ profile, isCurrentUser, showDivision, zone, currentUser }: PlayerRowProps) {
  const rank = profile.rank;
  const totalSolved = profile.total_easy + profile.total_medium + profile.total_hard;

  const { deleteUser, updateUserRole } = useAdmin();
  const { deleteAccount } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin' | 'super_admin'>('user');

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'super_admin';
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const handleDeleteUser = () => {
    if (isCurrentUser) {
      deleteAccount.mutate();
    } else if (profile.user_id) {
      deleteUser.mutate(profile.user_id);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleUpdateRole = () => {
    if (profile.user_id) {
      updateUserRole.mutate({
        userId: profile.user_id,
        role: { role: selectedRole },
      });
    }
    setIsRoleDialogOpen(false);
  };

  const getRowGradient = () => {
    if (isCurrentUser) return null;

    switch (rank) {
      case 1:
        return {
          background: 'linear-gradient(to right, var(--chakra-colors-yellow-100) 0%, var(--chakra-colors-yellow-400) 20%, transparent 50%)',
          _dark: {
            background: 'linear-gradient(to right, var(--chakra-colors-yellow-900) 0%, var(--chakra-colors-yellow-600) 15%, transparent 50%)',
          }
        };
      case 2:
        return {
          background: 'linear-gradient(to right, var(--chakra-colors-gray-200) 0%, var(--chakra-colors-gray-400) 20%, transparent 50%)',
          _dark: {
            background: 'linear-gradient(to right, var(--chakra-colors-gray-800) 0%, var(--chakra-colors-gray-600) 15%, transparent 50%)',
          }
        };
      case 3:
        return {
          background: 'linear-gradient(to right, var(--chakra-colors-orange-200) 0%, var(--chakra-colors-orange-400) 15%, transparent 50%)',
          _dark: {
            background: 'linear-gradient(to right, var(--chakra-colors-orange-900) 0%, var(--chakra-colors-orange-800) 15%, transparent 50%)',
          }
        };
      default:
        return { bg: 'transparent' };
    }
  };

  const getPadding = () => {
    switch (rank) {
      case 1: return 5;
      case 2: return 4;
      case 3: return 3;
      default: return 2;
    }
  };

  const rowGradient = getRowGradient();
  const cellPadding = getPadding()

  return (
    <Table.Row
      {...(isCurrentUser
        ? { bg: 'blue.200', _dark: { bg: 'blue.900' } }
        : rowGradient
      )}
      _hover={{ bg: 'gray.50', _dark: { bg: 'gray.800/50' } }}
    >
      {/* Rank */}
      <Table.Cell py={cellPadding}>
        <HStack gap={2}>
          {rank <= 3 && (
            <Icon
              color={rank === 1 ? 'yellow.400' : rank === 2 ? 'gray.400' : 'orange.400'}
              fontSize="lg"
            >
              {rank === 1 ? <FaTrophy /> : <FaMedal />}
            </Icon>
          )}
          <Text fontWeight="bold">#{rank}</Text>
        </HStack>
      </Table.Cell>

      {/* Player */}
      <Table.Cell>
        <HStack gap={3}>
          <Avatar
            size="sm"
            name={profile.leetcode_username}
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.leetcode_username}`}
          />
          <VStack align="start" gap={0}>
            <HStack gap={2}>
              <Text fontWeight="semibold">{profile.leetcode_username}</Text>
              {isCurrentUser && (
                <Badge colorPalette="blue" size="sm" variant={"surface"} border={"1px solid"}>YOU</Badge>
              )}
            </HStack>
            {!showDivision && (
              <Text fontSize="xs" color="gray.500">
                Division Rank #{profile.division_rank}
              </Text>
            )}
          </VStack>
        </HStack>
      </Table.Cell>

      {/* Total Solved */}
      <Table.Cell textAlign="end">
        <ProblemsPopover
          totalSolved={totalSolved}
          totalEasy={profile.total_easy}
          totalMedium={profile.total_medium}
          totalHard={profile.total_hard}
          isFirst={rank === 1}
          isTopThree={rank <= 3}
        />
      </Table.Cell>

      {/* Score */}
      <Table.Cell textAlign="end">
        <VStack gap={0} align="end">
          <Text fontSize="lg" fontWeight="bold">
            {profile.total_score.toLocaleString()}
          </Text>
          <Text fontSize="xs" color="gray.500">points</Text>
        </VStack>
      </Table.Cell>

      {/* Streak */}
      <Table.Cell textAlign="end">
        <HStack justify="flex-end" gap={1.5}>
          <Icon
            color={profile.current_streak >= 7 ? 'orange.500' : 'gray.400'}
            fontSize="sm"
          >
            <FaFire />
          </Icon>
          <Text fontWeight="bold">{profile.current_streak}</Text>
        </HStack>
      </Table.Cell>

      {/* Weekly */}
      <Table.Cell textAlign="end">
        <Text fontWeight="bold">{profile.weekly_solves}</Text>
      </Table.Cell>

      {/* Zone Status */}
      <Table.Cell textAlign="center">
        {zone === 'promotion' && (
          <Badge colorPalette="green" size="sm" variant={"surface"}>
            <HStack gap={1}>
              <Icon fontSize="xs"><BiTrendingUp /></Icon>
              <Text>promote</Text>
            </HStack>
          </Badge>
        )}
        {zone === 'relegation' && (
          <Badge colorPalette="red" size="sm" variant={"surface"}>
            <HStack gap={1}>
              <Icon fontSize="xs"><BiTrendingDown /></Icon>
              <Text>danger</Text>
            </HStack>
          </Badge>
        )}
      </Table.Cell>

      {/* Division */}
      {showDivision && (
        <Table.Cell>
          <Badge colorPalette={DIVISION_COLORS[profile.division as keyof typeof DIVISION_COLORS]} variant={"surface"}>
            {DIVISION_ICONS[profile.division as keyof typeof DIVISION_ICONS]} {profile.division}
          </Badge>
        </Table.Cell>
      )}

      {/* Actions Menu - RIGHT SIDE */}
      {(isCurrentUser || isAdmin) && (
        <Table.Cell width="60px" textAlign="right">
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                size="sm"
                variant="ghost"
                aria-label="Actions"
              >
                <Icon fontSize="md">
                  <FaEllipsisV />
                </Icon>
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  {/* User's own actions */}
                  {isCurrentUser && (
                    <Menu.Item
                      value="delete-account"
                      color="red.500"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <HStack gap={2}>
                        <Icon fontSize="md"><FaTrash /></Icon>
                        <Text>Delete My Account</Text>
                      </HStack>
                    </Menu.Item>
                  )}

                  {/* Admin actions on other users */}
                  {isAdmin && !isCurrentUser && (
                    <>
                      <Menu.Item
                        value="manage-role"
                        onClick={() => setIsRoleDialogOpen(true)}
                      >
                        <HStack gap={2}>
                          <Icon fontSize="xl"><FaUserShield /></Icon>
                          <Text>Change Role</Text>
                        </HStack>
                      </Menu.Item>
                      <Menu.Item
                        value="delete-user"
                        color="red.500"
                        onClick={() => setIsDeleteDialogOpen(true)}
                      >
                        <HStack gap={2}>
                          <Icon fontSize="xl"><FaUserSlash /></Icon>
                          <Text>Delete User</Text>
                        </HStack>
                      </Menu.Item>
                    </>
                  )}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        </Table.Cell>
      )}

      {/* Delete Confirmation Dialog */}
      <DialogRoot open={isDeleteDialogOpen} onOpenChange={(e) => setIsDeleteDialogOpen(e.open)} placement={"center"}>
        <DialogContent border={"1px solid"}>
          <DialogHeader>
            <DialogTitle>
              {isCurrentUser ? 'Delete Your Account?' : 'Delete User Account?'}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text>
              {isCurrentUser
                ? 'Are you sure you want to delete your account? This action cannot be undone.'
                : `Are you sure you want to delete ${profile.leetcode_username}'s account? This action cannot be undone.`}
            </Text>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button colorPalette="red" onClick={handleDeleteUser}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      {/* Role Update Dialog */}
      <DialogRoot open={isRoleDialogOpen} onOpenChange={(e) => setIsRoleDialogOpen(e.open)} placement={"center"}>
        <DialogContent border={"1px solid"}>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <VStack align="stretch" gap={4}>
              <Text>Select a new role for {profile.leetcode_username}:</Text>
              <VStack align="stretch" gap={2}>
                <Button
                  variant={selectedRole === 'user' ? 'solid' : 'outline'}
                  onClick={() => setSelectedRole('user')}
                >
                  User
                </Button>
                <Button
                  variant={selectedRole === 'admin' ? 'solid' : 'outline'}
                  onClick={() => setSelectedRole('admin')}
                >
                  Admin
                </Button>
                {isSuperAdmin && (
                  <Button
                    variant={selectedRole === 'super_admin' ? 'solid' : 'outline'}
                    onClick={() => setSelectedRole('super_admin')}
                  >
                    Super Admin
                  </Button>
                )}
              </VStack>
            </VStack>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <Button colorPalette="green" onClick={handleUpdateRole}>
              Update Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </Table.Row>
  );
}