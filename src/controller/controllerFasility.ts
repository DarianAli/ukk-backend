import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const addFasility = async (request: Request, response: Response) => {
    try {
        const { kosId } = request.params;
        const { fasilitas } = request.body;

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if (!findKos) {
            response.status(404).json({
                status: false,
                message: `kos dengan id yang anda maksud tidak dapat ditemukan`
            })
            return
        }

        const newFasility = await prisma.fasilitas.create({
            data: {
                uuid: uuidv4(),
                fasilitas: fasilitas,
                kosId: Number(kosId)
            },
        })

        response.status(200).json({
            status: true,
            data: newFasility,
            message: "Berhasil menambahkan fasility baru"
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalhan saat membuat fasilitas baru nih :(. ${error}`
        })
        return
    }
}

export const getAllFAS = async (request: Request, response: Response) => {
    try {
        const { search } = request.query;

        const allFAS = await prisma.fasilitas.findMany({
            where: { fasilitas: { contains: search?.toString() } },
            include: { kos: { select: { idKos: true } } }

        })

        response.status(200).json({
            status: true,
            data: allFAS,
            message: "berhasil menampilkan semua data nih"
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalhan saat akan menampilkan fasilitas anda. ${error}`
        })
        return
    }
}

export const updateFasility = async (request: Request, response: Response) => {
    try {
        const { kosId, idFasilitas } = request.params;
        const { fasilitas } = request.body;

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if (!findKos) {
            response.status(404).json({
                status: false,
                message: `kos dengan id tersebut tidak ditemukan`
            })
            return
        }

        const findFASI = await prisma.fasilitas.findFirst({
            where: { idFasilitas: Number(idFasilitas) },
            include: { kos: { select: { idKos: true } } }

        })
        
        if (!findFASI) {
            response.status(404).json({
                status: false,
                message: `fasilitas dengan id yang anda maksud tidak ditemukan`
            })
            return
        }

        const updateData = await prisma.fasilitas.update({
            data: {
                fasilitas: fasilitas || findFASI.fasilitas
            },
            where: { idFasilitas: Number(idFasilitas) },
            include: { kos: { select: { idKos: true } } }
        })

        response.status(200).json({
            status: true,
            data: updateData,
            message: `berhasil update data fasilitas !!`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `update gagal nih, terjadi sebuah error. ${error}`
        })
        return
    }
}

export const deleteFasilitas = async (request: Request, response: Response) => {
    try {
        const { kosId, idFasilitas } = request.params;

        const findKoss = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if(!findKoss) {
            response.status(404).json({
                status: false,
                message: `terjadi sebuah kesalhan saat akan mencari idkos yang anda maksud`
            })
            return
        }

        const findFass = await prisma.fasilitas.findFirst({
            where: { idFasilitas: Number(idFasilitas) }
        })

        if(!findFass) {
            response.status(404).json({
                status: false,
                message: 'terjadi kesalhan saat akan mencari fasilitas anda'
            })
            return
        }

        const deleteData = await prisma.fasilitas.delete({
            where: { idFasilitas: Number(idFasilitas) },
            include: { kos: { select: { idKos: true} } }
        })

        response.status(200).json({
            status: true,
            data: deleteData,
            message: "berhasil delete data !"
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalhan saat akan delete data. ${error}`
        })
    }
}