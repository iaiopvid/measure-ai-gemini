import { Request, Response } from "express"
import measuresService, { WhereCondition } from "../services/measures.service"

class MeasureController {
    static async createMeasure(req: Request, res: Response) {
        const serviceResponse = await measuresService.createMeasure(req.body)
        if (serviceResponse.success) {
            return res.status(200).json({
                ...serviceResponse.data,
            })
        }
        if (serviceResponse.data.error_code === "INVALID_DATA") {
            return res.status(400).json({
                ...serviceResponse.data,
            })
        }
        return res.status(409).json({
            ...serviceResponse.data,
        })
    }

    static async confirmMeasure(req: Request, res: Response) {
        const { measure_uuid, confirmed_value } = req.body
        const serviceResponse = await measuresService.confirmMeasure(
            measure_uuid,
            confirmed_value
        )
        if (serviceResponse.success) {
            return res.status(200).json({
                success: true,
            })
        }
        if (serviceResponse.data.error_code === "MEASURE_NOT_FOUND") {
            return res.status(404).json({
                ...serviceResponse.data,
            })
        }
        return res.status(409).json({
            ...serviceResponse.data,
        })
    }

    static async listMeasures(req: Request, res: Response) {
        const { customer_code } = req.params
        const { measure_type } = req.query
        let whereCondition: WhereCondition = { customer_code }
        if (measure_type && typeof measure_type === "string") {
            const normalizedMeasureType = measure_type.toUpperCase()
            if (["WATER", "GAS"].includes(normalizedMeasureType)) {
                whereCondition = {
                    ...whereCondition,
                    measure_type: normalizedMeasureType as "WATER" | "GAS",
                }
            }
        }

        const serviceResponse =
            await measuresService.listMeasuresByCustomerCode(whereCondition)
        if (serviceResponse.success) {
            return res.status(200).json({
                ...serviceResponse.data,
            })
        }
        return res.status(404).json({
            ...serviceResponse.data,
        })
    }
}

export default MeasureController
