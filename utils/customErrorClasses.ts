class ValidationError extends Error {
    public name: string = "ValidationError";
    public code: string = "VALIDATION_ERROR";
    constructor(message: string){
        super(message);
    };
};

class AuthenticationError extends Error {
    public name: string = "AuthenticationError";
    public code: string = "AUTHENTICATION_ERROR";
    constructor(message: string){
        super(message);
    };
};

class DBError extends Error {
    public name: string = "DBError";
    public code: string = "DB_ERROR";
    constructor(message: string){
        super(message);
    };
};

class LogicValidationError extends Error {
    public name: string = "LogicValidationError";
    public code: string = "LOGIC_VALIDATION_ERROR";
    constructor(message: string){
        super(message);
    };
};

class UnknownError extends Error {
    public name: string = "UnknowError";
    public code: string = "UNKNOWN_ERROR";
    constructor(message: string){
        super(message);
    };
};

export { ValidationError, AuthenticationError, DBError, LogicValidationError, UnknownError }