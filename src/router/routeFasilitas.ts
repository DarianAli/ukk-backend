import express from "express";
import { createFASS, updateFASS } from "../middleware/verifyFasilitas";
import { addFasility, deleteFasilitas, getAllFAS, updateFasility } from "../controller/controllerFasility";
import { verifyRole, verifyToken } from "../middleware/auth";

const app = express()
app.use(express.json())

app.post("/create-Fasility/:kosId", [verifyToken, verifyRole(["owner", "society"]), createFASS], addFasility)
app.get("/get-Fasility", [verifyToken, verifyRole(["owner", "society"])], getAllFAS)
app.put("/edit-Fasility/:kosId/:idFasilitas", [verifyToken, verifyRole(["owner", "society"]), updateFASS], updateFasility)
app.delete("/delete-Fasility/:kosId/:idFasilitas", [verifyToken, verifyRole(["owner", "society"])], deleteFasilitas)

export default app