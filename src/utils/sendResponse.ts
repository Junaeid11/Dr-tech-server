import { Response } from 'express';

export interface ApiResponse<T = any> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
    };
}

export const sendResponse = <T>(res: Response, response: ApiResponse<T>): void => {
    res.status(response.statusCode).json({
        success: response.success,
        message: response.message,
        data: response.data,
        meta: response.meta,
    });
};