export class ApiError extends Error {
    readonly statusCode: number;
    readonly errors?: unknown

    constructor(message = "Something went wrong", statusCode = 500, errors?: unknown) {
        super(message)
        this.statusCode = statusCode;
        this.errors = errors
    }
}

export class ApiResponse<T> {
    public message: string;
    public success: boolean;
    public statusCode: number;
    public data?: T;

    constructor(message = "Success", statusCode = 200, data?: T) {
        this.success = true;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data
    }
}