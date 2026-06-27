import { type Page } from "@playwright/test";

/**
 * Shared base for all page objects. Holds the Playwright `page` and the
 * react-select interaction helper used by the Group/Sort dropdowns across views.
 */
export default class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Opens a `gm-select` dropdown (identified by its always-visible title, e.g.
   * "Group" or "Sort") and clicks the option with the given label.
   */
  async chooseFromSelect(title: string, option: string) {
    await this.page
      .locator(".gm-select__control")
      .filter({ hasText: title })
      .click();
    await this.page.getByRole("option", { name: option, exact: true }).click();
  }
}
