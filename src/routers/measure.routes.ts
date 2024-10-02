import { Router } from "express"
import MeasureController from "../controllers/MeasureController"
import validation from "../middlewares/validation"

const measuresRouter = Router()

measuresRouter.post(
    "/upload",
    validation.validateUpload,
    MeasureController.createMeasure
)
measuresRouter.patch(
    "/confirm",
    validation.validateConfirm,
    MeasureController.confirmMeasure
)
measuresRouter.get(
    "/:customer_code/list",
    validation.validateListMeasures,
    MeasureController.listMeasures
)

export default measuresRouter
