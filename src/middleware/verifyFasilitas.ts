import Joi from "joi"
import { Request, Response, NextFunction } from "express"
import { REPLCommand } from "repl"

export const createFassSchema = Joi.object({
    fasilitas: Joi.string().required()
})

export const updateDataSchema = Joi.object({
    fasilitas: Joi.string().optional()
})

export const createFASS = (request: Request, response: Response, next: NextFunction) => {
    const { error } = updateDataSchema.validate(request.body, {abortEarly: false})

    if (error) {
        response.status(400).json({
            status: false,
            message: error.details.map(it => it.message).join
        })
        return
    }
    return next()
}

export const updateFASS = (request: Request, response: Response, next: NextFunction) => {
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