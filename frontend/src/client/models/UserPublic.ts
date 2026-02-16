/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CrackModeProfilePublic } from './CrackModeProfilePublic';
/**
 * Minimal user info for nested responses
 */
export type UserPublic = {
    id: number;
    uuid: string;
    full_name: string;
    email: string;
    avatar_url?: (string | null);
    role: string;
    github_url?: (string | null);
    twitter_url?: (string | null);
    linkedin_url?: (string | null);
    website_url?: (string | null);
    country?: (string | null);
    company?: (string | null);
    school?: (string | null);
    about?: (string | null);
    crackmode_profile?: (CrackModeProfilePublic | null);
    created_at?: (string | null);
    updated_at?: (string | null);
};

