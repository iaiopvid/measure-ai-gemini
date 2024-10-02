require("dotenv").config()
require("express-async-errors")
import express, { Request, Response } from "express"
import measureRoutes from "./routers/measure.routes"
import bodyParser from "body-parser"
import errorMiddleware from "./middlewares/error"

const app = express()
app.use(bodyParser.json({ limit: "10mb" }))
// app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.json())
app.use(measureRoutes)

app.get("/", (_req: Request, res: Response) => {
    res.status(200).send("Health Check!")
})

app.use(errorMiddleware)

export default app
