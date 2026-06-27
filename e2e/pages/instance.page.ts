import { type Page, type Locator } from "@playwright/test";
import BasePage from "./base.page";

/**
 * Page object for the Instance view (shared across Default/Go/JVM runtimes).
 *
 * Tabs render through the shared `TabLink` (data-testid="nav-tab"); each tab's
 * title lives in an <h1>, so tabs are selected by heading text — locale-aware
 * but stable for the English instance specs and for the constant dashboard tab
 * names (HTTP/JVM/Finagle/Go). Runtime grids keep react-grid-layout's
 * `.react-grid-item` class.
 */
export default class InstancePage extends BasePage {
  readonly navTabs: Locator;
  readonly readouts: Locator;
  readonly charts: Locator;
  readonly gridItems: Locator;
  readonly dataRows: Locator;
  readonly routeRequests: Locator;
  readonly routesSearch: Locator;
  readonly threadRows: Locator;
  readonly stackTraces: Locator;
  readonly inspectorItems: Locator;
  readonly inspectorSearch: Locator;
  readonly hideZero: Locator;
  readonly hideStatic: Locator;

  constructor(page: Page) {
    super(page);
    this.navTabs = page.getByTestId("nav-tab");
    this.readouts = page.getByTestId("readout");
    this.charts = page.getByTestId("line-chart");
    this.gridItems = page.locator(".react-grid-item");
    this.dataRows = page.getByTestId("data-row");
    this.routeRequests = page.getByTestId("route-requests");
    this.routesSearch = page.getByPlaceholder("Search Routes");
    this.threadRows = page.getByTestId("thread-row");
    this.stackTraces = page.getByTestId("stack-trace");
    this.inspectorItems = page.getByTestId("inspector-item");
    this.inspectorSearch = page.getByRole("searchbox");
    this.hideZero = page.locator('input[name="hideZeroMetric"]');
    this.hideStatic = page.locator('input[name="hideStaticMetric"]');
  }

  /** Navigates directly to an instance (lands on the Summary tab). */
  async goto(slug: string, instanceId: string) {
    await this.page.goto(`/#/${slug}/${instanceId}`);
  }

  /** A nav tab selected by its (heading) title text. */
  tab(title: string): Locator {
    return this.navTabs.filter({
      has: this.page.locator("h1", { hasText: title })
    });
  }

  /** A summary readout item selected by its title text. */
  readoutItem(title: string): Locator {
    return this.page.getByTestId("readout-item").filter({ hasText: title });
  }

  /** A line chart selected by its title text. */
  chart(title: string): Locator {
    return this.charts.filter({ hasText: title });
  }
}
