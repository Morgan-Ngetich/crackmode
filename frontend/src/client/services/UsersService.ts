/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DeleteResponse } from '../models/DeleteResponse';
import type { UserPublic } from '../models/UserPublic';
import type { UserRoleUpdate } from '../models/UserRoleUpdate';
import type { UserSyncIn } from '../models/UserSyncIn';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Sync User
     * Sync user from Supabase to local database
     *
     * This endpoint:
     * 1. Verifies the user is syncing their own profile
     * 2. Checks if user exists by email
     * 3. Creates or updates user record
     * 4. Returns the synced user data
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static syncUserApiV1UsersSyncPost({
        requestBody,
    }: {
        requestBody: UserSyncIn,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/sync',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Current User Info
     * Get current authenticated user's information
     *
     * Returns full user profile including CrackMode profile if it exists
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static getCurrentUserInfoApiV1UsersMeGet(): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/me',
        });
    }
    /**
     * Delete Current User Account
     * Delete current user's account
     *
     * This will:
     * 1. Soft delete by setting is_active=False (recommended)
     * OR
     * 2. Hard delete from database (uncomment the hard delete code)
     *
     * TODO: Consider implementing a grace period before actual deletion
     * @returns DeleteResponse Successful Response
     * @throws ApiError
     */
    public static deleteCurrentUserAccountApiV1UsersMeDelete(): CancelablePromise<DeleteResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/me',
        });
    }
    /**
     * Update Current User
     * Update current user's basic information
     *
     * Allowed fields: full_name, avatar_url
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static updateCurrentUserApiV1UsersMePatch({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User By Id
     * Get user by ID (public endpoint)
     *
     * Returns user profile with public information
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static getUserByIdApiV1UsersUserIdGet({
        userId,
    }: {
        userId: number,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User By Admin
     * Delete a user account (Admin only)
     *
     * Admins can delete any user account.
     * This performs a soft delete by setting is_active=False
     * @returns DeleteResponse Successful Response
     * @throws ApiError
     */
    public static deleteUserByAdminApiV1UsersUserIdDelete({
        userId,
    }: {
        userId: number,
    }): CancelablePromise<DeleteResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User By Uuid
     * Get user by UUID (public endpoint)
     *
     * Useful for linking users across different services
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static getUserByUuidApiV1UsersUuidUserUuidGet({
        userUuid,
    }: {
        userUuid: string,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/uuid/{user_uuid}',
            path: {
                'user_uuid': userUuid,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User Role
     * Update a user's role (Admin only)
     *
     * Admins can promote users to admin or demote them to regular users.
     * Only super admins can create other super admins.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static updateUserRoleApiV1UsersUserIdRolePatch({
        userId,
        requestBody,
    }: {
        userId: number,
        requestBody: UserRoleUpdate,
    }): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/{user_id}/role',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
