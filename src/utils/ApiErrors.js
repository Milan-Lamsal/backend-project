// If API errors comes then it comes in this way 

class ApiError extends Error {

    constructor(
        statusCode,
        message = " Something went wrong ",
        errors = [],
        stack = ""

    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null,
            this.message = message,
            this.success = false,
            this.errors = errors

        //production grade
        if (this.stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
export { ApiError }