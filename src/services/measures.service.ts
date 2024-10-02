import MeasureModel from "../database/models/measure.model"

import { Measure } from "../types/Measure"
import geminiService from "./gemini.service"
import { v4 as uuidv4 } from "uuid"
import CustomerModel from "../database/models/customer.model"
import { ServiceResponse } from "../types/ServiceResponse"
import { Op } from "sequelize"
import moment from "moment"
import { Customer } from "../types/Customer"

type BodyUploadMeasure = {
    image: string
    customer_code: string
    measure_datetime: Date
    measure_type: "WATER" | "GAS"
}

type UploadMeasureReturn = {
    image_url: string
    measure_value: number
    measure_uuid: string
}

type CustomerWithMeasures = Partial<Customer> & {
    measures: Partial<Measure>[]
}

export type WhereCondition = {
    customer_code: string
    measure_type?: "WATER" | "GAS"
}

async function createMeasure(
    body: BodyUploadMeasure
): Promise<ServiceResponse<UploadMeasureReturn>> {
    const { image, customer_code, measure_datetime, measure_type } = body
    const customer = await CustomerModel.findOne({
        where: {
            customer_code,
        },
    })
    if (!customer) {
        CustomerModel.create({
            customer_code,
        })
    }

    const measureExists = await MeasureModel.findOne({
        where: {
            customer_code,
            measure_type,
            measure_datetime: {
                [Op.between]: [
                    moment().startOf("month").toDate(),
                    moment().endOf("month").toDate(),
                ],
            },
        },
    })

    if (measureExists) {
        return {
            success: false,
            data: {
                error_code: "DOUBLE_REPORT",
                error_description: "Leitura do mês já realizada",
            },
        }
    }

    const serviceResponse = await geminiService.runGemini(image)
    if (!serviceResponse.success) {
        return {
            success: false,
            data: {
                error_code: "INVALID_DATA",
                error_description: "Invalid base64 image",
            },
        }
    }
    const { image_url, measure_value } = serviceResponse.data

    const measure = await MeasureModel.create({
        measure_uuid: uuidv4(),
        measure_datetime: new Date(measure_datetime),
        measure_type,
        has_confirmed: false,
        image_url,
        customer_code,
        measure_value,
    })
    return {
        success: true,
        data: {
            image_url: measure.dataValues.image_url,
            measure_value: measure.dataValues.measure_value,
            measure_uuid: measure.dataValues.measure_uuid,
        },
    }
}

async function confirmMeasure(
    measure_uuid: string,
    confirmed_value: number
): Promise<ServiceResponse<Measure>> {
    const measure = await MeasureModel.findOne({
        where: {
            measure_uuid,
        },
    })

    if (!measure) {
        return {
            success: false,
            data: {
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura não encontrada",
            },
        }
    }

    if (measure.dataValues.has_confirmed) {
        return {
            success: false,
            data: {
                error_code: "CONFIRMATION_DUPLICATE",
                error_description: "Leitura do mês já realizada",
            },
        }
    }

    const updatedMeasure = await MeasureModel.update(
        {
            has_confirmed: true,
            measure_value: confirmed_value,
        },
        {
            where: {
                measure_uuid,
            },
            returning: true,
        }
    )

    const res = await MeasureModel.findOne({
        where: {
            measure_uuid,
        },
    })

    const data = {
        ...res?.dataValues,
    } as Measure

    return {
        success: true,
        data,
    }
}

async function listMeasuresByCustomerCode(
    whereCondition: WhereCondition
): Promise<ServiceResponse<CustomerWithMeasures>> {
    const customerFromModel = (await CustomerModel.findOne({
        where: { customer_code: whereCondition.customer_code },
        attributes: ["customer_code"],
        include: [
            {
                model: MeasureModel,
                as: "measures",
                attributes: [
                    "measure_uuid",
                    "measure_datetime",
                    "measure_type",
                    "has_confirmed",
                    "image_url",
                ],
                where: whereCondition.measure_type
                    ? { measure_type: whereCondition.measure_type }
                    : {},
            },
        ],
    })) as any

    if (!customerFromModel) {
        return {
            success: false,
            data: {
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Nenhuma leitura encontrada",
            },
        }
    }

    const measures = customerFromModel?.dataValues.measures.map(
        (measure: any) => measure.dataValues
    )

    const customer: CustomerWithMeasures = {
        ...customerFromModel?.dataValues,
        measures,
    } as CustomerWithMeasures
    return {
        success: true,
        data: customer,
    }
}

export default { createMeasure, confirmMeasure, listMeasuresByCustomerCode }
