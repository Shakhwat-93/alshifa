"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initAnalytics, trackPageView, AnalyticsConfig } from "@/lib/analytics";

interface AnalyticsProviderProps {
  initialConfig?: AnalyticsConfig;
  children?: React.ReactNode;
}

function RouteTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    trackPageView(url, document.title);
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsProvider({ initialConfig, children }: AnalyticsProviderProps) {
  useEffect(() => {
    // 1. Resolve configuration from props, env, and runtime settings
    const gtmId =
      initialConfig?.gtmId ||
      process.env.NEXT_PUBLIC_GTM_ID ||
      null;

    const ga4Id =
      initialConfig?.ga4Id ||
      process.env.NEXT_PUBLIC_GA4_ID ||
      null;

    const pixelId =
      initialConfig?.pixelId ||
      process.env.NEXT_PUBLIC_META_PIXEL_ID ||
      null;

    // Initialize with known environment/initial settings first
    initAnalytics({
      gtmId,
      ga4Id,
      pixelId,
      debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true",
    });

    // 2. Fetch runtime database settings if not already provided
    fetch(`/api/content?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const raw = data.raw_settings || {};
        const dynGtm = raw.tracking_gtm_id || gtmId;
        const dynGa4 = raw.tracking_ga4_id || ga4Id;
        const dynPixel = raw.tracking_fb_pixel_id || pixelId;

        if (dynGtm || dynGa4 || dynPixel) {
          initAnalytics({
            gtmId: dynGtm,
            ga4Id: dynGa4,
            pixelId: dynPixel,
            debug: process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true",
          });
        }
      })
      .catch(() => {});
  }, [initialConfig]);

  const activeGtmId =
    initialConfig?.gtmId ||
    process.env.NEXT_PUBLIC_GTM_ID ||
    null;

  return (
    <>
      <Suspense fallback={null}>
        <RouteTracker />
      </Suspense>

      {/* GTM NoScript Fallback */}
      {activeGtmId && activeGtmId.startsWith("GTM-") && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${activeGtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      )}

      {children}
    </>
  );
}
