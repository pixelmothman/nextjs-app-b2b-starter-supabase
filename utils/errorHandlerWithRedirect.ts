'use server'


import { redirect } from 'next/navigation';

// Interface for custom error types
interface CustomError extends Error {
    code?: string;
};
  
// Error response structure
interface ErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details: string;
    };
};

function handleErrorWithRedirect(error: CustomError, currentPath: string): ErrorResponse{
    console.error(`${error.name}: ${error.message}`, { code: error.code });
    redirect(`${currentPath}?success=false&error=${error.message}&code=${error.code}`);
};

export { handleErrorWithRedirect }