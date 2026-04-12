/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SyncTaskPublic } from '../models/SyncTaskPublic';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TasksService {
    /**
     * Get Latest Sync Status
     * Returns the most recent daily sync task.
     * Useful for checking whether the nightly job is running, done, or failed.
     * No auth required — this is public status info.
     * @returns SyncTaskPublic Successful Response
     * @throws ApiError
     */
    public static getLatestSyncStatusApiV1TasksSyncLatestGet(): CancelablePromise<SyncTaskPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks/sync/latest',
        });
    }
    /**
     * Get Sync Task
     * Returns a specific sync task by ID.
     * @returns SyncTaskPublic Successful Response
     * @throws ApiError
     */
    public static getSyncTaskApiV1TasksSyncTaskIdGet({
        taskId,
    }: {
        taskId: string,
    }): CancelablePromise<SyncTaskPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/tasks/sync/{task_id}',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
