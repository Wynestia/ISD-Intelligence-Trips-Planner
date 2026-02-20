import { Elysia } from "elysia";
import { node } from "@elysiajs/node";
import { cors } from '@elysiajs/cors'
import { swagger } from '@elysiajs/swagger'
import { userRoutes } from "./src/routes/user"
import { authRoutes } from "./src/routes/auth"

const PORT = 3001

const app = new Elysia({ adapter: node() })
  .use(swagger())
  .use(cors())
  .use(authRoutes)
  .use(userRoutes)
  .get("/", () => ({ hello: "Node.js👋" }))
  .listen(PORT);

console.log(`Listening on http://localhost:${PORT}`);
