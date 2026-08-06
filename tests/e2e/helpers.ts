import type { Page } from '@playwright/test';

/** Catalogue cache: catalogue codes only, 30-minute expiry. */
export const STORAGE_KEY = 'destiny2-codes-cache-v2';
/** User-submitted codes: never expires, merge-only writes. */
export const MANUAL_STORAGE_KEY = 'destiny2-manual-codes';
/** Pre-schemaVersion cache, migrated and purged on read. */
export const LEGACY_STORAGE_KEY = 'destiny2-codes-cache';

/**
 * Bungie codes use a reduced charset (no B, E, I, O, S, U, Z, 0, 1, 2, 5, 8),
 * and the Add Code form rejects anything outside it. Test codes must be valid
 * or the submit button stays disabled.
 */
export const VALID_CODE_A = 'ACD-FGH-JKL';
export const VALID_CODE_B = 'MNP-RTV-XY3';

export function manualEntry(code: string, id = `manual-${Date.now()}`) {
  return {
    id,
    code,
    status: 'unknown',
    source: 'User Submitted',
    foundAt: new Date().toISOString(),
    description: 'Manually added code',
  };
}

export function catalogueEntry(code: string, id = 'code-0') {
  return {
    id,
    code,
    status: 'active',
    source: 'Bungie',
    foundAt: new Date().toISOString(),
  };
}

/**
 * Makes every write to the manual-codes key (including its quarantine slots)
 * throw, simulating a full localStorage. Must be installed via addInitScript:
 * patching after goto() is too late, the app has already run.
 */
export function blockManualWrites() {
  const realSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    if (key.startsWith('destiny2-manual-codes')) {
      throw new DOMException('quota', 'QuotaExceededError');
    }
    return realSetItem.call(this, key, value);
  };
}

/**
 * Blocks only the quarantine slots, so a test can still seed the manual key
 * and then observe what happens when that payload cannot be set aside.
 */
export function blockQuarantineWrites() {
  const realSetItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function (key: string, value: string) {
    if (key.includes('-corrupt')) {
      throw new DOMException('quota', 'QuotaExceededError');
    }
    return realSetItem.call(this, key, value);
  };
}

/** Denies localStorage at the property level, as privacy modes do. */
export function blockAllStorage() {
  Object.defineProperty(window, 'localStorage', {
    get() {
      throw new DOMException('blocked', 'SecurityError');
    },
    configurable: true,
  });
}

/** Adds a code through the real UI, so validation and toasts are exercised. */
export async function addCodeViaUi(page: Page, code: string) {
  await page.locator('header button:has-text("Add")').first().click();
  await page.locator('[role="dialog"] input').first().fill(code);
  await page.locator('[role="dialog"] button[type="submit"]').first().click();
  await page.waitForTimeout(900);
}

export async function forceRefresh(page: Page) {
  const button = page.locator('button:has-text("Refresh")').first();
  if (await button.count()) {
    await button.click();
    await page.waitForTimeout(3000);
  }
}

/** Copy buttons are the most reliable proxy for "the catalogue rendered". */
export async function copyButtonCount(page: Page) {
  return page.locator('button:has-text("Copy")').count();
}

export async function bodyText(page: Page) {
  return page.evaluate(() => document.body.innerText);
}

export async function readKey(page: Page, key: string) {
  return page.evaluate(k => localStorage.getItem(k), key);
}

/** Every code card carries this attribute; far more precise than button text. */
export const CARD = '[data-code-card]';

function relativeLuminance([r, g, b]: number[]) {
  const channel = (value: number) => {
    const s = value / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(foreground: number[], background: number[]) {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

export function parseRgb(value: string): number[] | null {
  const match = value.match(/rgba?\(([^)]+)\)/);
  if (!match) return null;
  const parts = match[1].split(',').map(part => parseFloat(part.trim()));
  return [parts[0], parts[1], parts[2]];
}
