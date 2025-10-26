import express from "express"
import cors from "cors"
import userRoute from "./router/routesUser"
import kosRoute from "./router/routesKos"
import fotoRoute from "./router/routesPhoto"
import revRoute from "./router/routesReview"
import booksRoute from "./router/routesBooks"
import fasilityRoute from "./router/routeFasilitas"
import path from "path"

const PORT: number = 4000
const app = express()
app.use(cors())

app.use("/user", userRoute)
app.use("/kos", kosRoute)
app.use("/foto", fotoRoute)
app.use("/review", revRoute)
app.use("/book", booksRoute)
app.use("/fasility", fasilityRoute)
app.use("/kos-photo", express.static(path.join(__dirname, "../public/kos-photo")));
app.use("/user-photo", express.static(path.join(__dirname, "../public/user-photo")));


app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`)
})