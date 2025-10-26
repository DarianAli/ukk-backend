import express from "express";
import { addData, editData } from "../middleware/verifyKos";
import { createKos, deleteData, getAllKos, getRekomendation, updateData } from "../controller/controllerKos";
import { verifyRole, verifyToken } from "../middleware/auth";

const app = express()
app.use(express.json())

app.post("/add", [verifyToken, verifyRole(["owner", "society"]), addData], createKos)
app.get("/get", [verifyToken, verifyRole(["owner", "society"])], getAllKos)
app.put("/update/:idKos", [verifyToken, verifyRole(["owner", "society"]), editData], updateData)
app.delete("/delete/:idKos", [verifyToken, verifyRole(["owner", "society"]), editData], deleteData)
app.get("/recommendations", getRekomendation)

export default app