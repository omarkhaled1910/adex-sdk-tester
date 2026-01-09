import { test, expect } from "@playwright/test";

test("AdExSDK initializes and triggers auction on viewport entry", async ({
  page,
}) => {
  // Listen for console logs to verify SDK initialization
  const consoleLogs: string[] = [];
  page.on("console", (msg) => {
    consoleLogs.push(msg.text());
  });

  // Set up request interception to capture auction request
  const auctionRequestPromise = page.waitForRequest(
    (req) => req.url().includes("/api/auctions") && req.method() === "POST",
    { timeout: 10000 }
  );

  await page.goto("/");

  // Verify SDK loaded
  const sdkLoaded = await page.evaluate(
    () => typeof (window as any).AdExSDK !== "undefined"
  );
  expect(sdkLoaded).toBe(true);

  // Wait for auction request to be made
  const auctionRequest = await auctionRequestPromise;
  expect(auctionRequest).toBeTruthy();

  // Verify the request payload
  const postData = auctionRequest.postDataJSON();
  expect(postData.publisherId).toBe("62c51d2b-4523-40b9-a6fb-ae4dd50fbf7b");
  expect(postData.domain).toBe("medium.com");
  expect(postData.adSlotType).toBe("banner");

  // Verify SDK logged initialization
  const hasInitLog = consoleLogs.some((log) =>
    log.includes("[AdExSDK] Initialized")
  );
  expect(hasInitLog).toBe(true);
});

test("AdExSDK handles network errors gracefully", async ({ page }) => {
  // Block auction API requests
  await page.route("**/api/auctions", (route) => {
    route.abort("failed");
  });

  const consoleLogs: string[] = [];
  page.on("console", (msg) => {
    consoleLogs.push(msg.text());
  });

  await page.goto("/");

  // Wait for error handling
  await page.waitForTimeout(2000);

  // SDK should still be loaded
  const sdkLoaded = await page.evaluate(
    () => typeof (window as any).AdExSDK !== "undefined"
  );
  expect(sdkLoaded).toBe(true);
});
