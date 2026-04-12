/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SyncTaskPublic = {
    properties: {
        id: {
            type: 'string',
            isRequired: true,
        },
        task_type: {
            type: 'string',
            isRequired: true,
        },
        status: {
            type: 'string',
            isRequired: true,
        },
        total_profiles: {
            type: 'number',
            isRequired: true,
        },
        synced_count: {
            type: 'number',
            isRequired: true,
        },
        failed_count: {
            type: 'number',
            isRequired: true,
        },
        error: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        created_at: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        started_at: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date-time',
            }, {
                type: 'null',
            }],
        },
        completed_at: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date-time',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
