// Cancels the shop's active app subscription (the "downgrade to Free" action).
//
// Uses a direct fetch to the Admin GraphQL API — the same approach as
// web/index.js — because @shopify/shopify-api v13 removed the GraphQL client's
// legacy `.query()` method. The previous library-client implementation threw
// at runtime, which is why downgrading silently failed.

const API_VERSION = "2026-04";

async function shopifyGraphQL(session, query, variables = {}) {
  const res = await fetch(
    `https://${session.shop}/admin/api/${API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": session.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`GraphQL ${res.status}: ${JSON.stringify(json)}`);
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }
  return json.data;
}

const RECURRING_PURCHASES_QUERY = `
query {
  currentAppInstallation {
    activeSubscriptions {
      id
      name
      status
    }
  }
}`;

const CANCEL_SUBSCRIPTION = `
mutation appSubscriptionCancel($id: ID!) {
  appSubscriptionCancel(id: $id) {
    appSubscription {
      id
      name
      status
    }
    userErrors {
      field
      message
    }
  }
}`;

export default async function cancelSubscription(session) {
  // Find the active subscription to cancel.
  const data = await shopifyGraphQL(session, RECURRING_PURCHASES_QUERY);
  const subscriptions =
    data?.currentAppInstallation?.activeSubscriptions || [];
  const target =
    subscriptions.find((s) => s.status === "ACTIVE") || subscriptions[0];

  if (!target) {
    return "No active subscription";
  }

  // Cancel it.
  const cancelData = await shopifyGraphQL(session, CANCEL_SUBSCRIPTION, {
    id: target.id,
  });
  const result = cancelData?.appSubscriptionCancel;

  if (result?.userErrors?.length) {
    throw new Error(result.userErrors.map((e) => e.message).join(", "));
  }

  console.log(
    `Subscription cancelled for ${session.shop}: ${result?.appSubscription?.id} (${result?.appSubscription?.status})`
  );

  return result?.appSubscription?.status || "CANCELLED";
}
