import "dotenv/config"
import { Options } from "sequelize"

const config: Options = {
    username: process.env.DATABASE_USER || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "postgres", // substitua o nome do banco quando for utilizar em seu projeto!
    host: process.env.DATABASE_HOST || "localhost",
    port: Number(process.env.DATABASE_PORT) || 5432,
    dialect: "postgres",
    timezone: "America/Sao_Paulo",
}

export = config
