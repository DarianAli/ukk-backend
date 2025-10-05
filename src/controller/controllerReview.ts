import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import { v4 as uuidv4 } from "uuid"

const prisma = new PrismaClient({ errorFormat: "pretty" })

export const postReview = async (request: Request, response: Response) => {
    try {
        const { kosId } = request.params;
        const { comment } = request.body;

        if(!request.user) {
            response.status(404).json({
                status: false,
                message: `Unotorized`
            })
            return
        }

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if (!findKos) {
            response.status(404).json({
                status: false,
                message: `kos yang anda maksud tidak ditemukan`
            })
            return
        }

        const rev = await prisma.reviews.create({
            data: {
                comment,
                uuid: uuidv4(),
                kosId: Number(kosId),
                userId: Number(request.user.id)
            },
            include: {
                user: { select: { idUser: true, email: true} },
                kos: { select: { idKos: true, name: true } }
            }
        })

        response.status(200).json({
            status: true,
            data: rev,
            message: `Berhasil upload review`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `Terjadi kesalahan saat upload review ${error}`
        })
        return
    }
}

export const getReviewbyKos = async (request: Request, response: Response) => {
    try {
        const { kosId } = request.params;

        const oneReview = await prisma.reviews.findMany({
            where: { kosId: Number(kosId) },
            include: { 
                user: { select: { idUser: true, email: true } }
             }
        })

        response.status(200).json({
            status: true,
            data: oneReview,
            message: `berhasil menampilkan review`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalahn saat akan menampilkan ${error}`
        })
    }
}

export const getAllReview = async (request: Request, response: Response) => {
    try {
        const allData = await prisma.reviews.findMany({
            select: {
                idReviews: true,
                comment: true,
                userId: true,
                kosId: true,
            }
        })

        response.status(200).json({
            status: true,
            data: allData,
            message: `berhasil menampilkan semua reviews`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            mesasge: `terjadi sebuah kesalahan saat menampilkan ${error}`
        })
        return
    }
}

export const editReview = async (request: Request, response: Response) => {
    try {
        const { kosId, idReviews } = request.params
        const { comment } = request.body;

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if (!findKos) {
             response.status(404).json({
                status: false,
                message: `kos yang anda cari tidak ada`
             })
             return
        }

        const findReview = await prisma.reviews.findFirst({
            where: { idReviews: Number(idReviews) }
        })

        if (!findReview) {
            response.status(404).json({
                status: false,
                message: `review yang anda maksud tidak ada`
            })
            return
        }

        const editRev = await prisma.reviews.update({
            data: {
                comment: comment || findReview.comment
            },
            where: { idReviews: Number(idReviews) }
        }) 
        response.status(200).json({
            status: true,
            data: editRev,
            message: `Berhasil edit review yay ^^`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `Terjadi sebuah keslahan saat akan update data ${error}`
        })
        return
    }
}

export const deleteRev = async (request: Request, response: Response) => {
    try {
        const { kosId, idReviews } = request.params;

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if (!findKos) {
            response.status(404).json({
                status: false,
                message: `kos yang anda cari tidak ada`
            })
            return
        }

        const findRev = await prisma.reviews.findFirst({
            where: { idReviews: Number(idReviews) }
        })

        if(!findRev) {
            response.status(404).json({
                status: false,
                message: `Review yang anda maksud tidak ada`
            })
            return
        }

        const deleteRev = await prisma.reviews.delete({
           where: { idReviews: Number(idReviews) }
        })

        response.status(200).json({
            status: true,
            data: deleteRev,
            message: `Berhasil menghapus review ^^`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `Terjadi error saat akan menghapus Review. ${error}`
        })
        return
    }
}

