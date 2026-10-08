import { AnalyticsConfig, AnalyticsLogEntry, TrackEventOptions } from "./types";
import { isEventDuplicate } from "./deduplication";
import { initGTM, pushToDataLayer } from "./gtm";
import { initMetaPixel, trackMetaEvent } from "./metaPixel";
import { initGA4 } from "./ga4";

let activeConfig: AnalyticsConfig = {};
let isInitialized = false;
const logs: AnalyticsLogEntry[] = [];

/**
 * Check if analytics debug mode is active
 */
export function isDebugActive(): boolean {
  if (typeof window === "undefined") return false;

  if (window.__ANALYTICS_DEBUG__ !== undefined) {
    return !!window.__ANALYTICS_DEBUG__;
  }

  if (activeConfig.debug) return true;

  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true") return true;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("debug_analytics") === "1" || urlParams.get("analytics_debug") === "true") {
      return true;
    }
  } catch {}

  return false;
}

/**
 * Log an event to internal debug registry and browser console
 */
function logAnalytics(entry: AnalyticsLogEntry): void {
  logs.push(entry);
  if (logs.length > 100) logs.shift();

  if (typeof window !== "undefined") {
    window.__ANALYTICS_LOGS__ = logs;
  }

  if (isDebugActive()) {
    const color =
      entry.destination === "dedup_blocked"
        ? "#e11d48" // Rose red for blocked
        : "#059669"; // Emerald green for sent

    console.groupCollapsed(
      `%c[Analytics] ${entry.eventName} (%c${entry.destination}%c)`,
      `color: ${color}; font-weight: bold;`,
      "color: #2563eb; font-weight: bold;",
      "color: inherit; font-weight: normal;"
    );
    console.log("Timestamp:", entry.timestamp);
    console.log("Payload:", entry.payload);
    if (entry.eventId) console.log("Event ID:", entry.eventId);
    console.groupEnd();
  }
}

/**
 * Initialize all analytics engines (Singleton: Guaranteed single initialization)
 */
export function initAnalytics(config: AnalyticsConfig): void {
  if (typeof window === "undefined") return;

  if (isInitialized || window.__ANALYTICS_INITIALIZED__) {
    // Already initialized
    return;
  }

  activeConfig = { ...config };

  // 1. Initialize Google Tag Manager (Primary dataLayer architecture)
  if (config.gtmId) {
    initGTM(config.gtmId, isDebugActive());
  }

  // 2. Direct GA4 fallback if GTM is not present
  if (config.ga4Id && !config.gtmId) {
    initGA4(config.ga4Id, isDebugActive());
  }

  // 3. Initialize Meta Pixel
  if (config.pixelId) {
    initMetaPixel(config.pixelId, isDebugActive());
  }

  isInitialized = true;
  window.__ANALYTICS_INITIALIZED__ = true;
  window.__ANALYTICS_CONFIG__ = activeConfig;
  window.__ANALYTICS_LOGS__ = logs;

  // Expose global debug controls
  window.__ANALYTICS__ = {
    trackEvent,
    trackPageView,
    getLogs: () => [...logs],
  };

  if (isDebugActive()) {
    console.log("%c[Analytics System Ready]", "background: #059669; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;", {
      gtm: config.gtmId || "Disabled",
      ga4: config.ga4Id || "Disabled",
      pixel: config.pixelId || "Disabled",
    });
  }
}

/**
 * Universal Track Event
 * Routes events to GTM/GA4 and Meta Pixel with deduplication protection.
 */
export function trackEvent(
  eventName: string,
  params: Record<string, any> = {},
  options: TrackEventOptions = {}
): void {
  if (typeof window === "undefined" || !eventName) return;

  const dedupKey = options.dedupKey || `${eventName}_${JSON.stringify(params)}`;
  const dedupTtl = options.dedupTtlMs ?? 500;

  // 1. Check Deduplication
  if (isEventDuplicate(dedupKey, dedupTtl)) {
    logAnalytics({
      timestamp: new Date().toISOString(),
      eventName,
      payload: params,
      destination: "dedup_blocked",
      eventId: options.eventId,
    });
    return; // Block duplicate
  }

  const debug = isDebugActive();

  // 2. Dispatch to GTM / dataLayer (GA4)
  if (!options.skipDataLayer) {
    pushToDataLayer(
      {
        event: eventName,
        event_id: options.eventId,
        ...params,
      },
      debug
    );
  }

  // 3. Log event
  logAnalytics({
    timestamp: new Date().toISOString(),
    eventName,
    payload: params,
    destination: !options.skipPixel ? "both" : "dataLayer",
    eventId: options.eventId,
  });
}

/**
 * Track SPA Route change / PageView
 */
export function trackPageView(url?: string, title?: string): void {
  if (typeof window === "undefined") return;

  const pageUrl = url || window.location.href;
  const pageTitle = title || document.title;
  const dedupKey = `page_view_${pageUrl}`;

  // Throttle page views within 400ms (prevents double mounts)
  if (isEventDuplicate(dedupKey, 400)) {
    return;
  }

  const debug = isDebugActive();

  // 1. dataLayer / GTM PageView
  pushToDataLayer(
    {
      event: "page_view",
      page_location: pageUrl,
      page_title: pageTitle,
      page_path: window.location.pathname,
    },
    debug
  );

  // 2. Meta Pixel PageView
  trackMetaEvent("PageView", {
    page_location: pageUrl,
    page_title: pageTitle,
  }, undefined, debug);

  logAnalytics({
    timestamp: new Date().toISOString(),
    eventName: "page_view",
    payload: { pageUrl, pageTitle },
    destination: "both",
  });
}
