/**
 * Google Tag Manager (GTM) Module
 * Handles single injection, dataLayer initialization, and event pushing.
 */

let gtmInitialized = false;

/**
 * Initialize Google Tag Manager container
 * Ensures script is injected only once.
 */
export function initGTM(gtmId?: string | null, debug = false): boolean {
  if (typeof window === "undefined" || !gtmId) return false;

  const cleanId = gtmId.trim();
  if (!cleanId || !cleanId.startsWith("GTM-")) {
    if (debug) console.warn("[Analytics] Invalid GTM ID format:", cleanId);
    return false;
  }

  // Ensure dataLayer array exists
  window.dataLayer = window.dataLayer || [];

  if (gtmInitialized || document.getElementById("gtm-script")) {
    if (debug) console.log("[Analytics] GTM already initialized with ID:", cleanId);
    return true;
  }

  // Push gtm.start event
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  // Inject GTM script tag
  const script = document.createElement("script");
  script.id = "gtm-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${cleanId}`;

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  gtmInitialized = true;
  if (debug) console.log("[Analytics] GTM initialized successfully:", cleanId);

  return true;
}

/**
 * Push an event payload to window.dataLayer safely
 */
export function pushToDataLayer(payload: Record<string, any>, debug = false): void {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (debug) {
    console.groupCollapsed(`[Analytics: GTM] dataLayer.push: ${payload.event || "unknown_event"}`);
    console.log(payload);
    console.groupEnd();
  }
}
