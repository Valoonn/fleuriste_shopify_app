import { DeliveryMethod } from "@shopify/shopify-api";
import shopify from "./shopify.js";

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */



export default {
  /**
   * Customers can request their data from a store owner. When this happens,
   * Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-data_request
   */
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },

  /**
   * Store owners can request that data is deleted on behalf of a customer. When
   * this happens, Shopify invokes this webhook.
   *
   * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks#customers-redact
   */
  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },

  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
    },
  },



  ORDERS_PAID: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(payload)
      console.log("ORDER_PAID webhook received");
      console.log(topic);
      console.log(shop);
      console.log(webhookId);
    },
  },



  LOCATIONS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      console.log("LOCATIONS_CREATE webhook received");
      console.log(topic);
      console.log(shop);
      console.log(webhookId);
      const payload = JSON.parse(body);
      console.log(payload)
    }
  },



  ORDERS_CREATE: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(payload)
      console.log("ORDERS_CREATE webhook received");
      console.log(topic);
      console.log(shop);
      console.log(webhookId);
    }
  },



  ORDERS_UPDATED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(payload)
      console.log("ORDERS_UPDATED webhook received");
      console.log(topic);
      console.log(shop);
      console.log(webhookId);
    }
  },



  ORDERS_FULFILLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(payload)
      console.log("ORDERS_FULFILLED webhook received");
      console.log(topic);
      console.log(shop);
      console.log(webhookId);
    }
  },



  ORDERS_CANCELLED: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: shopify.config.webhooks.path,
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(payload)
      console.log("ORDERS_CANCELLED webhook received");
      console.log(topic);
      console.log(shop);
      console.log(webhookId);
    }
  }
}
