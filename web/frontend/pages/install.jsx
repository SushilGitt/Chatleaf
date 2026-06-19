// @ts-check
import React, { useState, useCallback } from "react";
import {
  Card,
  Page,
  Layout,
  Button,
  Modal,
  Frame,
  TopBar,
  Stack,
} from "@shopify/polaris";
import { useNavigate } from "react-router-dom";

export default function Installation() {
  const [active, setActive] = useState(false);
  const handleChange = useCallback(() => setActive(!active), [active]);
  const navigate = useNavigate();

  const steps = [
    {
      title: "Open Theme Editor",
      desc: "Go to Shopify admin → Online Store → Themes → Customize. Or click the button on the dashboard.",
    },
    {
      title: "Add the Chatleaf Block",
      desc: "In the theme editor, click Add block → Apps → Chatleaf WhatsApp Button.",
    },
    {
      title: "Configure Your Number",
      desc: "Enter your WhatsApp phone number with country code (e.g. 911234567890). Optionally set a default message.",
    },
    {
      title: "Customize Appearance",
      desc: "Choose icon style (Official, Bubble, or Minimal), set color, shape (circle/rounded/square), and position.",
    },
    {
      title: "Save & Publish",
      desc: "Click Save in the theme editor. Your WhatsApp button is now live on your store.",
    },
  ];

  return (
    <Frame topBar={<TopBar />}>
      <Page>
        <Layout>

          {/* HEADER STRIP */}
          <Layout.Section>
            <div style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderTop: "3px solid #16A34A",
              borderRadius: 8,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#16A34A", textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 4 }}>
                  Setup Guide
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#14532D", marginBottom: 2 }}>
                  Installation Walkthrough
                </div>
                <div style={{ fontSize: 13, color: "#6B7280" }}>
                  Five quick steps to get Chatleaf running on your store
                </div>
              </div>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#F0FDF4",
                color: "#166534",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
                Under 2 minutes
              </div>
            </div>
          </Layout.Section>

          {/* TIMELINE STEPS */}
          <Layout.Section>
            <Card sectioned>
              <div style={{ position: "relative", paddingLeft: 24 }}>
                {/* Vertical timeline line */}
                <div style={{
                  position: "absolute",
                  left: 11,
                  top: 12,
                  bottom: 12,
                  width: 2,
                  background: "#E5E7EB",
                }} />

                {steps.map((step, i) => (
                  <div key={i} style={{
                    position: "relative",
                    paddingBottom: i === steps.length - 1 ? 0 : 22,
                    paddingLeft: 22,
                  }}>
                    {/* Numbered marker */}
                    <div style={{
                      position: "absolute",
                      left: -25,
                      top: 0,
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "#16A34A",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "3px solid #fff",
                      boxShadow: "0 0 0 2px #16A34A",
                    }}>
                      {i + 1}
                    </div>

                    <div style={{ fontSize: 15, fontWeight: 700, color: "#14532D", marginBottom: 4 }}>
                      {step.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Layout.Section>

          {/* PREMIUM PAGE COVERAGE — TABLE STYLE */}
          <Layout.Section>
            <Card sectioned>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#14532D", marginBottom: 2 }}>
                    Page Coverage
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280" }}>
                    Where the WhatsApp button can appear on your store
                  </div>
                </div>
                <Button onClick={() => navigate("/pricing")}>View Plans</Button>
              </div>

              <div style={{ border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 1fr",
                  background: "#F9FAFB",
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                  padding: "10px 16px",
                  borderBottom: "1px solid #E5E7EB",
                }}>
                  <div>Page Type</div>
                  <div style={{ textAlign: "center" }}>Free</div>
                  <div style={{ textAlign: "center" }}>Premium</div>
                </div>
                {[
                  { name: "Homepage", free: true, premium: true },
                  { name: "Product pages", free: false, premium: true },
                  { name: "Collection pages", free: false, premium: true },
                  { name: "All other pages", free: false, premium: true },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1fr 1fr",
                    padding: "12px 16px",
                    fontSize: 13,
                    color: "#374151",
                    borderBottom: i < 3 ? "1px solid #F3F4F6" : "none",
                    alignItems: "center",
                  }}>
                    <div>{row.name}</div>
                    <div style={{ textAlign: "center" }}>
                      {row.free ? (
                        <span style={{ color: "#22C55E", fontWeight: 700 }}>✓</span>
                      ) : (
                        <span style={{ color: "#D1D5DB" }}>—</span>
                      )}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      {row.premium ? (
                        <span style={{ color: "#22C55E", fontWeight: 700 }}>✓</span>
                      ) : (
                        <span style={{ color: "#D1D5DB" }}>—</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Layout.Section>

          {/* Video Modal */}
          <Modal
            open={active}
            onClose={handleChange}
            title="Quick Setup Guide"
          >
            <Modal.Section>
              <div style={{ padding: "56% 0 0 0", position: "relative" }}>
                <iframe
                  src="https://cdn.shopify.com/videos/c/o/v/879c7b0f313e4e858abc5c16733670d3.mp4?portrait=0&loop=1&title=0&byline=0&sidedock=0&h=881b23983c&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  title="Quick Setup"
                />
              </div>
            </Modal.Section>
          </Modal>

        </Layout>
      </Page>
    </Frame>
  );
}
