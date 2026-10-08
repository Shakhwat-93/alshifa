/**
 * Google Analytics 4 (GA4) Direct Fallback Module
 * Note: If GTM is present, dataLayer events automatically power GA4.
 * This module is activated when a direct GA4 Measurement ID (G-XXXXXXXX) is provided without GTM.
 */

let ga4Initialized = false;

export function initGA4(ga4Id?: string | null, debug = false): boolean {
  if (typeof window === "undefined" || !ga4Id) return false;

  const cleanId = ga4Id.trim();
  if (!cleanId || !cleanId.startsWith("G-")) {
    if (debug) console.warn("[Analytics] Invalid GA4 ID format:", cleanId);
    return false;
  }

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];

  if (ga4Initialized || document.getElementById("ga4-script")) {
    if (debug) console.log("[Analytics] GA4 already initialized with ID:", cleanId);
    return true;
  }

  // Define gtag wrapper
  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer?.push(arguments);
    };
  }

  window.gtag("js", new Date());
  window.gtag("config", cleanId, {
    send_page_view: false, // Page views managed via centralized SPA tracker
  });

  // Inject gtag.js script
  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  ga4Initialized = true;
  if (debug) console.log("[Analytics] Direct GA4 initialized successfully:", cleanId);

  return true;
}
