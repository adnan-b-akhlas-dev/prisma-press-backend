import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const port = config.port;

(async function (): Promise<void> {
  try {
    await prisma.$connect();
    console.log("Prisma connected to database successfully");
    app.listen(port, () => console.log(`Server listening to PORT: ${port}`));
  } catch (error: unknown) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
})();
