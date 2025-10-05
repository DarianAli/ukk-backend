import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { validate } from "uuid";
import { status } from "../../generated/prisma";

export const addDataSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    price_per_month: Joi.string().required()
})

export const updateDataSchema = Joi.object({
    name: Joi.string().optional(),
    address: Joi.string().optional(),
    price_per_month: Joi.string().optional()
})

export const addData = ( request: Request, response: Response, next: NextFunction ) => {
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

export const editData = ( request: Request, response: Response, next: NextFunction ) => {
    const { error } = updateDataSchema.validate(request.body, { abortEarly: false })

    if (error) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join()
        })
        return
    }
    return next()
}