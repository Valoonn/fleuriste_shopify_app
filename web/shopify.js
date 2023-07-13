import { BillingInterval, LATEST_API_VERSION, shopifyApi, Session } from "@shopify/shopify-api";
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
    secret: "367d681b182bfdc17388aeae7bb8c306ad0a0cbe434b7e5112157cf7eba42df0",
  },
  // This should be replaced with your preferred storage strategy
  sessionStorage: new SQLiteSessionStorage(database),
});




// print the turnel app url 
console.log(shopify.api.config.hostName);

// const shopifyApiOffline = shopifyApi({
//   // The next 4 values are typically read from environment variables for added security
//   apiKey: '31c9a2aea067d6a465a32d80aade3c8b',
//   apiSecretKey: 'a6ee31cf0b93c76e225241dce638c3d9',
//   scopes: ['read_products, write_products, read_script_tags, write_script_tags, write_orders, read_orders'],
//   hostName: 'cosykicks.myshopify.com',
// });


const shopifyApiOffline = shopifyApi({
  apiSecretKey: "a8d0e6655f1fa51b46ed539d91b91736",            // Note: this is the API Secret Key, NOT the API access token
  isCustomStoreApp: true,                        // this MUST be set to true (default is false)
  adminApiAccessToken: "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", // Note: this is the API access token, NOT the API Secret Key
  isEmbeddedApp: false,
  hostName: "flowerfool.myshopify.com",
  restResources
});

console.log(shopifyApiOffline.config.hostName);

const session = shopifyApiOffline.session.customAppSession("flowerfool.myshopify.com");

export { shopify, session, shopifyApiOffline };
