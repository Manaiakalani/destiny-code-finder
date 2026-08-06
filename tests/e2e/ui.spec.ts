import { test, expect } from '@playwright/test';
import {
  CARD,
  LEGACY_STORAGE_KEY,
  contrastRatio,
  parseRgb,
} from './helpers';

const EXPECTED_CODE_COUNT = 79;

test.describe('appearance', () => {
  for (const theme of ['dark', 'oled', 'light'] as const) {
    test(`[${theme}] solar button text clears WCAG AA against every gradient stop`, async ({
      page,
    }) => {
      await page.addInitScript(t => window.localStorage.setItem('theme', t), theme);
      await page.goto('');
      await page.waitForSelector(CARD);

      const button = page.locator('button.btn-solar').first();
      await expect(button).toBeVisible();

      const { color, backgroundImage } = await button.evaluate(el => {
        const styles = getComputedStyle(el);
        return { color: styles.color, backgroundImage: styles.backgroundImage };
      });

      const foreground = parseRgb(color);
      const stops = [...backgroundImage.matchAll(/rgba?\([^)]+\)/g)]
        .map(match => parseRgb(match[0]))
        .filter((stop): stop is number[] => stop !== null);

      expect(foreground, 'button colour should be resolvable').not.toBeNull();
      expect(stops.length, 'gradient should expose colour stops').toBeGreaterThan(0);

      // The worst stop is what a user actually reads against.
      const worst = Math.min(...stops.map(stop => contrastRatio(foreground!, stop)));
      expect(worst, `worst stop contrast was ${worst.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    });

    test(`[${theme}] expired codes are not blanket-dimmed`, async ({ page }) => {
      await page.addInitScript(t => window.localStorage.setItem('theme', t), theme);
      await page.goto('');
      await page.waitForSelector(CARD);

      // Dimming a whole card to signal "expired" tanks legibility; status is
      // carried by the badge instead.
      const dimmed = await page.evaluate(
        selector =>
          [...document.querySelectorAll(selector)].filter(
            card => parseFloat(getComputedStyle(card).opacity) < 0.95
          ).length,
        CARD
      );
      expect(dimmed).toBe(0);
    });
  }
});

test.describe('catalogue', () => {
  test('renders the full catalogue', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);
    await expect(page.locator(CARD)).toHaveCount(EXPECTED_CODE_COUNT);
  });

  test('ships no broken emblem images', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);
    await page.waitForLoadState('networkidle');

    const broken = await page.evaluate(
      () => [...document.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).length
    );
    expect(broken).toBe(0);
  });

  test('ignores and purges a pre-v2 cache instead of rendering it', async ({ page }) => {
    await page.addInitScript(key => {
      window.localStorage.setItem(
        key,
        JSON.stringify({
          codes: [
            {
              id: 'x',
              code: 'BAD-BAD-BAD',
              status: 'active',
              source: 'stale-v3',
              foundAt: 'nonsense',
            },
          ],
          timestamp: Date.now(),
        })
      );
    }, LEGACY_STORAGE_KEY);

    await page.goto('');
    await page.waitForSelector(CARD);

    await expect(page.locator(CARD)).toHaveCount(EXPECTED_CODE_COUNT);
    await expect(page.getByText('BAD-BAD-BAD')).toHaveCount(0);
    // The entry was not a manual code, so nothing needed rescuing and the key goes.
    expect(await page.evaluate(key => window.localStorage.getItem(key), LEGACY_STORAGE_KEY)).toBeNull();
  });
});

test.describe('add code dialog', () => {
  test('close control meets the 24x24 minimum target size', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);

    await page.locator('button:has-text("Add Code")').first().click();
    await page.waitForSelector('[role="dialog"]');

    const box = await page.locator('[role="dialog"] button').last().boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(24);
    expect(box!.height).toBeGreaterThanOrEqual(24);
  });

  test('a submitted code pins to the top and survives a refresh', async ({ page }) => {
    await page.goto('');
    await page.waitForSelector(CARD);

    await page.locator('button:has-text("Add Code")').first().click();
    await page.waitForSelector('[role="dialog"]');
    await page.locator('[role="dialog"] input').first().fill('YRC-C3D-YNA');
    await page.locator('[role="dialog"] button[type="submit"]').click();
    await page.waitForTimeout(600);

    await expect(page.locator(CARD).first()).toContainText('YRC-C3D-YNA');

    await page.locator('button:has-text("Refresh")').first().click();
    await page.waitForTimeout(1500);

    await expect(page.locator(CARD).first()).toContainText('YRC-C3D-YNA');
  });
});
