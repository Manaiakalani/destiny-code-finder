import { test, expect } from '@playwright/test';
import {
  CARD,
  LEGACY_STORAGE_KEY,
  MANUAL_STORAGE_KEY,
  STORAGE_KEY,
  VALID_CODE_A,
  bodyText,
  blockQuarantineWrites,
  catalogueEntry,
  forceRefresh,
  manualEntry,
  readKey,
} from './helpers';

/**
 * User-submitted codes are the only unrecoverable data in the app: the
 * catalogue can always be rebuilt from the bundle, a code someone typed in
 * cannot. Every test here encodes one way an earlier build lost them.
 */
test.describe('manual code migration', () => {
  test('rescues manual codes out of a v1 cache, then purges the key', async ({ page }) => {
    await page.goto('');
    await page.evaluate(
      ([key, manual, catalogue]) => {
        localStorage.clear();
        localStorage.setItem(
          key as string,
          JSON.stringify({ codes: [manual, catalogue], timestamp: Date.now() })
        );
      },
      [LEGACY_STORAGE_KEY, manualEntry(VALID_CODE_A, 'manual-1700000000000'), catalogueEntry('XYZ-XYZ-XYZ')] as const
    );

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // The v1 payload predates schemaVersion, so it always fails validation.
    // Deleting it outright is what destroyed user codes on upgrade.
    expect(await bodyText(page)).toContain(VALID_CODE_A);
    expect(await readKey(page, LEGACY_STORAGE_KEY)).toBeNull();
    expect(await readKey(page, MANUAL_STORAGE_KEY)).toContain(VALID_CODE_A);
  });

  test('keeps the catalogue cache free of manual codes', async ({ page }) => {
    await page.goto('');
    await page.evaluate(
      ([key, manual, catalogue]) => {
        localStorage.clear();
        localStorage.setItem(
          key as string,
          JSON.stringify({ codes: [manual, catalogue], timestamp: Date.now() })
        );
      },
      [LEGACY_STORAGE_KEY, manualEntry(VALID_CODE_A, 'manual-1700000000000'), catalogueEntry('XYZ-XYZ-XYZ')] as const
    );
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    const inlineManual = await page.evaluate(key => {
      const raw = localStorage.getItem(key);
      if (!raw) return -1;
      return JSON.parse(raw).codes.filter((c: { id?: string }) => String(c.id).startsWith('manual-')).length;
    }, STORAGE_KEY);

    expect(inlineManual).toBe(0);
  });

  test('manual codes outlive cache expiry and cache corruption', async ({ page }) => {
    await page.goto('');
    await page.evaluate(
      ([key, manual, catalogue]) => {
        localStorage.clear();
        localStorage.setItem(
          key as string,
          JSON.stringify({ codes: [manual, catalogue], timestamp: Date.now() })
        );
      },
      [LEGACY_STORAGE_KEY, manualEntry(VALID_CODE_A, 'manual-1700000000000'), catalogueEntry('XYZ-XYZ-XYZ')] as const
    );
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Age the catalogue cache past its 30-minute window.
    await page.evaluate(key => {
      const cache = JSON.parse(localStorage.getItem(key)!);
      cache.timestamp = Date.now() - 6 * 60 * 60 * 1000;
      localStorage.setItem(key, JSON.stringify(cache));
    }, STORAGE_KEY);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    expect(await bodyText(page)).toContain(VALID_CODE_A);

    // Now corrupt it outright.
    await page.evaluate(key => localStorage.setItem(key, '{{{nope'), STORAGE_KEY);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    expect(await bodyText(page)).toContain(VALID_CODE_A);
    await expect(page.locator(CARD)).not.toHaveCount(0);

    const occurrences = (await bodyText(page)).split(VALID_CODE_A).length - 1;
    expect(occurrences, 'manual code should not be duplicated').toBe(1);
  });

  test('a code migrated during a force refresh appears immediately', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);

    // A force refresh never reads the cache, so migration happens on write.
    // Before this was fixed the code stayed hidden until the next page load.
    await page.evaluate(
      ([key, manual, catalogue]) => {
        localStorage.removeItem('destiny2-manual-codes');
        localStorage.setItem(
          key as string,
          JSON.stringify({ schemaVersion: 2, timestamp: Date.now(), codes: [manual, catalogue] })
        );
      },
      [STORAGE_KEY, manualEntry(VALID_CODE_A, 'manual-1700000000000'), catalogueEntry('XYZ-XYZ-XYZ')] as const
    );

    await forceRefresh(page);
    expect(await bodyText(page)).toContain(VALID_CODE_A);
  });
});

test.describe('corrupt payload quarantine', () => {
  test('sets a corrupt catalogue cache aside rather than overwriting it', async ({ page }) => {
    await page.goto('');
    await page.evaluate(
      ([key, code]) => {
        localStorage.clear();
        // Truncated mid-entry: unparseable, but the code is still in there.
        localStorage.setItem(
          key as string,
          `{"schemaVersion":2,"timestamp":1,"codes":[{"id":"manual-1","code":"${code}"`
        );
      },
      [STORAGE_KEY, VALID_CODE_A] as const
    );

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    const quarantined = await page.evaluate(
      key => Object.keys(localStorage).filter(k => k.startsWith(`${key}-corrupt`)).length,
      STORAGE_KEY
    );
    expect(quarantined).toBeGreaterThan(0);
    await expect(page.locator(CARD)).not.toHaveCount(0);
  });

  test('leaves a corrupt manual payload intact when it cannot be quarantined', async ({ page }) => {
    // Only the quarantine slot is blocked, so the seed below still lands.
    await page.addInitScript(blockQuarantineWrites);
    await page.goto('');
    await page.evaluate(
      ([key, code]) => {
        localStorage.clear();
        localStorage.setItem(key as string, `{{{corrupt-but-holds ${code}`);
      },
      [MANUAL_STORAGE_KEY, VALID_CODE_A] as const
    );

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    // Nothing may delete the only surviving copy of a user code.
    expect(await readKey(page, MANUAL_STORAGE_KEY)).toContain(VALID_CODE_A);
    await expect(page.locator(CARD)).not.toHaveCount(0);
  });
});
