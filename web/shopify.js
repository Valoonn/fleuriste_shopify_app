import { BillingInterval, LATEST_API_VERSION, shopifyApi } from "@shopify/shopify-api";
import { shopifyApp } from "@shopify/shopify-app-express";
import { SQLiteSessionStorage } from "@shopify/shopify-app-session-storage-sqlite";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";


import sqlite3 from "sqlite3";
import { join } from "path";
import { FleuristeDB } from "./fleuriste-db.js";


const database = new sqlite3.Database(join(process.cwd(), "fleuriste.sqlite"));


FleuristeDB.db = database;
FleuristeDB.init();

const shopify = shopifyApp({
  api: {
    apiVersion: LATEST_API_VERSION,
    restResources,
    billing: undefined, // or replace with billingConfig above to enable example billing
  },
  auth: {
    path: "/api/auth",
    callbackPath: "/api/auth/callback",
  },
  webhooks: {
    path: "/api/webhooks",
    secret: "4f0bc70ba68fb9f75b9472575c08d6c0d88f075717049203b796193ad0f72e65",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new SQLiteSessionStorage(database),
});

export default shopify;
