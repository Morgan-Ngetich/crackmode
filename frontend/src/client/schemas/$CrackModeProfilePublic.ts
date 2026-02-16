/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CrackModeProfilePublic = {
    description: `Public representation of CrackMode profile`,
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        user_id: {
            type: 'number',
            isRequired: true,
        },
        leetcode_username: {
            type: 'string',
            isRequired: true,
        },
        total_easy: {
            type: 'number',
            isRequired: true,
        },
        total_medium: {
            type: 'number',
            isRequired: true,
        },
        total_hard: {
            type: 'number',
            isRequired: true,
        },
        total_problems_solved: {
            type: 'number',
            isRequired: true,
        },
        division: {
            type: 'string',
            isRequired: true,
        },
        rank: {
            type: 'number',
            isRequired: true,
        },
        division_rank: {
            type: 'number',
            isRequired: true,
        },
        season: {
            type: 'string',
            isRequired: true,
        },
        total_score: {
            type: 'number',
            isRequired: true,
        },
        performance_score: {
            type: 'number',
            isRequired: true,
        },
        current_streak: {
            type: 'number',
            isRequired: true,
        },
        longest_streak: {
            type: 'number',
            isRequired: true,
        },
        weekly_solves: {
            type: 'number',
            isRequired: true,
        },
        contest_rating: {
            type: 'number',
            isRequired: true,
        },
        last_synced: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date-time',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        created_at: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        updated_at: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
    },
} as const;
