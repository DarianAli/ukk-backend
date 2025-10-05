import express from "express";
import { addReview, editRev } from "../middleware/verifyReview";
import { deleteRev, editReview, getAllReview, getReviewbyKos, postReview } from "../controller/controllerReview";
import { verifyRole, verifyToken } from "../middleware/auth";

const app = express()
app.use(express.json())

app.post("/add/:kosId", [verifyToken, verifyRole(["owner", "society"]), addReview], postReview)
app.get("/get", [verifyToken, verifyRole(["owner", "society"]), verifyToken], getAllReview)
app.get("/getRev/:kosId", [verifyToken, verifyRole(["owner", "society"])], getReviewbyKos)
app.put("/edit/:kosId/:idReviews", [verifyToken, verifyRole(["owner", "society"]), editRev], editReview)
app.delete("/delete/:kosId/:idReviews", [verifyToken, verifyRole(["owner", "society"])], deleteRev)

export default app