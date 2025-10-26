import express from "express"
import uploadFile from "../middleware/photoUpload"
import { uploadPhoto, getAllPhoto, updateFoto, deleteFoto } from "../controller/uploadKosPic"
import { verifyRole, verifyToken } from "../middleware/auth"
import path from "path";

const app = express()
app.use(express.json())

app.use("/kos-photo", express.static(path.join(__dirname, "../public/kos-photo")));
app.post("/upload/:kosId", [verifyToken, verifyRole(["owner", "society"]), uploadFile.array("foto", 5)], uploadPhoto)
app.get("/get",[verifyToken, verifyRole(["owner", "society"])] , getAllPhoto)
app.put("/update/:kosId/:idFoto", [verifyToken, verifyRole(["owner", "society"]), uploadFile.single("foto")], updateFoto)
app.delete("/delete/:kosId/:idFoto", [verifyToken, verifyRole(["owner", "society"])], deleteFoto)


export default app