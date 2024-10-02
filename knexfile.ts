"use strict"

import dotenv from "dotenv"
dotenv.config()

const dbName = process.env.DATABASE_NAME
const dbUser = process.env.DATABASE_USER
const dbHost = process.env.DATABASE_HOST
const dbPassword = process.env.DATABASE_PASSWORD
const dbPort = process.env.DATABASE_PORT

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  local: {
    client: "postgresql",
    connection: {
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword,
    },
  },

  development: {
    client: "postgresql",
    connection: {
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword,
    },
  },

  homolog: {
    client: "postgresql",
    connection: {
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword,
    },
  },

  production: {
    client: "postgresql",
    connection: {
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword,
    },
  },
}
