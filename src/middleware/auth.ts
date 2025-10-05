import { Request, Response, NextFunction } from "express";
import { SECRET } from "../../global";
import { verify } from "jsonwebtoken";
import { string } from "joi";

interface JwPayLoad {
    id: string,
    name: string,
    password: string,
    role: string
}

export const verifyToken = ( request: Request, response: Response, next: NextFunction ) => {
    const token = (request.headers.authorization as string)?.split(" ")[1]

    if (!token) { 
        response.status(400).json({
            status: false,
            message: `token tidak ditemukan silahkan login ulang`
        })
        return
    }

    try {
        const secretKey = SECRET || "token"
        const decoded = verify(token, secretKey)
        request.user = decoded as JwPayLoad
        // console.log("decoded token: ", decoded)
        next()
    } catch (error) {
        response.json({
            status: false,
            message: `token error ${error}`
        }).status(400)
        return
    }
}

export const verifyRole = (allowedRole: string[]) => {
    return (request: Request, response: Response, next: NextFunction) => {
        const user = request.user;
        
        if (!user) 
            return response.status(400).json({
                status: false,
                message: `user tidak ditemukan`
            })

        if (!allowedRole.includes(user?.role ?? "society")) {
            response.json({
                message: `Role yang anda pilih hanya boleh diantara ${allowedRole.join(
                    "/"
                )}`,
            }).status(401)
            return
        }
        next()
        }
    }