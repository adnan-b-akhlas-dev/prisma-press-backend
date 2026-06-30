import dotenv from "dotenv";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env");
dotenv.config({ path: envPath });

export default {
  port: process.env.PORT as string,
  database_url: process.env.DATABASE_URL as string,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND as string,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET as string,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN as string,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET as string,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN as string,
  stripe_product_id: process.env.STRIPE_PRODUCT_ID as string,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY as string,
};
