import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("customers").del()

  // Inserts seed entries
  await knex("customers").insert([
    { customer_code: "CUST001" },
    { customer_code: "CUST002" },
    { customer_code: "CUST003" },
  ])
}
