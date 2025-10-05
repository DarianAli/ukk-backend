import express from "express";
import { verifyLogin, verifyUpdateUser, verifyUser } from "../middleware/verifyUSer";
import { auth, createUser, deleteUser, getAllData, updateUser } from "../controller/controllerUser";
import { verifyRole, verifyToken } from "../middleware/auth";

const app = express()
app.use(express.json())

app.post("/register", [verifyToken, verifyRole(["owner", "society"]), verifyUser], createUser),
app.get("/get", [verifyToken, verifyRole(["owner"])], getAllData)
app.put("/update/:idUser", [verifyUpdateUser, verifyToken, verifyRole(["society", "owner"])], updateUser)
app.delete("/delete/:idUser",[verifyToken, verifyRole(["owner"])], deleteUser)
app.post("/login/",[verifyToken, verifyRole(["owner", "society"]), verifyLogin], auth)

export default app