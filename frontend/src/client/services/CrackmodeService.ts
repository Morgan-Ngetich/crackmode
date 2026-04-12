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
     * One-time setup: link a LeetCode username to this account.
     *
     * API calls: 2
     * 1. GET /:username          — verify the username exists, grab social links
     * 2. GET /:username/solved   — initial all-time stats
     *
     * Calendar and contest are intentionally skipped at setup:
     * - Streak starts at 0 and will be computed correctly on the first sync.
     * - Contest rating starts at 0 and will be synced separately.
     * Both are correct defaults for a brand-new profile.
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
     * Sync the current user's LeetCode stats.
     *
     * API calls: 2  (via sync_profile → get_sync_data)
     * 1. /solved
     * 2. /submission?200
     *
     * Extended profile data (GitHub, Twitter, LinkedIn…) is NOT refreshed
     * on every sync — it was set at setup and changes very rarely.
     * Refreshing it would cost a 3rd API call every 30 minutes per user.
     *
     * 30-minute cooldown enforced unless force=true.
     * @returns CrackModeProfilePublic Successful Response
     * @throws ApiError
     */
    public static syncMyLeetcodeStatsApiV1CrackmodeSyncPost({
        force = false,
    }: {
        force?: boolean,
    }): CancelablePromise<CrackModeProfilePublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/crackmode/sync',
            query: {
                'force': force,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Leaderboard
     * Get leaderboard.
     *
     * Sort order:
     * - With division filter  → ordered by division_rank (performance score within tier)
     * - Without filter        → ordered by global rank (all-time total score)
     *
     * Returns total = full matching count for real pagination.
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
    /**
     * Get Competition Leaderboard
     * Competition leaderboard sorted by points earned since Apr 20 (total_score - baseline).
     * @returns LeaderboardResponse Successful Response
     * @throws ApiError
     */
    public static getCompetitionLeaderboardApiV1CrackmodeCompetitionLeaderboardGet({
        limit = 100,
        offset,
    }: {
        limit?: number,
        offset?: number,
    }): CancelablePromise<LeaderboardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/crackmode/competition/leaderboard',
            query: {
                'limit': limit,
                'offset': offset,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Snapshot Competition Baselines
     * Admin-only: snapshot current total_score as competition baseline for all profiles.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static snapshotCompetitionBaselinesApiV1CrackmodeCompetitionSnapshotPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/crackmode/competition/snapshot',
        });
    }
}
