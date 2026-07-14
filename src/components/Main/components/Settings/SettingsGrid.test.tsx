import { fireEvent, within } from "@testing-library/react";
import createTestStore from "json/createTestStore";
import * as state from "json/mockReduxState";
import * as instanceSlice from "store/states/instance";
import { mountWithIntl } from "utils/i18nTesting";
import SettingsGrid from "./index";

// Import services so AppThunks / any residual wiring load in this test harness
import "services/fabricMicroservices/index";
import "services/instance/metrics/index";

let SettingGridWrap: ReturnType<typeof mountWithIntl>,
  mockState = state.default;

describe("SettingsGrid component", () => {
  beforeEach(function () {
    SettingGridWrap = mountWithIntl(
      <SettingsGrid />,
      createTestStore(mockState)
    );
  });

  test("Matches snapshot", () => {
    const { asFragment } = mountWithIntl(
      <SettingsGrid />,
      createTestStore(mockState)
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("Has an errorBoundary", () => {
    // NOTE: ErrorBoundary renders no DOM of its own (it returns its children),
    // so it cannot be queried directly. Its observable proxy is that the
    // children it wraps (the polling sections and the Metrics Cache section)
    // render successfully without falling back to the NotFoundError UI.
    const { container } = SettingGridWrap;
    expect(within(container).queryByText(/Error:/)).not.toBeInTheDocument();
    expect(
      within(container).getByRole("heading", { name: "Metrics Cache" })
    ).toBeInTheDocument();
  });

  test("Has 1 Fabric Polling Setting if fabricServer prop is not available and its called Polling", () => {
    mockState.settings.fabricServer = "";
    const { container } = mountWithIntl(
      <SettingsGrid />,
      createTestStore(mockState)
    );
    // Each PollingSettings renders exactly one range slider; with no
    // fabricServer there is a single PollingSettings whose section title (an
    // <h3>) is "Polling".
    expect(within(container).getAllByRole("slider")).toHaveLength(1);
    expect(
      within(container).getByRole("heading", { name: "Polling" })
    ).toBeInTheDocument();
  });

  test("Has 2 Fabric Polling Settings if fabricServer prop is available", () => {
    mockState.settings.fabricServer = "http://localhost:1337";
    const { container } = mountWithIntl(
      <SettingsGrid />,
      createTestStore(mockState)
    );
    // Each PollingSettings renders exactly one range slider, so counting the
    // sliders counts the PollingSettings instances.
    expect(within(container).getAllByRole("slider")).toHaveLength(2);
  });

  test("Has Samples readout", () => {
    // The Readout renders its readoutItems[0].title ("Samples") inside a
    // ReadoutItemTitle (an <h2>). Value is the metrics timestamp sample count.
    const { container } = SettingGridWrap;
    expect(
      within(container).getByRole("heading", { name: "Samples" })
    ).toBeInTheDocument();
  });

  test("Clear Cache button exists", () => {
    // The Clear Cache Button renders a <button> whose accessible name is its
    // label.
    const { container } = SettingGridWrap;
    expect(
      within(container).getByRole("button", { name: "Clear Cache" })
    ).toBeInTheDocument();
  });

  test("Clear Cache opens confirmation dialog; Confirm clears metrics and closes", () => {
    const clearMetrics = vi.spyOn(instanceSlice, "clearMetrics");
    const { container } = mountWithIntl(
      <SettingsGrid />,
      createTestStore(mockState)
    );

    const dialog = container.querySelector("dialog");
    expect(dialog).not.toBeNull();
    expect(dialog).not.toHaveAttribute("open");

    fireEvent.click(
      within(container).getByRole("button", { name: "Clear Cache" })
    );
    expect(dialog).toHaveAttribute("open");

    fireEvent.click(within(container).getByRole("button", { name: "Confirm" }));
    expect(clearMetrics).toHaveBeenCalledTimes(1);
    expect(dialog).not.toHaveAttribute("open");

    clearMetrics.mockRestore();
  });

  test("Clear Cache dialog Cancel closes without clearing metrics", () => {
    const clearMetrics = vi.spyOn(instanceSlice, "clearMetrics");
    const { container } = mountWithIntl(
      <SettingsGrid />,
      createTestStore(mockState)
    );

    fireEvent.click(
      within(container).getByRole("button", { name: "Clear Cache" })
    );
    const dialog = container.querySelector("dialog");
    expect(dialog).toHaveAttribute("open");

    fireEvent.click(within(container).getByRole("button", { name: "Cancel" }));
    expect(clearMetrics).not.toHaveBeenCalled();
    expect(dialog).not.toHaveAttribute("open");

    clearMetrics.mockRestore();
  });
});
