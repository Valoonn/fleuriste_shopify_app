// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import dotenv from "dotenv";
dotenv.config();

import { DeliveryMethod } from "@shopify/shopify-api";
import { shopify } from "./shopify.js";

import applyFleuristeApiEndpoints from "./middleware/fleuriste-api.js";

import GDPRWebhookHandlers from "./gdpr.js";

import sendWH from "./webhooks/index.js";

import ValidationRoute from "./Routes/validation.js"

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
const externApp = express();


// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);


shopify.api.webhooks.addHandlers(GDPRWebhookHandlers);


console.log(shopify.config.auth.callbackPath)


console.log(shopify.config.webhooks.path)

app.post(shopify.config.webhooks.path, express.text({ type: '*/*' }), async (req, res) => {
  try {
    await sendWH(JSON.parse(req.body), req.headers['x-shopify-topic'])
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(200);
    console.log(error.message);
  }
});




// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

// app.use(shopify.config.auth.path, shopify.validateAuthenticatedSession());
// app.use(shopify.config.auth.callbackPath, shopify.validateAuthenticatedSession());
// app.use("/api/fleuriste", shopify.validateAuthenticatedSession());


async function handleApiMiddleware(req, res, next) {
  // if the path contain /external next()
  // else call shopify.ensureInstalledOnShop()

  if (req.baseUrl.includes("/external"))
    next()
  else
    shopify.validateAuthenticatedSession()(req, res, next)
}



app.use("/api/*", handleApiMiddleware);

app.use("/api/external/validation", ValidationRoute)







// create a middleware that print everty request received
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});





app.use(express.json());


applyFleuristeApiEndpoints(app);




app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));




async function handleMiddleware(req, res, next) {
  // if the path contain /external next()
  // else call shopify.ensureInstalledOnShop()
  if (req.path.includes("/external"))
    next()
  else
    shopify.ensureInstalledOnShop()(req, res, next)
}





app.use("/*", handleMiddleware, async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});



app.listen(PORT);
console.log(`[ app ] : http://localhost:${PORT}`);