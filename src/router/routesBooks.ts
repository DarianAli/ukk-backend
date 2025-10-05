import express from "express"
import { addBooks, editBooking, editGwah } from "../middleware/verifyBooks"
import { createBooks, editBooks, editStatus, getAllBooking, getHistory, getMyBooking, getPerUser } from "../controller/controllerBooks"
import { verifyRole, verifyToken } from "../middleware/auth"

const app = express()
app.use(express.json())

app.post("/booking/:kosId", [addBooks, verifyToken, verifyRole(["owner", "society"])], createBooks)
app.put("/update", [verifyToken, verifyRole(["owner", "society"]), editBooking], editBooks)
app.get("/getAll", [verifyToken, verifyRole(["owner", "society"])],  getAllBooking)
app.get("/get-perUser",[verifyToken, verifyRole(["owner", "society"])], getPerUser)
app.get("/get-bookingAdmin", [verifyToken, verifyRole(["owner"])], getHistory)
app.get("/get-myHistory", [verifyToken, verifyRole(["owner", "society"])], getMyBooking)
app.put("/editStatus/:kosId/:idBooks", [verifyToken, verifyRole(["owner"]), editGwah], editStatus)

export default app;