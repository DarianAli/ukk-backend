import { Request } from "express";
import multer from "multer";
import { BASE_API_URL } from "../../global";
import { date, Err } from "joi";
import path from "path";

const storage = multer.diskStorage({
    destination: (request: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
       cb(null, path.join(process.cwd(), "public", "kos-photo")) 
    },

    filename: (reqeust: Request, file: Express.Multer.File, cb : (error: Error | null, destination: string) => void) => {
        cb(null, `${new Date().getTime().toString()}-${file.originalname}`)
    }
})

const uploadFile = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }
})

export default uploadFile;