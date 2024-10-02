"use strict"

import Knex from "knex"
import dotenv from "dotenv"
dotenv.config()

const dbName = process.env.DATABASE_NAME
const dbUser = process.env.DATABASE_USER
const dbHost = process.env.DATABASE_HOST
const dbPassword = process.env.DATABASE_PASSWORD
const dbPort = Number(process.env.DATABASE_PORT)

const knex = Knex({
    client: "postgresql",
    connection: {
        host: dbHost,
        port: dbPort,
        user: dbUser,
        password: dbPassword,
        database: dbName,
    },
    acquireConnectionTimeout: 1000000,
    pool: {
        min: 0,
        max: 4,
        acquireTimeoutMillis: 300000,
        createTimeoutMillis: 300000,
        destroyTimeoutMillis: 300000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 2000,
    },
})

export default knex
