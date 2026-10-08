export interface AnalyticsConfig {
  gtmId?: string | null;
  ga4Id?: string | null;
  pixelId?: string | null;
  debug?: boolean;
}

export interface EcommerceItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_brand?: string;
  item_category?: string;
  item_variant?: string;
}

export interface EcommercePayload {
  currency: string;
  value: number;
  items: EcommerceItem[];
  transaction_id?: string;
  coupon?: string;
  shipping?: number;
  tax?: number;
}

export interface TrackEventOptions {
  dedupKey?: string;
  dedupTtlMs?: number;
  eventId?: string;
  skipPixel?: boolean;
  skipDataLayer?: boolean;
}

export interface AnalyticsLogEntry {
  timestamp: string;
  eventName: string;
  payload: any;
  destination: "dataLayer" | "metaPixel" | "both" | "dedup_blocked";
  eventId?: string;
}

declare global {
  interface Window {
    dataLayer?: any[];
    fbq?: any;
    _fbq?: any;
    gtag?: (...args: any[]) => void;
    __ANALYTICS_INITIALIZED__?: boolean;
    __ANALYTICS_CONFIG__?: AnalyticsConfig;
    __ANALYTICS_DEBUG__?: boolean;
    __ANALYTICS_LOGS__?: AnalyticsLogEntry[];
    __ANALYTICS__?: {
      trackEvent: (eventName: string, params?: Record<string, any>, options?: TrackEventOptions) => void;
      trackPageView: (url?: string, title?: string) => void;
      getLogs: () => AnalyticsLogEntry[];
    };
  }
}
