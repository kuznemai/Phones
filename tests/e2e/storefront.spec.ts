import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const CART_KEY = "iz.cart.v1";

/** Fails the test on any console error or uncaught exception. */
function watchConsole(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function addToCart(page: Page, slug: string): Promise<void> {
  await page.goto(`/product/${slug}`);
  const button = page.getByTestId("add-to-cart");
  await expect(button).toBeEnabled();
  await button.click();
  await expect(page.getByTestId("go-to-cart")).toBeVisible();
}

test("every public page opens from a direct link without console errors", async ({ page }) => {
  const errors = watchConsole(page);
  const pages: [string, string][] = [
    ["/", "Privacy built in, not bolted on"],
    ["/shop", "Smartphones running IZ OS"],
    ["/product/iz-one-pro", "IZ One Pro"],
    ["/cart", "Your cart"],
    ["/checkout", "Checkout preview"],
    ["/favorites", "Saved devices"],
    ["/about", "Smartphones for a more secure tomorrow"],
    ["/security", "How IZ OS protects your phone"],
    ["/faq", "Frequently asked questions"],
    ["/contact", "Get in touch"],
  ];
  for (const [path, heading] of pages) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading, exact: true })).toBeVisible();
    await expect(page).toHaveTitle(/IZ Secure/);
    expect(await page.locator('meta[name="description"]').getAttribute("content")).toBeTruthy();
  }
  expect(errors).toEqual([]);
});

test("the old technology URL redirects to Security & OS", async ({ page }) => {
  await page.goto("/offer");
  await expect(page).toHaveURL(/\/security$/);
});

test("an unknown product shows the 404 page with a way back", async ({ page }) => {
  const response = await page.goto("/product/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await page.getByRole("button", { name: "Browse the catalog" }).click();
  await expect(page).toHaveURL(/\/shop$/);
});

test.describe("catalog", () => {
  test("search, filters and sorting update the list and the URL", async ({ page }) => {
    await page.goto("/shop");
    const cards = page.getByTestId("product-card");
    await expect(cards).toHaveCount(6);

    await page.getByLabel("Search devices").fill("wallet");
    await expect(page).toHaveURL(/q=wallet/);
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("IZ Vault");

    await page.getByLabel("Search devices").fill("");
    await expect(cards).toHaveCount(6);

    await page.getByLabel("Sort by").selectOption("price-asc");
    const prices = await page.getByTestId("card-price").allTextContents();
    const values = prices.map((price) => Number(price.replace(/[^\d]/g, "")));
    expect(values).toEqual([...values].sort((a, b) => a - b));
  });

  test("filters can be opened from a shared link and lead to an honest empty state", async ({ page, isMobile }) => {
    await page.goto("/shop?storage=512&color=Arctic%20White");
    const cards = page.getByTestId("product-card");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toContainText("IZ One Pro");
    await expect(cards.first().getByTestId("card-price")).toHaveText("$1,349");

    await page.goto("/shop?q=banana");
    await expect(page.getByRole("heading", { name: "No devices match your search" })).toBeVisible();
    await page.getByRole("button", { name: "Show all devices" }).click();
    await expect(cards).toHaveCount(6);

    if (isMobile) await page.getByRole("button", { name: /Filters/ }).click();
    await page.getByText("In stock only").click();
    await expect(page).toHaveURL(/stock=1/);
    await expect(cards).toHaveCount(5);
  });
});

test.describe("product and cart", () => {
  test("configure a device, add it, change quantities and keep the cart after a reload", async ({ page }) => {
    await page.goto("/product/iz-one-pro");
    await expect(page.getByTestId("product-price")).toHaveText("$1,199");

    await page.getByText("512 GB", { exact: true }).click();
    await expect(page.getByTestId("product-price")).toHaveText("$1,349");

    await page.getByRole("button", { name: "Increase quantity" }).click();
    await page.getByTestId("add-to-cart").click();
    await expect(page.getByRole("status").filter({ hasText: "Added 2 × IZ One Pro, 512 GB · Arctic White" })).toBeVisible();
    await expect(page.getByTestId("cart-count")).toHaveText("2");

    await page.getByTestId("go-to-cart").click();
    await expect(page.getByTestId("cart-total")).toHaveText("$2,698");

    await page.reload();
    await expect(page.getByTestId("cart-total")).toHaveText("$2,698");

    await page.getByRole("button", { name: "Decrease quantity of IZ One Pro" }).click();
    await expect(page.getByTestId("cart-total")).toHaveText("$1,349");

    await addToCart(page, "iz-air");
    await page.goto("/cart");
    await expect(page.getByTestId("cart-total")).toHaveText("$2,098");

    await page.getByRole("button", { name: /Remove IZ One Pro/ }).click();
    await expect(page.getByTestId("cart-total")).toHaveText("$749");

    await page.getByRole("button", { name: "Clear cart" }).click();
    await page.getByRole("button", { name: "Yes, clear cart" }).click();
    await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();
  });

  test("a corrupted or tampered cart in storage is repaired instead of crashing", async ({ page }) => {
    const errors = watchConsole(page);
    await page.goto("/");
    await page.evaluate((key) => localStorage.setItem(key, "{not valid json"), CART_KEY);
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "Your cart is empty" })).toBeVisible();

    await page.evaluate((key) => {
      localStorage.setItem(
        key,
        JSON.stringify([
          { productId: "p_one", variantId: "v_one_128_white", quantity: 999 },
          { productId: "ghost", variantId: "x", quantity: 1 },
          "junk",
        ]),
      );
    }, CART_KEY);
    await page.goto("/cart");
    await expect(page.getByTestId("line-total")).toHaveCount(1);
    await expect(page.getByTestId("cart-total")).toHaveText("$8,490");
    expect(errors).toEqual([]);
  });

  test("an out-of-stock line blocks checkout until it is removed", async ({ page }) => {
    await page.goto("/");
    await page.evaluate((key) => {
      localStorage.setItem(key, JSON.stringify([{ productId: "p_field", variantId: "v_field_256_black", quantity: 1 }]));
    }, CART_KEY);
    await page.goto("/cart");
    await expect(page.getByRole("alert")).toContainText("out of stock");
    await expect(page.getByTestId("go-to-checkout")).toHaveCount(0);
  });

  test("a missing image falls back to a placeholder", async ({ page }) => {
    await page.route("**/products/device-white.png", (route) => route.fulfill({ status: 404 }));
    await page.goto("/product/iz-air");
    await expect(page.getByRole("img", { name: /image unavailable/ }).first()).toBeVisible();
  });
});

