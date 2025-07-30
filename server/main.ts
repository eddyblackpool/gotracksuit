// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import { customAlphabet } from "jsr:@viki/nanoid";
import * as cors from "jsr:@tajpouria/cors";

export type Input = {
  id: number;
  brand: number;
  text: string;
};

console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);

console.log("Initialising server");

const router = new oak.Router({
  prefix: "/api",
});

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = { status: 200, result };
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.put("/insights/create", async (ctx) => {
  // TODO
  // create new insight record

  if (!ctx.request.hasBody) {
    ctx.throw(415);
  }

  const reqBody = await ctx.request.body.json();

  const nanoid = customAlphabet("0123456789", 5);
  const uuid = parseInt(nanoid());

  const data: Input = {
    id: uuid,
    brand: reqBody.brand,
    text: reqBody.text,
  };

  const result = createInsight({ db, ...data });
  ctx.response.body = { status: 200, result };
});

router.delete("/insights/delete/:id", (ctx) => {
  const insightId = ctx.params.id;

  // console.log("reqBody deleting record", insightId);

  const result = deleteInsight({ db, id: parseInt(insightId) });

  ctx.response.body = { status: 200, result };
});

const app = new oak.Application();

app.use(cors.oakCors({ methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
