// @ts-check
import React, { useState, useCallback, useMemo } from "react";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Button,
  Modal,
  Frame,
  TopBar,
  DisplayText,
  SkeletonBodyText,
  Banner,
  Stack,
  ButtonGroup,
  Badge,
} from "@shopify/polaris";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import { shopifyBackground } from "../assets";

export default function HomePage() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [activateError, setActivateError] = useState(null);
  const [videoModalActive, setVideoModalActive] = useState(false);

  const app = useAppBridge();
  const fetch = useAuthenticatedFetch();
  const redirect = Redirect.create(app);

  const logo = {
    width: 50,
    topBarSource:
      "https://cdn.shopify.com/s/files/1/0960/5883/5311/files/Whatsapp.png?v=1771996216",
    url: "/",
    accessibilityLabel: "WhatsApp Chat Button",
  };

  /* ---------------- Plans ---------------- */

  const planLabels = {
    free: "Free",
    premium: "Premium",
  };

  const planPrices = {
    premium: "100.00",
  };

  const plans = ["free", "premium"];

  const {
    data: subscriptionData,
    isLoading,
    isFetching,
    refetch,
  } = useAppQuery({
    url: "/api/hasActiveSubscription",
  });

  const currentPlan = useMemo(() => {
    if (!subscriptionData) return "free";
    if (subscriptionData.tier === "premium") return "premium";
    return "free";
  }, [subscriptionData]);

  const currentPlanLabel = planLabels[currentPlan];
  const isPlanLoading = isLoading || isFetching;

  /* ---------------- Theme Editor ---------------- */

  const openThemeEditor = async () => {
    setActivateError(null);
    try {
      const response = await fetch("/api/getshop");
      const data = await response.json();

      const APP_ID = "YOUR_APP_ID";
      const BLOCK_HANDLE = "whatsapp-chat-button";

      const editorUrl = `https://${data.shop}/admin/themes/current/editor?context=apps&activateAppId=${APP_ID}/${BLOCK_HANDLE}`;

      window.open(editorUrl, "_blank");
    } catch {
      setActivateError("Failed to open theme editor.");
    }
  };

  /* ---------------- Billing ---------------- */

  const handlePlanClick = async (targetPlan) => {
    if (targetPlan === currentPlan) return;

    try {
      setLoadingPlan(targetPlan);

      if (targetPlan === "free") {
        await fetch("/api/cancelSubscription");
        await refetch();
        return;
      }

      if (targetPlan === "premium") {
        const res = await fetch(`/api/createSubscription?plan=premium`);
        const data = await res.json();

        if (data.confirmationUrl) {
          redirect.dispatch(
            Redirect.Action.REMOTE,
            String(data.confirmationUrl)
          );
        }
      }
    } finally {
      setLoadingPlan(null);
    }
  };

  /* ---------------- Styles ---------------- */

  const sectionShellStyle = {
    background: "#f9fafb",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 26px rgba(15, 23, 42, 0.06)",
    border: "1px solid #e5e7eb",
  };

  const sectionAccentBar = (
    <div
      style={{
        height: 4,
        width: 64,
        borderRadius: 999,
        background:
          "linear-gradient(90deg, #22c55e 0%, #25D366 50%, #16a34a 100%)",
        marginBottom: 12,
      }}
    />
  );

  return (
    <Frame topBar={<TopBar />} logo={logo}>
      <Page title="WhatsApp Chat Button">
        <Layout>

          {/* PLAN SECTION */}
          <Layout.Section>
            <div style={sectionShellStyle}>
              {sectionAccentBar}
              <Card title="Your plan" sectioned>
                {isPlanLoading ? (
                  <SkeletonBodyText lines={2} />
                ) : (
                  <Stack vertical spacing="loose">
                    <Stack alignment="center" spacing="tight">
                      <span>Active plan:</span>
                      <Badge status="success">{currentPlanLabel}</Badge>
                    </Stack>

                    <ButtonGroup>
                      {plans.map((plan) => (
                        <Button
                          key={plan}
                          primary={currentPlan === plan}
                          loading={loadingPlan === plan}
                          onClick={() => handlePlanClick(plan)}
                        >
                          {plan === "free"
                            ? "Free"
                            : `Premium – $${planPrices.premium}/month`}
                        </Button>
                      ))}
                    </ButtonGroup>
                  </Stack>
                )}
              </Card>
            </div>
          </Layout.Section>

          {/* INTRO SECTION */}
          <Layout.Section>
            <div style={sectionShellStyle}>
              {sectionAccentBar}
              <Card sectioned>
                <Stack alignment="center" distribution="fill" wrap spacing="loose">

                  {/* LEFT CONTENT */}
                  <div style={{ flex: 1, minWidth: 260, maxWidth: 520 }}>
                    <TextContainer spacing="tight">
                      <DisplayText size="Large">
                        Add WhatsApp chat to your store
                      </DisplayText>

                      <p>
                        Add a floating WhatsApp button to your store and let customers contact you instantly.
                        Increase trust, improve support, and boost conversions with direct messaging.
                      </p>

                      <h2><b>How to set up</b></h2>
                      <ol style={{ paddingLeft: "18px" }}>
                        <li>Click <b>Open theme editor</b>.</li>
                        <li>Add block → Apps → WhatsApp Chat Button.</li>
                        <li>Enter your WhatsApp number.</li>
                        <li>Customize position, color, and style.</li>
                        <li>Save the theme.</li>
                      </ol>

                      <h2><b>Main features</b></h2>
                      <ul style={{ paddingLeft: "18px" }}>
                        <li>Floating WhatsApp icon</li>
                        <li>Custom message support</li>
                        <li>Multiple icon styles</li>
                        <li>Position control (left/right)</li>
                        <li>Free & Premium plan support</li>
                      </ul>

              

                    </TextContainer>
                  </div>

                  {/* RIGHT PREVIEW */}
                  <div style={{ flex: 1, minWidth: 260, maxWidth: 320 }}>
                    <div
                      style={{
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
                        backgroundImage: `url(${shopifyBackground})`,
                        backgroundSize: "cover",
                        padding: 18,
                      }}
                    >
                      <img
                        src="https://cdn.shopify.com/s/files/1/0960/5883/5311/files/Screenshot_2026-02-25_125658.png?v=1772004439"
                        alt="WhatsApp Preview"
                        style={{ width: "100%", borderRadius: 8 }}
                      />
                    </div>
                  </div>

                </Stack>
              </Card>
            </div>
          </Layout.Section>

          {activateError && (
            <Layout.Section>
              <Banner
                status="critical"
                onDismiss={() => setActivateError(null)}
              >
                {activateError}
              </Banner>
            </Layout.Section>
          )}

        </Layout>
      </Page>
    </Frame>
  );
}