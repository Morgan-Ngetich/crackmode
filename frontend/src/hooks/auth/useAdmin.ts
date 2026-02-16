import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UsersService, type UserPublic, type UserRoleUpdate } from "@/client";
import { toNativePromise } from "@/utils/toNativePromisse";
import { getApiErrorMessage } from "@/utils/errorUtils";
import useToaster from '../public/useToaster';

export function useAdmin() {
  const queryClient = useQueryClient();
  const toast = useToaster();

  // Delete a user (admin only)
  const deleteUser = useMutation<
    { message: string; user_id: number },
    Error,
    number
  >({
    mutationFn: (userId: number) =>
      toNativePromise(UsersService.deleteUserByAdminApiV1UsersUserIdDelete({ userId })),
    onSuccess: (data) => {
      toast({
        id: 'delete-user-success',
        title: 'User deleted',
        description: data.message,
        status: 'success',
      });

      // Invalidate leaderboard and user queries
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: unknown) => {
      toast({
        id: 'delete-user-error',
        title: 'Failed to delete user',
        description: getApiErrorMessage(error),
        status: 'error',
      });
    },
  });

  // Update user role (admin only)
  const updateUserRole = useMutation<
    UserPublic,
    Error,
    { userId: number; role: UserRoleUpdate }
  >({
    mutationFn: ({ userId, role }) =>
      toNativePromise(
        UsersService.updateUserRoleApiV1UsersUserIdRolePatch({
          userId,
          requestBody: role,
        })
      ),
    onSuccess: (updatedUser) => {
      toast({
        id: 'update-role-success',
        title: 'Role updated',
        description: `${updatedUser.email} is now a ${updatedUser.role}`,
        status: 'success',
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
    onError: (error: unknown) => {
      toast({
        id: 'update-role-error',
        title: 'Failed to update role',
        description: getApiErrorMessage(error),
        status: 'error',
      });
    },
  });

  return {
    deleteUser,
    updateUserRole,
  };
}