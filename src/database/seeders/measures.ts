import { Knex } from "knex"
import { v4 as uuidv4 } from "uuid"

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("measures").del()

    // Inserts seed entries
    await knex("measures").insert([
        {
            measure_uuid: uuidv4(),
            measure_type: "WATER",
            has_confirmed: true,
            image_url: "http://example.com/image1.jpg",
            customer_code: "CUST001",
            measure_value: 123.45,
        },
        {
            measure_uuid: uuidv4(),
            measure_type: "GAS",
            has_confirmed: false,
            image_url: "http://example.com/image1.jpg",
            customer_code: "CUST001",
            measure_value: 123,
        },
        {
            measure_uuid: uuidv4(),
            measure_type: "GAS",
            has_confirmed: false,
            image_url: "http://example.com/image2.jpg",
            customer_code: "CUST002",
            measure_value: 678.9,
        },
        {
            measure_uuid: uuidv4(),
            measure_type: "WATER",
            has_confirmed: true,
            image_url: "http://example.com/image3.jpg",
            customer_code: "CUST003",
            measure_value: 234.56,
        },
    ])
}
