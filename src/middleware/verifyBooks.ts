import Joi from "joi"
import { Request, Response, NextFunction } from "express";
// startDate, endDate, paymmentCycle, status
/**monthly
  quarterly
  yearly
  active
  cancel
  finish */

export const addBooksSchema = Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().optional(),
    paymmentCycle: Joi.string().valid("monthly", "quarterly", "yearly").required(),
})

export const editBooksSchema = Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().optional(),
    paymmentCycle: Joi.string().valid("monthly", "quarterly", "yearly").optional(),
})

export const editStatusSchema = Joi.object({
    status: Joi.string().valid("active", "cancel", "finish").required()
})

export const addBooks = (request: Request, response: Response, next: NextFunction) => {
        const {error} = addBooksSchema.validate(request.body, { abortEarly: false })

        if (error) {
            response.status(400).json({
                status: false,
                message: error.details.map(it => it.message).join()
            })
            return
        }
        return next()
}

export const editBooking = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editBooksSchema.validate(request.body, { abortEarly: false })

    if (error) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
        return
    }
    return next()
}

export const editGwah = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editStatusSchema.validate(request.body, { abortEarly: false })

    if (error) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
        return
    }
    return next()
}