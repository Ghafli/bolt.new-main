// app/tests/integration.spec.ts
import { test, expect } from "@playwright/test";
import { chromium } from "playwright";

test("should be able to send a message and see a response", async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");
       await page.getByRole("button", { name: "Sign Up" }).click();
       await page.getByPlaceholder("Username").fill("test");
      await page.getByPlaceholder("Password").fill("password");
      await page.getByRole("button", { name: "Sign Up" }).click();
      await page.waitForTimeout(1000);
    await page.getByPlaceholder("Type your message here...").fill("Hello");
    await page.getByRole("button", { name: "Send" }).click();
    await page.waitForSelector(".assistantMessage", { timeout: 10000 });
    const message = await page.textContent(".assistantMessage p");
    expect(message).toBeTruthy();

    await browser.close();
});

test("should be able to upload a file and see it in the file tree", async () => {
     const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto("http://localhost:3000");
        await page.getByRole("button", { name: "Sign Up" }).click();
       await page.getByPlaceholder("Username").fill("test");
      await page.getByPlaceholder("Password").fill("password");
      await page.getByRole("button", { name: "Sign Up" }).click();
      await page.waitForTimeout(1000);
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.getByRole("button", { name: "Upload File" }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles({
        name: "test.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("Hello World"),
    });
      await page.waitForSelector(".treeItem span", { timeout: 10000 });
     const file = await page.textContent(".treeItem span");
      expect(file).toBe("📄 test.txt")
        await browser.close();
});
