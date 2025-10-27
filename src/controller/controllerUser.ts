import { PrismaClient, role } from "../../generated/prisma";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid"
import md5 from "md5"
import { stat } from "fs";
import Jwt from "jsonwebtoken";

import { SECRET } from "../../global";
import { error } from "console";
import { any } from "joi";
 
const prisma = new PrismaClient({errorFormat: "pretty"})

export const createUser = async (request: Request, response: Response) => {
    try {
        const { name, email, password, phone, role } = request.body;
        const uuid = uuidv4()

        const newUser = await prisma.user.create({
            data: {
                uuid,
                name,
                email,
                password: md5(password), 
                phone,
                role
            }
        })
        response.json({
            status: true,
            data: newUser,
            message: `berhasil menciptakan user`
        }).status(200)
        return
    } catch (error) {
        response.json({
            status: false,
            message: `terjadi sebuah kesalahan saat menciptakan user ${error}`
        }).status(400)
        return
    }
}

export const getAllData = async (request: Request, response: Response) => {
    try {
        const { search } = request.query;
        
        const allData = await prisma.user.findMany({
            where: { 
                name: { contains: search?.toString() }
            }
        })

        response.json({
            status: true,
            data: allData,
            message: `berhasil menampilkan semua data`
        }).status(200)
        return
    } catch (error) {
        response.json({
            status: false,
            message: `terjadi sebuah kesalahan saat menampilkan ${error}`
        }).status(400)
        return
    }
}

export const updateUser = async (request: Request, response: Response) => {
    try {
        const { idUser } = request.params;
        const { name, email, password, phone, role  } = request.body;

        const findUser = await prisma.user.findFirst({
            where: { idUser: Number(idUser) }
        })

        if(!findUser) {
            response.status(400).json({
                status: false,
                message: `user yang anda maksud tidak dapat ditemukan`
            })
            return
        }

        if (email && email !== findUser.email ) {
            const exisstEmail = await prisma.user.findFirst({
                where: {email}
            })
            if (exisstEmail) {
                response.status(400).json({
                    status: false,
                    message: "email sudah digunakan"
                })
                return
            }
        }

        const update = await prisma.user.update({
            data: {
                name: name || findUser.name,
                email: email || findUser.email,
                password: password || findUser.password,
                phone: phone || findUser.phone,
                role: role || findUser.role
            },
            where: { idUser: Number (idUser) }
        })
        response.json({
            status: true,
            data: update,
            message: `berhasil update data user`
        }).status(200)
        return
    } catch (error) {
        response.json({
            status: false,
            message: `terjadi sebuah kesalahan saat akan update ${error}`
        }).status(400)
        return
    }
}

export const deleteUser = async (request: Request, response: Response) => {
    try {
        const { idUser } = request.params

        const findUser = await prisma.user.findFirst({
            where: { idUser: Number (idUser) }
        })
        
        if (!findUser) {
            response.status(400).json({
                status: false,
                message: `user yang anda maksud tidak dapat ditemukan`
            })
            return
        }

        const deleteData = await prisma.user.delete({
            where: { idUser: Number(idUser) }
        })

        response.json({
            status: true,
            data: deleteData,
            message: `berhasil delete data anda`
        }).status(200)
        return
    } catch (error) {
        response.json({
            status: false,
            message: `terjadi kesalahan saat akan menghapus data`
        }).status(400)
        return
    }
}

export const auth = async ( request: Request, response: Response ) => {
    try {
        const { email, password } = request.body;

        const user = await prisma.user.findFirst({
            where: {email, password: md5(password)}
        })

        if (!user) { 
            response.status(404).json({
                status: false,
                logged: false,
                message: `user tidak ditemukan, coba periksa kembali email dan password anda`
            })
            return
        }

        let data = {
            idUser: user.idUser,
            email: user.email,
            password: user.password,
            role: user.role,
            name: user.name
        }

        let TOKEN = Jwt.sign(
            { idUser: user.idUser, email: user.email, role: user.role },
            process.env.SECRET || "token",
            { expiresIn: "1d" }
        )

        response.json({
            status: true,
            logged: true,
            data: data,
            message: `berhasil login!`,
            TOKEN
        }).status(200)
        return
    } catch (error) {
        response.json({
            status: false,
            message: `terjadi sebuah kesalahan saat login ${error}`
        }).status(400)
    }
}

export const getProfile = async (request: Request, response: Response) => {
    try {
        const user = (request as any).user;
        const getOneProfile = await prisma.user.findFirst({
            where: { idUser: user.idUser }
        })

        response.status(200).json({
            status: true,
            data: getOneProfile,
            message: `berhasil mengambil satu user`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalhan saat akan mengambil data satu user. ${error}`
        })
        return
    }
}