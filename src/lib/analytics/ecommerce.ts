/**
 * Standard eCommerce Events for GA4 and Meta Pixel
 * Strict adherence to Google & Meta standard eCommerce schemas.
 */

import { EcommerceItem, EcommercePayload } from "./types";
import { trackEvent, isDebugActive } from "./analytics";
import { trackMetaEvent } from "./metaPixel";
import {
  generateEventId,
  hasTransactionBeenTracked,
  markTransactionAsTracked,
} from "./deduplication";

/**
 * 1. Product View (view_item / ViewContent)
 */
export function trackViewItem(item: EcommerceItem, currency = "BDT"): void {
  const eventId = generateEventId("vi");

  // GA4 view_item
  trackEvent(
    "view_item",
    {
      ecommerce: {
        currency,
        value: item.price,
        items: [
          {
            item_id: item.item_id,
            item_name: item.item_name,
            price: item.price,
            quantity: 1,
            item_brand: item.item_brand || "Al-Shifa Care",
            item_category: item.item_category || "Health & Beauty",
          },
        ],
      },
    },
    {
      dedupKey: `view_item_${item.item_id}`,
      dedupTtlMs: 2000,
      eventId,
    }
  );

  // Meta ViewContent
  trackMetaEvent(
    "ViewContent",
    {
      content_ids: [item.item_id],
      content_name: item.item_name,
      content_type: "product",
      value: item.price,
      currency,
    },
    { eventID: eventId },
    isDebugActive()
  );
}

/**
 * 2. Add To Cart (add_to_cart / AddToCart)
 */
export function trackAddToCart(item: EcommerceItem, currency = "BDT"): void {
  const qty = item.quantity || 1;
  const totalValue = item.price * qty;
  const eventId = generateEventId("atc");

  // GA4 add_to_cart
  trackEvent(
    "add_to_cart",
    {
      ecommerce: {
        currency,
        value: totalValue,
        items: [
          {
            item_id: item.item_id,
            item_name: item.item_name,
            price: item.price,
            quantity: qty,
            item_brand: item.item_brand || "Al-Shifa Care",
            item_category: item.item_category || "Health & Beauty",
          },
        ],
      },
    },
    {
      dedupKey: `add_to_cart_${item.item_id}_${qty}`,
      dedupTtlMs: 800,
      eventId,
    }
  );

  // Meta AddToCart
  trackMetaEvent(
    "AddToCart",
    {
      content_ids: [item.item_id],
      content_name: item.item_name,
      content_type: "product",
      value: totalValue,
      currency,
    },
    { eventID: eventId },
    isDebugActive()
  );
}

/**
 * 3. Begin Checkout (begin_checkout / InitiateCheckout)
 */
export function trackBeginCheckout(payload: EcommercePayload): void {
  const eventId = generateEventId("ic");

  // GA4 begin_checkout
  trackEvent(
    "begin_checkout",
    {
      ecommerce: {
        currency: payload.currency || "BDT",
        value: payload.value,
        items: payload.items.map((item) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          price: item.price,
          quantity: item.quantity || 1,
          item_brand: item.item_brand || "Al-Shifa Care",
          item_category: item.item_category || "Health & Beauty",
        })),
      },
    },
    {
      dedupKey: `begin_checkout_${payload.value}`,
      dedupTtlMs: 2500,
      eventId,
    }
  );

  // Meta InitiateCheckout
  trackMetaEvent(
    "InitiateCheckout",
    {
      content_ids: payload.items.map((i) => i.item_id),
      content_name: payload.items[0]?.item_name || "Al-Shifa Care",
      content_type: "product",
      num_items: payload.items.reduce((acc, i) => acc + (i.quantity || 1), 0),
      value: payload.value,
      currency: payload.currency || "BDT",
    },
    { eventID: eventId },
    isDebugActive()
  );
}

/**
 * 4. Purchase (purchase / Purchase)
 * HIGHEST PRIORITY: DEDUPLICATION GUARANTEED
 * Never fires twice for the same transaction_id.
 */
export function trackPurchase(payload: EcommercePayload & { transaction_id: string }): boolean {
  if (!payload.transaction_id) {
    console.error("[Analytics] Cannot track Purchase without transaction_id");
    return false;
  }

  const txId = String(payload.transaction_id).trim();

  // 1. Triple-layer Deduplication Check
  if (hasTransactionBeenTracked(txId)) {
    if (isDebugActive()) {
      console.warn(`[Analytics Deduplication] BLOCKED duplicate Purchase event for transaction: ${txId}`);
    }
    return false;
  }

  // 2. Mark immediately as tracked (atomic guard)
  markTransactionAsTracked(txId);

  // 3. Generate deterministic Event ID for CAPI matching
  const eventId = `pur_${txId}`;
  const debug = isDebugActive();

  // 4. GA4 purchase event via dataLayer
  trackEvent(
    "purchase",
    {
      ecommerce: {
        transaction_id: txId,
        value: payload.value,
        currency: payload.currency || "BDT",
        shipping: payload.shipping || 0,
        tax: payload.tax || 0,
        coupon: payload.coupon || undefined,
        items: payload.items.map((item) => ({
          item_id: item.item_id,
          item_name: item.item_name,
          price: item.price,
          quantity: item.quantity || 1,
          item_brand: item.item_brand || "Al-Shifa Care",
          item_category: item.item_category || "Health & Beauty",
        })),
      },
    },
    {
      dedupKey: `purchase_${txId}`,
      eventId,
    }
  );

  // 5. Meta Pixel Purchase event
  trackMetaEvent(
    "Purchase",
    {
      content_name: payload.items[0]?.item_name || "Al-Shifa Care",
      content_ids: payload.items.map((i) => i.item_id),
      content_type: "product",
      num_items: payload.items.reduce((acc, i) => acc + (i.quantity || 1), 0),
      value: payload.value,
      currency: payload.currency || "BDT",
    },
    { eventID: eventId },
    debug
  );

  if (debug) {
    console.log(`%c[Analytics] Purchase Tracked Successfully! ID: ${txId}`, "background: #059669; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;");
  }

  return true;
}

/**
 * 5. Track Support Contact / Call Link
 */
export function trackContact(channel: "phone" | "whatsapp", destination?: string): void {
  const eventId = generateEventId("contact");

  trackEvent(
    "contact_click",
    {
      channel,
      destination: destination || "",
    },
    {
      dedupKey: `contact_${channel}`,
      dedupTtlMs: 2000,
      eventId,
    }
  );

  trackMetaEvent(
    "Contact",
    {
      channel,
    },
    { eventID: eventId },
    isDebugActive()
  );
}
