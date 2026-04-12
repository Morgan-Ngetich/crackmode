/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class WhatsappService {
    /**
     * Test Morning
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testMorningApiV1WhatsappTestMorningPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/whatsapp/test/morning',
        });
    }
    /**
     * Test Midday
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testMiddayApiV1WhatsappTestMiddayPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/whatsapp/test/midday',
        });
    }
    /**
     * Test Evening
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testEveningApiV1WhatsappTestEveningPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/whatsapp/test/evening',
        });
    }
    /**
     * Test Night
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testNightApiV1WhatsappTestNightPost(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/whatsapp/test/night',
        });
    }
    /**
     * Test Send Raw
     * Send a raw text message to the group — useful for smoke testing the Green API connection.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static testSendRawApiV1WhatsappTestSendPost({
        requestBody,
    }: {
        requestBody: Record<string, any>,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/whatsapp/test/send',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
