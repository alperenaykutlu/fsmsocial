import AppError from "../utils/AppError.js"

const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
        const message = result.error.errors.map(e => e.message).join(", ")
        return next(new AppError(message, 400, "VALIDATION_ERROR"))
    }
    req.body = result.data  // parsed & sanitized data
    next()
}

export default validate