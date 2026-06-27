import { type Page, type Locator } from "@playwright/test";
import BasePage from "./base.page";

/**
 * Page object for the Service view (the instances table for one service).
 *
 * Each instance row is a `GMServiceTableLineItem` carrying
 * `data-testid="instance-row"`; its ID is the row's link text and its uptime is
 * the `data-testid="instance-uptime"` cell.
 */
export default class ServicePage extends BasePage {
  readonly rows: Locator;
  readonly instanceIds: Locator;
  readonly uptimes: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.rows = page.getByTestId("instance-row");
    this.instanceIds = this.rows.locator("a");
    this.uptimes = page.getByTestId("instance-uptime");
    this.searchInput = page.getByPlaceholder("Search Instances");
  }

  /** Navigates directly to a service's instances table by its computed slug. */
  async goto(slug: string) {
    await this.page.goto(`/#/${slug}`);
  }

  async idTexts(): Promise<string[]> {
    return (await this.instanceIds.allInnerTexts()).map((t) => t.trim());
  }

  async uptimeTexts(): Promise<string[]> {
    return (await this.uptimes.allInnerTexts()).map((t) => t.trim());
  }
}
