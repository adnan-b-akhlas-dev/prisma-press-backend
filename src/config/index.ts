import dotenv from "dotenv";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env");
dotenv.config({ path: envPath });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
};
