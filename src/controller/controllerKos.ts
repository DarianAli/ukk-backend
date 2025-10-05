import { Request, Response } from "express"
import { PrismaClient } from "../../generated/prisma"
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient({errorFormat: "pretty"})

export const createKos = async(request: Request, response: Response) => {
    try {
        const { name, address, price_per_month } = request.body;
        const uuid = uuidv4();

        const create = await prisma.kos.create({
            data: {  
                uuid,name, address, price_per_month
            }
        })
        response.json({
            status: true,
            data: create,
            message: `berhasil membuat kos baru`
        }).status(200)
        return
    } catch (error) {
        response.json({
            status: false,
            message: `terjadi sebuah kesalhan saat akan membuat kos baru ${error}`
        }).status(400)
        return
    }
}

export const getAllKos = async (request: Request, response: Response) => {
    try {
        const { search } = request.query;

        const allData = await prisma.kos.findMany({
            where: { name: {contains: search?.toString()} },
            include: {
                foto: true,
                reviews: true,
                books: true,
                fasilitas: true
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
            message: `terjadi sebuah kesalahan saat menampilkan data. ${error}`
        }).status(400)
        return
    }
}

export const updateData = async (request: Request, response: Response) => {
    try {
        const { idKos } = request.params;
        const { name, address, price_per_month } = request.body;
        
        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(idKos) }
        })

        if (!findKos) {
            response.status(400).json({
                status: false,
                message: `kos yang anda maksud tidak ditemukan`
            })
            return
        }

        const update = await prisma.kos.update({
            data : {
                name: name || findKos.name, 
                address: address || findKos.address, 
                price_per_month: price_per_month || findKos.price_per_month
            },
            where: { idKos: Number(idKos) }
        })

        response.json({
            status: true,
            data: update,
            message: `berhasil update data kos`
        }).status(200)
        return
    } catch (error) {
        response.json({
            status: false,
            message: `terjadi kesalahan saat akan update data. ${error}`
        }).status(400)
        return
    }
}

export const deleteData = async (request: Request, response: Response) => {
    try {
        const { idKos } = request.params;

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(idKos) }
        })

        if (!findKos) {
            response.status(400).json({
                status: false,
                message: `kos yang anda maksud tidak dapat ditemukan`
            })
            return
        }

        const deleteKos = await prisma.kos.delete({
            where: { idKos: Number(idKos) }
        })

        response.json({
            status: true,
            data: deleteKos,
            message: `berhasil menghapus data`
        }).status(200)
        return
    } catch (error) {
        response.json({
            status: false,
            message: `terjadi kesalhan saat akan menghapus kos. ${error}`
        }).status(400)
        return
    }
}