/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LeaderboardResponse = {
    properties: {
        profiles: {
            type: 'array',
            contains: {
                type: 'CrackModeProfilePublic',
            },
            isRequired: true,
        },
        total: {
            type: 'number',
            isRequired: true,
        },
        division: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        season: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
