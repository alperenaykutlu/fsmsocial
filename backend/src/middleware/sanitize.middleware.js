// middleware/sanitize.js
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss"

// NoSQL Injection: { "$gt": "" } gibi operatörleri temizler
export const noSqlSanitize = mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
        // import logger from '../utils/logger.js' ekle
        console.warn(`NoSQL injection attempt: key=${key}, ip=${req.ip}`)
    }
})

// XSS: body içindeki stringleri recursive temizler
export const xssSanitize = (req, res, next) => {
    const sanitizeValue = (val) => {
        if (typeof val === "string") return xss(val)
        if (typeof val === "object" && val !== null) {
            return Object.fromEntries(
                Object.entries(val).map(([k, v]) => [k, sanitizeValue(v)])
            )
        }
        return val
    }

    if (req.body) req.body = sanitizeValue(req.body)
    if (req.query) req.query = sanitizeValue(req.query)
    if (req.params) req.params = sanitizeValue(req.params)

    next()
}