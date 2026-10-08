/**
 * Meta (Facebook) Pixel Module
 * Handles official script injection, pixel initialization, and event tracking.
 */

let pixelInitialized = false;

/**
 * Initialize Meta Pixel container
 * Injects fbevents.js only once.
 */
export function initMetaPixel(pixelId?: string | null, debug = false): boolean {
  if (typeof window === "undefined" || !pixelId) return false;

  const cleanId = pixelId.trim();
  if (!cleanId || !/^\d+$/.test(cleanId)) {
    if (debug) console.warn("[Analytics] Invalid Meta Pixel ID format:", cleanId);
    return false;
  }

  if (pixelInitialized || document.getElementById("meta-pixel-script")) {
    if (debug) console.log("[Analytics] Meta Pixel already initialized with ID:", cleanId);
    return true;
  }

  // Official Meta Pixel bootstrap function
  if (!window.fbq) {
    const fbq: any = function (...args: any[]) {
      if (fbq.callMethod) {
        fbq.callMethod(...args);
      } else {
        fbq.queue.push(args);
      }
    };
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
  }

  // Inject Meta script tag
  const script = document.createElement("script");
  script.id = "meta-pixel-script";
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";

  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(script, firstScript);
  } else {
    document.head.appendChild(script);
  }

  // Initialize Pixel and send initial PageView
  window.fbq("init", cleanId);
  window.fbq("track", "PageView");

  pixelInitialized = true;
  if (debug) console.log("[Analytics] Meta Pixel initialized successfully:", cleanId);

  return true;
}

/**
 * Track a standard Meta Pixel event with optional eventID for CAPI deduplication
 */
export function trackMetaEvent(
  eventName: string,
  params?: Record<string, any>,
  options?: { eventID?: string },
  debug = false
): void {
  if (typeof window === "undefined" || !window.fbq) return;

  try {
    if (options && options.eventID) {
      window.fbq("track", eventName, params || {}, { eventID: options.eventID });
    } else {
      window.fbq("track", eventName, params || {});
    }

    if (debug) {
      console.groupCollapsed(`[Analytics: Meta Pixel] fbq('track', '${eventName}')`);
      console.log("Params:", params);
      console.log("Options (eventID):", options);
      console.groupEnd();
    }
  } catch (err) {
    if (debug) console.error("[Analytics: Meta Pixel Error]", err);
  }
}

/**
 * Track a custom Meta Pixel event
 */
export function trackMetaCustomEvent(
  eventName: string,
  params?: Record<string, any>,
  options?: { eventID?: string },
  debug = false
): void {
  if (typeof window === "undefined" || !window.fbq) return;

  try {
    if (options && options.eventID) {
      window.fbq("trackCustom", eventName, params || {}, { eventID: options.eventID });
    } else {
      window.fbq("trackCustom", eventName, params || {});
    }

    if (debug) {
      console.groupCollapsed(`[Analytics: Meta Custom] fbq('trackCustom', '${eventName}')`);
      console.log("Params:", params);
      console.groupEnd();
    }
  } catch (err) {
    if (debug) console.error("[Analytics: Meta Custom Error]", err);
  }
}