test.describe("checkout preview", () => {
  test("validates the form, adds delivery and never claims an order was placed", async ({ page }) => {
    await addToCart(page, "iz-one");
    await page.goto("/cart");
    await page.getByTestId("go-to-checkout").click();
    await expect(page.getByTestId("demo-notice")).toContainText("This is a demo checkout");

    // Standard delivery is preselected: $849 + $19.
    await expect(page.getByTestId("cart-total")).toHaveText("$868");
    await page.getByText("Express delivery").click();
    await expect(page.getByTestId("cart-total")).toHaveText("$898");

    await page.getByTestId("checkout-submit").click();
    const summary = page.getByTestId("error-summary");
    await expect(summary).toBeFocused();
    await expect(summary).toContainText("Please check 7 fields");

    await page.getByLabel("Full name").fill("Alex Morgan");
    await page.getByLabel("Email").fill("alex@");
    await page.getByLabel("Phone").fill("+1 555 010 0123");
    await page.getByLabel("Country").fill("United States");
    await page.getByLabel("City").fill("Portland");
    await page.getByLabel("Street address").fill("12 Example Street");
    await page.getByLabel("Postal code").fill("97201");
    await expect(page.getByText("Enter a valid email address")).toHaveCount(2);

    await page.getByLabel("Email").fill("alex@example.com");
    await page.getByTestId("checkout-submit").click();

    const result = page.getByTestId("checkout-result");
    await expect(result).toBeFocused();
    await expect(result).toContainText("Ordering is not available yet");
    await expect(result).not.toContainText(/order (was )?(placed|confirmed)|paid/i);

    const stored = await page.evaluate(() => JSON.stringify({ ...localStorage }) + JSON.stringify({ ...sessionStorage }));
    expect(stored).not.toContain("Alex Morgan");
    expect(stored).not.toContain("alex@example.com");
  });
});

test.describe("accessibility basics", () => {
  test("the skip link moves focus to the main content", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard navigation is checked on desktop.");
    await page.goto("/shop");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#main")).toBeFocused();
  });

  test("the mobile menu traps focus and closes with Escape", async ({ page, isMobile }) => {
    test.skip(!isMobile, "The menu button only exists on small screens.");
    await page.goto("/");
    const open = page.getByRole("button", { name: "Open menu" });
    await open.click();
    await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
    await page.getByRole("dialog", { name: "Menu" }).getByRole("link", { name: "FAQ" }).click();
    await expect(page).toHaveURL(/\/faq$/);
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await open.click();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(open).toBeFocused();
  });

  test("no page scrolls horizontally", async ({ page }) => {
    for (const path of ["/", "/shop", "/product/iz-vault", "/cart", "/checkout", "/about", "/security", "/faq", "/contact"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
