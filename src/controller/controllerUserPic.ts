import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { BASE_API_URL } from "../../global";
import fs from "fs"
import { profile } from "console";
import { when } from "joi";

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const postPic = async( request: Request, response: Response ) => {
    try {
        const { userId } = request.params

        const findUser = await prisma.user.findFirst({
            where: { idUser: Number(userId) }
        })

        if (!findUser) {
            response.status(404).json({
                status: false,
                message: `user yang anda cari tidak ditemukan`
            })
            return
        }

        let fileName = findUser.profile

        if(request.file) {
            fileName = request.file.filename

            let path = `${BASE_API_URL}../public/user-photo/${findUser.profile}`
            let exist = fs.existsSync(path)

            if (exist && findUser.profile !== "") fs.unlinkSync(path)
        }
        
        const uploadPicture = await prisma.user.update({
            data: { profile: fileName },
            where: { idUser: Number(userId) }
        })

        response.status(200).json({
            status: true,
            data: uploadPicture,
            message: `berhasil upload picture`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalahan saat akan upload picture user ${error}`
        })
        return
    }
}

export const updatePhoto = async ( request: Request, response: Response ) => {
    try {
    const { userId } = request.params;

    const findUuu = await prisma.user.findFirst({
        where: { idUser: Number(userId) }
    })

    if (!findUuu) {
        response.status(404).json({
            status: false,
            message: `user tidak ditemukan`
        })
        return
    }

    let filename = findUuu.profile;

    if (request.file) {
        filename = request.file.filename

        let path = `${BASE_API_URL}../public/user-photo/${findUuu.profile}`
        let exist = fs.existsSync(path)

        if (exist && findUuu.profile !== "") fs.unlinkSync(path)
    }

    const updatePhoto = await prisma.user.update({
        data: {
            profile: filename
        },
        where: {
            idUser: Number(userId)
        }
    })

    response.status(200).json({
        status: true,
        data: updatePhoto,
        message: `berhasil update photo user`
    })
    return
} catch (error) {
    response.status(400).json({
        status: false,
        message: `terjadi kesalahan saat akan update photo user ${error}`
    })
    return
}
    
}

