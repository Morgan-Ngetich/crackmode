/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SyncTaskPublic = {
    id: string;
    task_type: string;
    status: string;
    total_profiles: number;
    synced_count: number;
    failed_count: number;
    error?: (string | null);
    created_at: string;
    started_at?: (string | null);
    completed_at?: (string | null);
};

