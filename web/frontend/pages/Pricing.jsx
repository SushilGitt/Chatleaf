// @ts-check
import React, { useEffect, useState } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  Banner,
  SkeletonBodyText,
  Badge,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../hooks";

export default function Pricing() {
  const fetchAuth = useAuthenticatedFetch();

  const [plan, setPlan] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [banner, setBanner] = useState(null);

  const PRICE = "100";
  const isCurrent = (p) => plan === p;

  const loadPlan = async () => {
    try {
      const res = await fetchAuth("/api/hasActiveSubscription");
      const data = await res.json();
      setPlan(data?.tier === "premium" ? "premium" : "free");
    } catch {
      setPlan("free");
    }
  };

  useEffect(() => { loadPlan(); }, []);

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
        if (window.top) {
          window.top.location.href = data.confirmationUrl;
        } else {
          window.location.href = data.confirmationUrl;
        }
      }
    } finally {
      setActionLoading(null);
    }
  };

  if (plan === null) {
    return (
      <Page title="Pricing">
        <Layout>
          <Layout.Section>
            <Card sectioned><SkeletonBodyText lines={8} /></Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const features = [
    { name: "WhatsApp button on homepage", free: true, premium: true },
    { name: "Product & collection pages", free: false, premium: true },
    { name: "All pages coverage", free: false, premium: true },
    { name: "Page visibility control", free: false, premium: true },
    { name: "Custom button color", free: false, premium: true },
    { name: "Custom shape & position", free: false, premium: true },
    { name: "Multiple icon styles", free: false, premium: true },
    { name: "Custom default message", free: false, premium: true },
  ];

  const Mark = ({ on }) => on ? (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ) : (
    <span style={{ color: "#D1D5DB", fontSize: 18, fontWeight: 400 }}>—</span>
  );

  return (
    <Page title="Pricing">

      {banner && (
        <div style={{ marginBottom: 16 }}>
          <Banner status={banner.status} onDismiss={() => setBanner(null)}>{banner.msg}</Banner>
        </div>
      )}

      <Layout>

        {/* PRICE HEADERS BAR */}
        <Layout.Section>
          <div style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            overflow: "hidden",
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr",
              borderBottom: "1px solid #E5E7EB",
            }}>
              <div style={{ padding: "20px 22px" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#002B5C", marginBottom: 4 }}>
                  Choose your plan
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  Compare features side-by-side
                </div>
              </div>

              {/* FREE COLUMN HEADER */}
              <div style={{
                padding: "20px 18px",
                borderLeft: "1px solid #E5E7EB",
                background: isCurrent("free") ? "#F9FAFB" : "#fff",
                textAlign: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#002B5C" }}>Free</span>
                  {isCurrent("free") && <Badge status="info">Current</Badge>}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#002B5C", lineHeight: 1 }}>$0</div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>forever</div>
              </div>

              {/* PREMIUM COLUMN HEADER */}
              <div style={{
                padding: "20px 18px",
                borderLeft: "1px solid #E5E7EB",
                background: isCurrent("premium") ? "#EFF6FF" : "#FAFCFF",
                textAlign: "center",
                position: "relative",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#0084FF" }}>Premium</span>
                  {isCurrent("premium") ? (
                    <Badge status="success">Current</Badge>
                  ) : (
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: "#fff",
                      background: "#0084FF",
                      padding: "2px 8px",
                      borderRadius: 999,
                      letterSpacing: 0.5,
                    }}>BEST VALUE</span>
                  )}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#0084FF", lineHeight: 1 }}>
                  ${PRICE}
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#6B7280" }}>/mo</span>
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>cancel anytime</div>
              </div>
            </div>

            {/* FEATURE ROWS */}
            {features.map((f, i) => (
              <div key={i} style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 1fr 1fr",
                borderBottom: i < features.length - 1 ? "1px solid #F3F4F6" : "none",
              }}>
                <div style={{
                  padding: "12px 22px",
                  fontSize: 13,
                  color: "#374151",
                  display: "flex",
                  alignItems: "center",
                }}>
                  {f.name}
                </div>
                <div style={{
                  padding: "12px 18px",
                  borderLeft: "1px solid #F3F4F6",
                  background: isCurrent("free") ? "#FAFAFA" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Mark on={f.free} />
                </div>
                <div style={{
                  padding: "12px 18px",
                  borderLeft: "1px solid #F3F4F6",
                  background: isCurrent("premium") ? "#F5FAFF" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <Mark on={f.premium} />
                </div>
              </div>
            ))}

            {/* ACTION ROW */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1.6fr 1fr 1fr",
              borderTop: "1px solid #E5E7EB",
              background: "#FAFAFA",
            }}>
              <div style={{ padding: "16px 22px", fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center" }}>
                Cancel anytime — no long-term commitment
              </div>
              <div style={{ padding: "14px 14px", borderLeft: "1px solid #E5E7EB" }}>
                <Button
                  fullWidth
                  disabled={isCurrent("free")}
                  loading={actionLoading === "free"}
                  onClick={() => changePlan("free")}
                >
                  {isCurrent("free") ? "Current" : "Downgrade"}
                </Button>
              </div>
              <div style={{ padding: "14px 14px", borderLeft: "1px solid #E5E7EB" }}>
                <Button
                  fullWidth
                  primary
                  disabled={isCurrent("premium")}
                  loading={actionLoading === "premium"}
                  onClick={() => changePlan("premium")}
                >
                  {isCurrent("premium") ? "Current" : `Upgrade $${PRICE}/mo`}
                </Button>
              </div>
            </div>
          </div>
        </Layout.Section>

      </Layout>
    </Page>
  );
}
