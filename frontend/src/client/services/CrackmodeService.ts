/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CrackModeProfilePublic } from '../models/CrackModeProfilePublic';
import type { CrackModeSetupRequest } from '../models/CrackModeSetupRequest';
import type { LeaderboardResponse } from '../models/LeaderboardResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CrackmodeService {
    /**
     * Generate Og Image
     * @returns any Successful Response
     * @throws ApiError
     */
    public static generateOgImageApiV1OgGet({
        title,
        description = 'Master algorithms with CrackMode',
        section = 'Documentation',
        theme = 'crackmode',
    }: {
        /**
         * Title for the OG image
         */
        title: string,
        /**
         * Description text
         */
        description?: string,
        /**
         * Section name
         */
        section?: string,
        /**
         * Theme name
         */
        theme?: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/og',
            query: {
                'title': title,
                'description': description,
                'section': section,
                'theme': theme,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Setup Crackmode Profile
     * Setup CrackMode profile by linking LeetCode username
     * This is a one-time setup (unless user changes username)
     *
     * This endpoint also syncs extended profile data like:
     * - GitHub, Twitter, LinkedIn URLs
     * - Country, Company, School
     * - About/Bio
     * - Website
     * @returns CrackModeProfilePublic Successful Response
     * @throws ApiError
     */
    public static setupCrackmodeProfileApiV1CrackmodeSetupPost({
        requestBody,
    }: {
        requestBody: CrackModeSetupRequest,
    }): CancelablePromise<CrackModeProfilePublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/crackmode/setup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Sync My Leetcode Stats
     * 🎮 FIFA SYSTEM: Sync LeetCode stats with weekly/monthly velocity tracking
     *
     * This syncs:
     * - All-time stats (easy, medium, hard, contest, streaks)
     * - Weekly stats (last 7 days velocity) ⚡
     * - Monthly stats (last 30 days consistency) ⚡
     * - Performance score (determines division) ⚡
     * - Division placement (based on performance) ⚡
     * @returns CrackModeProfilePublic Successful Response
     * @throws ApiError
     */
    public static syncMyLeetcodeStatsApiV1CrackmodeSyncPost(): CancelablePromise<CrackModeProfilePublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/crackmode/sync',
        });
    }
    /**
     * Get Leaderboard
     * Get leaderboard
     *
     * Filters:
     * - division: Bronze, Silver, Gold, Platinum, Diamond
     * - season: Season 1, Season 2, etc.
     * - limit: Number of results (max 100)
     * - offset: Pagination offset
     * @returns LeaderboardResponse Successful Response
     * @throws ApiError
     */
    public static getLeaderboardApiV1CrackmodeLeaderboardGet({
        division,
        season,
        limit = 100,
        offset,
    }: {
        division?: (string | null),
        season?: (string | null),
        limit?: number,
        offset?: number,
    }): CancelablePromise<LeaderboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/crackmode/leaderboard',
            query: {
                'division': division,
                'season': season,
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
