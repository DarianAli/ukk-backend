import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const addReviewSchema = Joi.object({
    comment: Joi.string().required(),
    user: Joi.optional()
})

export const editReviewSchema = Joi.object({
    comment: Joi.string().optional(),
    user: Joi.optional()
})

export const addReview = (request: Request, response: Response, next: NextFunction) => {
    const {error} = addReviewSchema.validate(request.body, {abortEarly: false})

    if (error) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
        return
    }
    return next()
}

export const editRev = (request: Request, response: Response, next: NextFunction) => {
    const { error } = editReviewSchema.validate(request.body, { abortEarly: false })

    if (error) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
        return
    }
    return next()
}