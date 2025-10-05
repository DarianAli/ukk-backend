import Joi from "joi"
import { Request, Response, NextFunction } from "express"

export const addDataSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
    role: Joi.string().valid("owner", "society").required()
})

export const updateDataSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    phone: Joi.string().optional(),
    role: Joi.string().valid("owner", "society").optional()
})

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    user: Joi.optional()
})

export const verifyLogin = (request: Request, response: Response, next: NextFunction) => {
    const { error } = loginSchema.validate(request.body, { abortEarly: false })

    if ( error ) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
        return
    }
    return next()
}

export const verifyUser = (request: Request, response: Response, next: NextFunction) => {
    const { error } = addDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
        return
    }
    return next()
} 

export const verifyUpdateUser = (request: Request, response: Response, next: NextFunction) => {
    const { error } = updateDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
        return
    }
    return next()
} 