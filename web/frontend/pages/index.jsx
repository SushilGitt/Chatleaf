// @ts-check
import React, { useState, useMemo } from "react";
import {
  Card,
  Page,
  Layout,
  Button,
  SkeletonBodyText,
  Banner,
  Stack,
} from "@shopify/polaris";
import { useAppQuery } from "../hooks";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [activateError, setActivateError] = useState(null);
  const navigate = useNavigate();

  const {
    data: subscriptionData,
    isLoading,
    isFetching,
  } = useAppQuery({ url: "/api/hasActiveSubscription" });

  const currentPlan = useMemo(() => {
    if (!subscriptionData) return "free";
    return subscriptionData.tier === "premium" ? "premium" : "free";
  }, [subscriptionData]);

  const isPlanLoading = isLoading || isFetching;

  const openThemeEditor = () => {
    setActivateError(null);
    // Resolve the shop synchronously (App Bridge v4 exposes it on
    // window.shopify) so window.open stays inside the click gesture —
    // awaiting a fetch first causes the browser to popup-block the new tab.
    const shop =
      window.shopify?.config?.shop ||
      new URLSearchParams(window.location.search).get("shop");
    if (!shop) {
      setActivateError("Could not determine shop URL.");
      return;
    }
    window.open(
      `https://${shop}/admin/themes/current/editor?context=apps`,
      "_blank"
    );
  };

  const steps = [
    { title: "Open editor", desc: "Launch theme editor" },
    { title: "Add block", desc: "Apps → Chatleaf" },
    { title: "Set number", desc: "Enter WhatsApp number" },
    { title: "Customize", desc: "Style & position" },
    { title: "Publish", desc: "Save — you're live" },
  ];

  const stats = [
    {
      label: "Plan",
      value: isPlanLoading ? "—" : (currentPlan === "premium" ? "Premium" : "Free"),
      hint: currentPlan === "premium" ? "All pages" : "Homepage only",
      accent: "#16A34A",
    },
    {
      label: "Status",
      value: "Active",
      hint: "Ready to install",
      accent: "#22C55E",
    },
    {
      label: "Pages",
      value: currentPlan === "premium" ? "All" : "Home",
      hint: currentPlan === "premium" ? "Full coverage" : "Upgrade for more",
      accent: "#F59E0B",
    },
  ];

  return (
    <Page>
      <Layout>

        {/* WELCOME BAR */}
        <Layout.Section>
          <div style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            padding: "18px 22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44,
                borderRadius: 10,
                background: "#ECFDF5",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#14532D", marginBottom: 2 }}>
                  Chatleaf Dashboard
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  One-tap WhatsApp chat for your storefront
                </div>
              </div>
            </div>
            <Button primary onClick={openThemeEditor}>Open Theme Editor</Button>
          </div>
        </Layout.Section>

        {/* STATS ROW */}
        <Layout.Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderLeft: `3px solid ${s.accent}`,
                borderRadius: 8,
                padding: "14px 16px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                  {s.label}
                </div>
                {isPlanLoading && i === 0 ? (
                  <SkeletonBodyText lines={1} />
                ) : (
                  <>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "#14532D", marginBottom: 2 }}>
                      {s.value}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280" }}>
                      {s.hint}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </Layout.Section>

        {/* SETUP STEPPER */}
        <Layout.Section>
          <Card sectioned>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#14532D" }}>Setup Steps</div>
              {currentPlan === "free" && (
                <Button size="slim" onClick={() => navigate("/pricing")}>Upgrade to Premium</Button>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative" }}>
              {/* Connecting line */}
              <div style={{
                position: "absolute",
                top: 14, left: "10%", right: "10%",
                height: 2,
                background: "#E5E7EB",
                zIndex: 0,
              }} />
              {steps.map((step, i) => (
                <div key={i} style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 1 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: "#16A34A", color: "#fff",
                    fontSize: 13, fontWeight: 700,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 8,
                    border: "3px solid #fff",
                  }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#14532D", marginBottom: 2 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", lineHeight: 1.4 }}>
                    {step.desc}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Layout.Section>

        {/* INFO + TIPS SPLIT */}
        <Layout.Section oneHalf>
          <Card sectioned>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#14532D", marginBottom: 14 }}>How It Works</div>
            <div>
              {[
                { title: "Install", desc: "Add the Chatleaf block to any theme via the Shopify theme editor." },
                { title: "Configure", desc: "Set your WhatsApp number, choose icon style, color, and position." },
                { title: "Go Live", desc: "Customers see the floating button and can message you with one tap." },
              ].map((item, i) => (
                <div key={i} style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: i < 2 ? "1px solid #F3F4F6" : "none",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: "#ECFDF5", color: "#16A34A",
                    fontSize: 12, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#14532D", marginBottom: 2 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section oneHalf>
          <Card sectioned>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#14532D", marginBottom: 14 }}>Best Practices</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {[
                "Include country code (e.g. 91, 1)",
                "Set a default greeting message",
                "Circle shape works best",
                "Position on the right side",
                "Upgrade for product/collection pages",
              ].map((tip, i) => (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "#374151",
                  padding: "8px 10px",
                  background: "#F9FAFB",
                  borderRadius: 6,
                }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {tip}
                </div>
              ))}
            </div>
          </Card>
        </Layout.Section>

        {activateError && (
          <Layout.Section>
            <Banner status="critical" onDismiss={() => setActivateError(null)}>
              {activateError}
            </Banner>
          </Layout.Section>
        )}

      </Layout>
    </Page>
  );
}
