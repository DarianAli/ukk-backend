import { Request, Response } from "express"
import { PrismaClient, status } from "../../generated/prisma"
import { v4 as uuidv4 } from "uuid"
import { stat } from "fs"

const prisma = new PrismaClient({ errorFormat: "pretty" })

const cycleMap: Record<string, number> = {
    monthly: 1,
    quarterly: 3,
    yearly: 12
}

export const createBooks = async (request: Request, response: Response) => {
    try {
        const { kosId } = request.params;
        const { startDate, endDate, paymmentCycle } = request.body;

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if(!findKos) {
            response.status(404).json({
                status: false,
                message: `kos yang anda cari tidak ditemukan`
            })
            return
        }

        const price = Number(findKos.price_per_month)

        if (isNaN(price)) {
            response.status(400).json({
                status: false,
                message: "Pricenya isNaN"
            })
            return
        }

        const multiple = cycleMap[paymmentCycle as keyof typeof cycleMap] || 1
        const totalPrice = price * multiple

        const start = new Date(startDate)
        if (isNaN(start.getTime())){
            response.status(400).json({
                status: false,
                message: 'Start date tidak valid'
            })
            return
        }

        const end = new Date(endDate)
        if(isNaN(end.getDate())) {
            response.status(400).json({
                status: false,
                message: 'End date tidak valid'
            })
            return
        }


        const booking = await prisma.books.create({
            data: {
                uuid: uuidv4(),
                startDate: start,
                endDate: end,
                paymmentCycle,
                totalPrice,
                userId: Number(request.user?.id),
                kosId: Number(kosId)
            },
            include: {
                user_id: { select: { idUser: true, email: true } },
                kos_id: { select: { idKos: true, name: true } }
            }
        })

        response.status(200).json({
            status: true,
            data: booking,
            message: `berhasil menambahkan bookingan baru`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi sebuah kesalahn saat akan menambahkan bookingan. ${error}`
        })
        return
    }
}

export const getAllBooking = async(request: Request, response: Response) => {
    try { 
        const booking = await prisma.books.findMany({
            include: {
                user_id: { select: { idUser: true, email: true } },
                kos_id: { select: { idKos: true, name: true } }
            },
            where: {
                status: "active"
            }
        })

        response.status(200).json({
            status: true,
            data: booking,
            message: `berhasil menampilkan semua booking`
        })
        return
    } catch ( error ) {
        response.status(400).json({
            status: false,
            message: `terjadi sebuah kesalhan saat akan menampikan booking. ${error}`
        })
        return
    } 
}

export const getPerUser = async (request: Request, response: Response) => {
    try {
        if (!request.user) {
            response.status(401).json({
                status: false,
                message: `Unothorized`
            })
            return
        }

        const bookings =  await prisma.books.findMany({
            where: { userId: Number(request.user.id) },
            include: { 
                kos_id: { select: { idKos: true, name: true } }
            }
        })

        response.status(200).json({
            status: true,
            data: bookings,
            message: `berhasil menampilkan daftar bookingan kamu nih ^^`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi sebuah kesalhan saat ingin menampilkan. ${error}`
        })
        return
    }
}

export const editBooks = async (request: Request, response: Response) => {
    try {
        const { kosId } = request.params;
        const { idBooks } = request.params;
        const { startDate, endDate, paymmentCycle } = request.body;

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if(!findKos) {
            response.status(404).json({
                status: false,
                message: `Kos yang anda cari tidak ditemukan`
            })
            return
        }

        const findBooks = await prisma.books.findFirst({
            where: { idBooks: Number(idBooks) }
        })

        if(!findBooks) {
            response.status(404).json({
                status: false,
                message: `booking yang kamu cari tidak ditemukan`
            })
            return
        }

        if (findBooks.status !== "active") {
            response.status(400).json({
                status: false,
                message: "booking tidak dapat diubah karena sudah selesai"
            })
        }
 
        const data = await prisma.books.update({
            data: {
                startDate: startDate || findBooks.startDate,
                endDate: endDate || findBooks.endDate,
                paymmentCycle: paymmentCycle || findBooks.paymmentCycle
            },
            where: { idBooks: Number(idBooks) }
        })

        response.status(200).json({
            status: true,
            data: data,
            message: `Berhasill update data bookingan anda ^^`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `Terjadi kesalahan saat akan update :(. ${error}`
        })
        return
    }
}

export const getMyBooking = async(request: Request, response: Response) => {
    try {
        if(!request.user) {
            response.status(404).json({
                status: false,
                message: `unothorized`
            })
            return
        }

        const historyUser = await prisma.books.findMany({
            where: {
                userId: Number(request.user.id),
                NOT: { status: "active" }
            },
            include: {
                kos_id: { select: { idKos: true, name: true } }
            },
            orderBy: { createdAt: "desc" }
        })

        response.status(200).json({
            status: true,
            data: historyUser,
            message: `Berhasil menampilkan history anda ^^`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi sebuah kesalhan saat ingin menampilkna history anda. ${error}`
        })
        return
    }
}

export const getHistory = async (reqeust: Request, response: Response) => {
    try {
        const historyAll = await prisma.books.findMany({
            where: { NOT: { status: "active" } },
            include: {
                user_id: { select: { idUser: true, name: true, email: true } },
                kos_id: { select: { idKos: true, name: true } }
            },
            orderBy: { createdAt: "desc" }
        })

        response.status(200).json({
            status: true,
            data: historyAll,
            message: `berhasil menampilkan semua history user`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalhan saat akan menampilkan data history. ${error}`
        })
        return
    }
}

export const editStatus = async(request: Request, response: Response) => {
    try {
        const { kosId, idBooks } = request.params;
        const { status } = request.body;

        const findKos = await prisma.kos.findFirst({
            where: { idKos: Number(kosId) }
        })

        if(!findKos) {
            response.status(404).json({
                status: false,
                message: `kos yang anda maksud tidak dapat ditemukan`
            })
            return
        }

        const findBooking = await prisma.books.findFirst({
            where: { idBooks: Number(idBooks) }
        })    

        if(!findBooking) {
            response.status(404).json({
                status: false,
                message: `booking yang anda maksud tidak dapat ditemukan`
            })
            return
        }

        const editZtatuz = await prisma.books.update({
            data: {
                status: status || findBooking.status
            },
            where: { idBooks: Number(idBooks) }
        })

        response.status(200).json({
            status: true,
            data: editZtatuz,
            message: `berhasil mengubah status THX ^^`
        })
        return
    } catch (error) {
        response.status(400).json({
            status: false,
            message: `terjadi kesalhan saat akan update status user. ${error}`
        })
    }
}