'use server'

import { v4 as uuidv4 } from 'uuid';

// Interface for custom error types
interface CustomError extends Error {
    code?: string;
};
  
// Error response structure
export interface ErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details: string;
    };
};

function handleError(error: CustomError): ErrorResponse{
    console.error(`${error.name}: ${error.message}`, { code: error.code });
    return {
        success: false,
        error: {
            message: error.message,
            code: error.code,
            details: uuidv4()
        }
    };
};

export { handleError }