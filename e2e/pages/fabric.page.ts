import { type Locator, type Page } from "@playwright/test";
import BasePage from "./base.page";

/**
 * Page object for the Fabric (all-services) view.
 *
 * Selector strategy (replaces the TestCafe `ReactSelector` page-objects):
 *  - Tabs are routed NavLinks with stable, locale-independent hrefs
 *    ("/", "/Down", "/Warning", "/Stable"); we select by href and disambiguate
 *    from the brand/home link by requiring the nested count <dd>.
 *  - Service cards / list items carry `data-testid` added to the components.
 *  - The Cards/List toggle buttons expose their label as a `title` attribute.
 */
export default class FabricPage extends BasePage {
  readonly serviceCards: Locator;
  readonly serviceListItems: Locator;
  readonly cardsButton: Locator;
  readonly listButton: Locator;
  readonly searchInput: Locator;
  readonly sections: Locator;
  readonly sectionHeaders: Locator;

  constructor(page: Page) {
    super(page);
    this.serviceCards = page.getByTestId("service-card");
    this.serviceListItems = page.getByTestId("service-list-item");
    this.cardsButton = page.getByTitle("Cards", { exact: true });
    this.listButton = page.getByTitle("List", { exact: true });
    this.searchInput = page.getByPlaceholder("Search Services");
    this.sections = page.getByTestId("service-section");
    this.sectionHeaders = page.getByTestId("service-section-header");
  }

  /** Lowercased text of every group section header, in DOM order. */
  async sectionHeaderTexts(): Promise<string[]> {
    const texts = await this.sectionHeaders.allInnerTexts();
    return texts.map((t) => t.trim().toLowerCase());
  }

  /** The `data-status` of every rendered card, in DOM order. */
  async cardStatuses(): Promise<string[]> {
    return this.serviceCards.evaluateAll((els) =>
      els.map((el) => el.getAttribute("data-status") ?? "")
    );
  }

  async goto() {
    await this.page.goto("/");
  }

  /**
   * The status-filter tab for a given route ("/", "/Down", "/Warning",
   * "/Stable"). The app uses hash routing, so links render as `#/…`; the nested
   * <dd> filter disambiguates the tab from the brand/home link.
   */
  tab(route: string): Locator {
    return this.page
      .locator(`a[href="#${route}"]`)
      .filter({ has: this.page.locator("dd") });
  }

  /** The count badge (<dd>) inside a status tab. */
  tabCount(href: string): Locator {
    return this.tab(href).locator("dd");
  }

  /** Reads a tab's count badge as an integer. */
  async readTabCount(href: string): Promise<number> {
    const text = await this.tabCount(href).innerText();
    return parseInt(text, 10);
  }
}
