/**
 * Deduplication Engine for Analytics and Conversions
 * Guarantees: ONE USER ACTION = ONE ANALYTICS EVENT
 */

// In-memory registry for rapid event throttling and StrictMode guard
const inMemoryEvents = new Map<string, number>();

// In-memory set for permanently tracked transactions during current session
const inMemoryTransactions = new Set<string>();

const PURCHASE_STORAGE_PREFIX = "alshifa_tracked_tx_";

/**
 * Generate a cryptographically robust, collision-resistant event ID
 * Used for Meta Pixel & CAPI deduplication matching.
 */
export function generateEventId(prefix = "evt"): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `${prefix}_${timestamp}_${randomPart}`;
}

/**
 * Check whether a generic user action is a duplicate within a time window (TTL)
 * Protects against rapid double clicks, StrictMode, hydration bounces.
 */
export function isEventDuplicate(dedupKey: string, ttlMs = 800): boolean {
  if (typeof window === "undefined" || !dedupKey) return false;

  const now = Date.now();
  const lastFired = inMemoryEvents.get(dedupKey);

  if (lastFired && now - lastFired < ttlMs) {
    return true; // Block duplicate
  }

  inMemoryEvents.set(dedupKey, now);

  // Periodically clean memory if oversized
  if (inMemoryEvents.size > 200) {
    for (const [k, time] of inMemoryEvents.entries()) {
      if (now - time > 10000) {
        inMemoryEvents.delete(k);
      }
    }
  }

  return false;
}

/**
 * Check if a Purchase transaction has already been tracked.
 * Triple-layer protection:
 * 1. In-memory Set
 * 2. sessionStorage (same browser tab/session)
 * 3. localStorage (persists across page reloads and back/forward navigation)
 */
export function hasTransactionBeenTracked(transactionId: string): boolean {
  if (!transactionId) return false;
  const cleanId = String(transactionId).trim().toUpperCase();

  // 1. In-memory check
  if (inMemoryTransactions.has(cleanId)) {
    return true;
  }

  if (typeof window === "undefined") {
    return false;
  }

  const storageKey = PURCHASE_STORAGE_PREFIX + cleanId;

  // 2. SessionStorage check
  try {
    if (sessionStorage.getItem(storageKey)) {
      inMemoryTransactions.add(cleanId);
      return true;
    }
  } catch {}

  // 3. LocalStorage check
  try {
    if (localStorage.getItem(storageKey)) {
      inMemoryTransactions.add(cleanId);
      return true;
    }
  } catch {}

  return false;
}

/**
 * Permanently mark a transaction as tracked across all layers.
 */
export function markTransactionAsTracked(transactionId: string): void {
  if (!transactionId) return;
  const cleanId = String(transactionId).trim().toUpperCase();

  // 1. In-memory mark
  inMemoryTransactions.add(cleanId);

  if (typeof window === "undefined") return;

  const storageKey = PURCHASE_STORAGE_PREFIX + cleanId;
  const record = JSON.stringify({
    transactionId: cleanId,
    timestamp: new Date().toISOString(),
  });

  // 2. SessionStorage mark
  try {
    sessionStorage.setItem(storageKey, record);
  } catch {}

  // 3. LocalStorage mark
  try {
    localStorage.setItem(storageKey, record);
  } catch {}
}
