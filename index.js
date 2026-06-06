import app from "./app.js";
import "./database.js";
import { config } from "./config.js";

async function main() {
  const PORT = config.server.port;
  app.listen(PORT);
  console.log("Servidor corriendo en el puerto " + PORT);
}

main();
