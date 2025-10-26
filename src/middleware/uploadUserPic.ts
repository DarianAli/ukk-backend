import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, path.join(process.cwd(), "public", "user-photo"))
    },

    filename: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`)
    }
})

const uploadFile = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }
})

export default uploadFile

