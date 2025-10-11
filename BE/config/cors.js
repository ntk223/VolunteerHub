import { WHITELIST_DOMAINS } from '../utils/constants.js'
import { StatusCodes } from 'http-status-codes'
import ApiError from '../utils/ApiError.js'

export const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép request từ Postman (origin = undefined)
    if (!origin) {
      return callback(null, true)
    }

    // Cho phép nếu origin nằm trong danh sách whitelist
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    // Nếu không khớp thì chặn
    return callback(
      new ApiError(StatusCodes.FORBIDDEN, `${origin} not allowed by our CORS Policy.`)
    )
  },
  optionsSuccessStatus: 200,
  credentials: true
}