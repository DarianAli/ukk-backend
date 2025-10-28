import express from "express";
import { verifyLogin, verifyUpdateUser, verifyUser } from "../middleware/verifyUSer";
import { auth, createUser, deleteUser, getAllData, getProfile, updateUser } from "../controller/controllerUser";
import { verifyRole, verifyToken } from "../middleware/auth";
import uploadFile from "../middleware/uploadUserPic";
import { postPic, updatePhoto } from "../controller/controllerUserPic";

const app = express()
app.use(express.json())

app.get("/profile", [verifyToken], getProfile)
app.post("/register", [verifyUser], createUser),
app.get("/get", [verifyToken, verifyRole(["owner"])], getAllData)
app.put("/update/:userId", [verifyUpdateUser, verifyToken, verifyRole(["society", "owner"])], updateUser)
app.delete("/delete/:idUser",[verifyToken, verifyRole(["owner"])], deleteUser)
app.post("/login",[verifyLogin], auth)
app.post("/upload/:userId", [verifyToken, verifyRole(["owner", "society"]), uploadFile.single("picture")], postPic)
app.put("/update/:userId", [verifyToken, verifyRole(["owner", "society"]), uploadFile.single("picture")], updatePhoto)

export default app