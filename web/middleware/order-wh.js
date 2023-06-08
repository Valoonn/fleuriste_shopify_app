const { DeliveryMethod } = require('@shopify/shopify-api');

import shopify from "../shopify.js";

import { FleuristeDB } from "../fleuriste-db.js";


import { gql } from 'graphql-request'


export default {
  ORDER_PAID: {
    deliveryMethod: DeliveryMethod.Http,
    callbackurl: shopify.config.webhooks.path,
    callback: async (shopDomain, webhook) => {
      console.log("ORDER_PAID webhook received");
      console.log(webhook);
      console.log(shopDomain);
      console.log(webhook.payload);
    },
  },
  ORDER_UPDATED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackurl: shopify.config.webhooks.path,
    callback: async (shopDomain, webhook) => {
      console.log("ORDER_UPDATED webhook received");
      console.log(webhook);
      console.log(shopDomain);
      console.log(webhook.payload);
    }
  },
  CUSTOMER_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackurl: shopify.config.webhooks.path,
    callback: async (shopDomain, webhook) => {
      console.log("CUSTOMER_DATA_REQUEST webhook received");
      console.log(webhook);
      console.log(shopDomain);
      console.log(webhook.payload);
    }
  },
}
