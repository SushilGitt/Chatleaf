// @ts-check
import React, { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Frame,
  Banner,
  Stack,
  SkeletonPage,
  SkeletonBodyText,
  Badge,
  Icon,
} from "@shopify/polaris";
import { CircleTickMinor, CancelSmallMinor } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "../hooks";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

export default function Pricing() {
  const app = useAppBridge();
  const fetchAuth = useAuthenticatedFetch();
  const redirect = Redirect.create(app);

  const [plan, setPlan] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [banner, setBanner] = useState(null);

  const PRICE = "100";

  const isCurrent = (p) => plan === p;

  /* ---------------- Load Plan ---------------- */

  const loadPlan = async () => {
    try {
      const res = await fetchAuth("/api/hasActiveSubscription");
      const data = await res.json();
      setPlan(data?.tier === "premium" ? "premium" : "free");
    } catch {
      setPlan("free");
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  /* ---------------- Change Plan ---------------- */

  const changePlan = async (target) => {
    if (target === plan) return;

    try {
      setActionLoading(target);

      if (target === "free") {
        await fetchAuth("/api/cancelSubscription");
        await loadPlan();
        setBanner({ status: "success", msg: "Free plan activated" });
        return;
      }

      const res = await fetchAuth(`/api/createSubscription?plan=premium`);
      const data = await res.json();

      if (data.confirmationUrl) {
        redirect.dispatch(
          Redirect.Action.REMOTE,
          data.confirmationUrl
        );
      }
    } finally {
      setActionLoading(null);
    }
  };

  /* ---------------- Feature Component ---------------- */

  const Feature = ({ children, available }) => (
    <Stack alignment="center" spacing="tight">
      <Icon
        source={available ? CircleTickMinor : CancelSmallMinor}
        color={available ? "success" : "subdued"}
      />
      <span
        style={{
          fontSize: 14,
          color: available ? "#111" : "#6B7280",
        }}
      >
        {children}
      </span>
    </Stack>
  );

  /* ---------------- Skeleton ---------------- */

  if (plan === null) {
    return (
      <Frame>
        <SkeletonPage title="Plans">
          <Layout>
            {[1, 2].map((i) => (
              <Layout.Section oneHalf key={i}>
                <Card sectioned>
                  <SkeletonBodyText lines={6} />
                </Card>
              </Layout.Section>
            ))}
          </Layout>
        </SkeletonPage>
      </Frame>
    );
  }

  /* ---------------- Styles ---------------- */

  const cardStyle = (p) => ({
    borderRadius: 16,
    border: isCurrent(p)
      ? "2px solid #25D366"
      : "1px solid #E5E7EB",
    boxShadow: isCurrent(p)
      ? "0 16px 40px rgba(37,211,102,0.2)"
      : "0 6px 18px rgba(0,0,0,0.06)",
    overflow: "hidden",
  });

  const topBar = (color) => ({
    height: 6,
    background: color,
  });

  const premiumButtonStyle = {
    background: "#25D366",
    color: "#fff",
    fontWeight: 600,
  };

  return (
    <Frame>
      <Page title="WhatsApp Chat Button Plans">

        {banner && (
          <Banner
            status={banner.status}
            onDismiss={() => setBanner(null)}
          >
            {banner.msg}
          </Banner>
        )}

        <Layout>

          {/* FREE PLAN */}
          <Layout.Section oneHalf>
            <div style={cardStyle("free")}>
              <div style={topBar("#16a34a")} />

              <Card sectioned>
                <Stack alignment="center" distribution="equalSpacing">
                  <h2>Free</h2>
                  {isCurrent("free") && (
                    <Badge status="success">Current</Badge>
                  )}
                </Stack>

                <h1 style={{ fontSize: 40, marginTop: 10,marginBottom: 10}}>$0</h1>
                <p style={{ color: "#6B7280", marginBottom: 10 }}>
                  Basic setup for homepage
                </p>

                <Stack vertical spacing="loose">
                   <Feature available>Floating WhatsApp button</Feature>
                  <Feature available>Show only homapge</Feature>
                  <Feature available={false}>Page visibility control</Feature>
                  <Feature available>Icon style options</Feature>
                  <Feature available>Color & shape settings</Feature>
                  <Feature available>Position & spacing control</Feature>
                </Stack>

                <div style={{ marginTop: 18 }}>
                  <Button
                    fullWidth
                    disabled={isCurrent("free")}
                    loading={actionLoading === "free"}
                    onClick={() => changePlan("free")}
                  >
                    {isCurrent("free")
                      ? "Current plan"
                      : "Switch to Free"}
                  </Button>
                </div>
              </Card>
            </div>
          </Layout.Section>

          {/* PREMIUM PLAN */}
          <Layout.Section oneHalf>
            <div style={cardStyle("premium")}>
              <div style={topBar("#25D366")} />

              <Card sectioned>
                <Stack alignment="center" distribution="equalSpacing">
                  <h2>Premium</h2>
                  {isCurrent("premium") && (
                    <Badge status="success">Current</Badge>
                  )}
                </Stack>

                <h1 style={{ fontSize: 40, marginTop: 10, marginBottom:10 }}>
                  ${PRICE}
                </h1>
                <p style={{ color: "#6B7280", marginBottom: 14 }}>
                  Full visibility and customization
                </p>

                <Stack vertical spacing="loose">
                  <Feature available>Floating WhatsApp button</Feature>
                  <Feature available>Show on all pages</Feature>
                  <Feature available>Page visibility control</Feature>
                  <Feature available>Icon style options</Feature>
                  <Feature available>Color & shape settings</Feature>
                  <Feature available>Position & spacing control</Feature>
                </Stack>

                <div style={{ marginTop: 18 }}>
                  <Button
                    fullWidth
                    style={premiumButtonStyle}
                    disabled={isCurrent("premium")}
                    loading={actionLoading === "premium"}
                    onClick={() => changePlan("premium")}
                  >
                    {isCurrent("premium")
                      ? "Premium active"
                      : "Upgrade to Premium"}
                  </Button>
                </div>
              </Card>
            </div>
          </Layout.Section>

        </Layout>
      </Page>
    </Frame>
  );
}