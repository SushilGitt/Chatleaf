import { DeliveryMethod } from "@shopify/shopify-api";
import { connectToMongoDB } from "./mongodb.js";

/**
 * ChatLink does not collect or store any customer-level personal data. The app
 * only adds a WhatsApp chat button to the storefront — clicks open WhatsApp
 * directly without any data passing through our servers. The only data we
 * persist is the merchant's shop session (access token + shop domain), used to
 * read theme/product metadata and manage app subscription billing.
 *
 *  - customers/data_request: nothing to return (no customer data held)
 *  - customers/redact:       nothing to delete (no customer data held)
 *  - shop/redact:            delete the shop's session document from MongoDB
 *
 * https://shopify.dev/docs/apps/webhooks/configuration/mandatory-webhooks
 *
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(
        `[GDPR] customers/data_request shop=${shop} webhookId=${webhookId} customerId=${payload?.customer?.id} — no customer data stored, nothing to return.`
      );
    },
  },

  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      const payload = JSON.parse(body);
      console.log(
        `[GDPR] customers/redact shop=${shop} webhookId=${webhookId} customerId=${payload?.customer?.id} — no customer data stored, nothing to delete.`
      );
    },
  },

  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic, shop, body, webhookId) => {
      console.log(`[GDPR] shop/redact shop=${shop} webhookId=${webhookId} — deleting shop sessions.`);
      try {
        const collection = await connectToMongoDB();
        const result = await collection.deleteMany({ shop });
        console.log(`[GDPR] shop/redact: deleted ${result.deletedCount} session document(s) for shop=${shop}.`);
      } catch (err) {
        console.error(`[GDPR] shop/redact failed for shop=${shop}:`, err);
        throw err;
      }
    },
  },
};
