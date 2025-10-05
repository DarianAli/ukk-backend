import { Request, Response } from "express";
import fs from "fs"
import { BASE_API_URL } from "../../global";
import { Prisma } from "@prisma/client/extension";
import { PrismaClient } from "../../generated/prisma";
import Multer from "multer";
import path from "path";
import {v4 as uuidv4} from "uuid"

const prisma = new PrismaClient({ errorFormat: "pretty" })
interface MulterExpress extends Request {
    file: Express.Multer.File
}


// export const uploadPic = async (request: Request, response: Response) => {
//     try {
//         const { idKos } = request.params;
//         const { foto } = request.query

//         const findKos = await prisma.kos.findFirst({
//             where: { 
//                 idKos: Number(idKos)
//              }
//         })

//         if (!findKos) {
//             response.status(400).json({
//                 status: false,
//                 message: `kos dengan id ${idKos} tidak ditemukan`
//             })
//             return
//         }

//         const files = (request as any).files as Express.Multer.File[]

//         if (!files || files.length === 0) {
//             response.status(400).json({
//                 status: false,
//                 message: `anda tidak upload file apapun`
//             })
//             return
//         }

//         const savedPhoto = []

//         for (const file of files) {
//             const saved = await prisma.foto.create({
//                 data: {
//                     foto: file.filename,
//                     kosId: Number(idKos)
//                 }
//             })
//             savedPhoto.push(saved)
//         }

//         response.json({
//             status: true,
//             data: savedPhoto,
//             mesasge: `berhasil upload photo`
//         }).status(200)
//         return
//     } catch (error) {
//         response.json({
//             status: false,
//             message: `terjadi sebuah kesalhan saat akan upload photo. ${error}`
//         }).status(400)
//         return
//     }
// }

export const uploadPhoto = async (request: Request, response: Response) => {
    try {
        const { kosId } = request.params;

        const kos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if (!kos) {
            response.status(400).json({
                status: false,
                message: `idKos yang kamu cari tidak ada`
            })
            return
        }

        if (!request.files || (request.files as Express.Multer.File[]).length === 0) {
            response.status(400).json({
                status: false,
                message: `tidak ada file yang terkirim`
            })
            return
        }

        const files = request.files as Express.Multer.File[];

        // simpan foto ke storage
        const newFoto = await prisma.foto.createMany({
            data: files.map(files => ({
                uuid: uuidv4(),
                foto: files.filename,
                kosId: kos.idKos
            }))
        })

        response.status(200).json({
            status: true,
            data: newFoto,
            message: "foto berhasil di upload"
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalahan saat upload foto ${error}`
        })
        return
    }
}

export const getAllPhoto = async (request: Request, response: Response) => {
    try {
    const { search } = request.query;

    const allData = await prisma.foto.findMany({
        select: {
            idFoto: true,
            foto: true,
            kosId: true
        }
    })

    response.status(200).json({
        status: true,
        data: allData,
        message: `berhhasil menampilkan semua data`
    })
    return
} catch (error) {
    response.status(400).json({
        status: false,
        message: `terjadi sebuah kesalhan saat akan upload foto. ${error}`
    })
    return
}
}

export const updateFoto = async (request: Request, response: Response) => {
    try {
    const { idFoto, kosId } = request.params;

    const findKos = await prisma.kos.findFirst({
        where: {idKos: Number(kosId)}
    })

    if (!findKos) {
        response.status(400).json({
            status: false,
            message: `kos tidak ditemukan`
        })
    }
 
    const findFoto = await prisma.foto.findFirst({
        where: {idFoto: Number(idFoto)}
    })

    if (!findFoto) {
        response.status(400).json({
            status: false,
            message: "foto tidak ditemukan"
        })
        return
    }

    if (!request.file) {
        response.status(400).json({
            status: false,
            message: "No file uploaded"
        })
        return
    }

    const oldPath = path.resolve(process.cwd(), "public/kos-photo", findFoto.foto)
    if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath)
    }

    const updateFoto = await prisma.foto.update({
        where: { idFoto: Number(idFoto) },
        data: { foto: request.file.filename }
    })

    response.status(200).json({
        status: true,
        data: updateFoto,
        message: "foto berhasil di update"
    })
    return
} catch (error) {
    response.status(400).json({
        status: false,
        message: `terjadi error saat update foto ${error}`
    })
    return
}
}

export const deleteFoto = async (request: Request, response: Response) => {
    try {
        const { idFoto, kosId } = request.params;

        const findKos = await prisma.kos.findFirst({
            where: {idKos: Number(kosId)}
        })

        if( !findKos ) {
            response.status(404).json({
                status: false,
                message: `kos tidak ditemukan`
            })
        }

        const findFoto = await prisma.foto.findFirst({
            where: { idFoto: Number(idFoto) }
        })

        if ( !findFoto ) {
            response.status(404).json({
                status: false,
                message: `foto dengan id ${idFoto} tidak ditemukan` 
            })
            return
        }

        // let path = `${BASE_API_URL}../public/kos-photo/${findFoto.foto}`
        // let exists = fs.existsSync(path)

        // if (exists && findFoto.foto !== "") fs.unlinkSync(path)

        const filePath = path.resolve(process.cwd(), "public/kos-photo", findFoto.foto)
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        const deletes = await prisma.foto.delete({
            where: { idFoto: Number(idFoto) }
        })

        response.status(200).json({
            status: true,
            data: deletes,
            message: `Berhasil hapus foto`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi sebuah kesalahan saat akan menghapus foto ${error}`
        })
        return
    }
}

