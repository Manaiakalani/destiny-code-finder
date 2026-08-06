import { test, expect } from '@playwright/test';
import {
  CARD,
  MANUAL_STORAGE_KEY,
  STORAGE_KEY,
  VALID_CODE_A,
  VALID_CODE_B,
  addCodeViaUi,
  blockAllStorage,
  blockManualWrites,
  bodyText,
  catalogueEntry,
  forceRefresh,
  manualEntry,
  readKey,
} from './helpers';

test.describe('storage resilience', () => {
  test('renders normally when localStorage is denied outright', async ({ page }) => {
    // The third-party analytics script throws its own error under this
    // condition; block it so the assertion is about our code.
    await page.route('**/analytics.manaiakalani.info/**', route => route.abort());
    await page.addInitScript(blockAllStorage);

    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));

    await page.goto('');
    await page.waitForSelector(CARD);
    await page.waitForTimeout(2000);

    await expect(page.locator(CARD)).not.toHaveCount(0);
    await expect(page.getByText('This page failed to load')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('a second corruption does not clobber the first quarantine', async ({ page }) => {
    await page.goto('');
    await page.evaluate(
      ([key, code]) => {
        localStorage.clear();
        localStorage.setItem(key as string, `{{{first ${code}`);
      },
      [MANUAL_STORAGE_KEY, VALID_CODE_A] as const
    );
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    await page.evaluate(
      ([key, code]) => localStorage.setItem(key as string, `{{{second ${code}`),
      [MANUAL_STORAGE_KEY, VALID_CODE_B] as const
    );
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Reusing one `-corrupt` slot would destroy the first payload, which is
    // the exact loss quarantining exists to prevent.
    const quarantined = await page.evaluate(() =>
      Object.keys(localStorage)
        .filter(key => key.includes('-corrupt'))
        .map(key => localStorage.getItem(key))
        .join('||')
    );

    expect(quarantined).toContain(VALID_CODE_A);
    expect(quarantined).toContain(VALID_CODE_B);
  });
});

test.describe('failed persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(blockManualWrites);
  });

  test('tells the user when a code could not be saved', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);

    await addCodeViaUi(page, VALID_CODE_A);

    // Reporting success here is what made codes vanish on the next reload.
    expect((await bodyText(page)).toLowerCase()).toContain('could not be saved');
    expect(await bodyText(page)).toContain(VALID_CODE_A);
  });

  test('keeps an unsaved code visible across a force refresh', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);

    await addCodeViaUi(page, VALID_CODE_A);
    await forceRefresh(page);

    // It exists nowhere but memory, so dropping it here would lose it.
    expect(await bodyText(page)).toContain(VALID_CODE_A);
  });

  test('displays an inline code it could not lift out of the cache, and leaves it on disk', async ({
    page,
  }) => {
    await page.goto('');
    await page.evaluate(
      ([key, manual, catalogue]) => {
        localStorage.clear();
        localStorage.setItem(
          key as string,
          JSON.stringify({ schemaVersion: 2, timestamp: Date.now(), codes: [manual, catalogue] })
        );
      },
      [STORAGE_KEY, manualEntry(VALID_CODE_A, 'manual-1700000000000'), catalogueEntry('XYZ-XYZ-XYZ')] as const
    );

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);

    expect(await bodyText(page)).toContain(VALID_CODE_A);
    expect(await readKey(page, STORAGE_KEY)).toContain(VALID_CODE_A);

    await forceRefresh(page);
    expect(await bodyText(page), 'should not vanish on the next refresh').toContain(VALID_CODE_A);
  });
});

test.describe('authority of storage', () => {
  test('does not resurrect codes the user deliberately cleared', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);

    await addCodeViaUi(page, VALID_CODE_A);
    expect(await readKey(page, MANUAL_STORAGE_KEY)).toContain(VALID_CODE_A);

    // Clearing site data is an explicit instruction, not a fault to recover from.
    await page.evaluate(() => localStorage.clear());
    await forceRefresh(page);

    expect(await readKey(page, MANUAL_STORAGE_KEY) ?? '').not.toContain(VALID_CODE_A);
    await expect(page.locator(CARD)).not.toHaveCount(0);
  });
});

test.describe('cross-tab writes', () => {
  test('self-heals to the union when another tab clobbers the key', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);

    await addCodeViaUi(page, VALID_CODE_A);

    // Merge-only writes are still last-write-wins across tabs. Simulate the
    // other tab replacing the key with only its own code.
    await page.evaluate(
      ([key, entry]) => {
        const value = JSON.stringify([entry]);
        localStorage.setItem(key as string, value);
        window.dispatchEvent(
          new StorageEvent('storage', { key: key as string, newValue: value, storageArea: localStorage })
        );
      },
      [MANUAL_STORAGE_KEY, manualEntry(VALID_CODE_B, 'manual-1700000000001')] as const
    );
    await page.waitForTimeout(1200);

    const stored = (await readKey(page, MANUAL_STORAGE_KEY)) ?? '';
    expect(stored).toContain(VALID_CODE_A);
    expect(stored).toContain(VALID_CODE_B);

    const text = await bodyText(page);
    expect(text).toContain(VALID_CODE_A);
    expect(text).toContain(VALID_CODE_B);
    await expect(page.locator(CARD)).not.toHaveCount(0);
  });
});
