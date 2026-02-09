import { test, expect } from "@playwright/test";

test.describe("Livechat", () => {
  test.beforeEach(async ({ page }) => {
    if (!process.env.E2E_URL) {
      throw new Error("Environment variables E2E_URL must be set.");
    }
    await page.goto(process.env.E2E_URL!);
  });

  test("Bubble button is visible", async ({ page }) => {
    await expect(page.getByTestId("travelbot-bubble-button")).toBeVisible();
  });

  test("Webchat button is visible", async ({ page }) => {
    page.getByTestId("travelbot-bubble-button").click();
    await expect(page.getByTestId("travelbot-webchat-button")).toBeVisible();
  });

  test("Whatsapp button is visible", async ({ page }) => {
    page.getByTestId("travelbot-bubble-button").click();
    await expect(page.getByTestId("travelbot-whatsapp-button")).toBeVisible();
  });

  test("Chatbox is visible", async ({ page }) => {
    page.getByTestId("travelbot-bubble-button").click();
    page.getByTestId("travelbot-webchat-button").click();
    await expect(page.getByTestId("travelbot-chatbox")).toBeVisible();
  });

  test("Livechat is Online", async ({ page }) => {
    page.getByTestId("travelbot-bubble-button").click();
    page.getByTestId("travelbot-webchat-button").click();
    const classList = await page
      .getByTestId("travelbot-webchat-status")
      .getAttribute("class");
    expect(classList).toContain("bg-green-500");
  });

  test("Bot icon is visible", async ({ page }) => {
    page.getByTestId("travelbot-bubble-button").click();
    page.getByTestId("travelbot-webchat-button").click();
    await expect(page.getByTestId("travelbot-bot-message-icon")).toBeVisible();
  });

  test("Can send a message", async ({ page }) => {
    page.getByTestId("travelbot-bubble-button").click();
    page.getByTestId("travelbot-webchat-button").click();
    await page.getByTestId('travelbot-chatbox-input').click();
    await page.getByTestId('travelbot-chatbox-input').fill('test message')
    await page.getByTestId('travelbot-chatbox-submit').click();
    await expect(page.locator('text=test message')).toBeVisible();
  })
});
