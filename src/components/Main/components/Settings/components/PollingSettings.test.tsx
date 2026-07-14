import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import { renderWithIntl, withIntl } from "utils/i18nTesting";
import PollingSettings from "./PollingSettings";

const mockChangePollingInterval = vi.fn();
const mockStartPolling = vi.fn();
const mockStopPolling = vi.fn();
mockStartPolling.mockReturnValue("Start Polling Function");
mockStopPolling.mockReturnValue("Stop Polling Function");

let mockProps = {
  changePollingInterval: mockChangePollingInterval,
  interval: 5000,
  isPolling: true,
  startPolling: mockStartPolling,
  stopPolling: mockStopPolling,
  title: "Instance Polling",
  glyph: "Poll"
};

describe("PollingSettings component", () => {
  beforeEach(function () {
    mockStartPolling.mockClear();
    mockStopPolling.mockClear();
  });

  test("Matches the snapshot", () => {
    const { asFragment } = renderWithIntl(<PollingSettings {...mockProps} />);
    expect(asFragment()).toMatchSnapshot();
  });

  test("Resume / Pause button component is rendered", () => {
    renderWithIntl(<PollingSettings {...mockProps} />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  test("If isPolling prop is set to 'true', button displays 'Pause Polling'", () => {
    const { rerender } = renderWithIntl(<PollingSettings {...mockProps} />);
    rerender(withIntl(<PollingSettings {...mockProps} isPolling={true} />));
    expect(screen.getByRole("button")).toHaveAttribute(
      "title",
      "Pause Polling"
    );
  });

  test("If isPolling prop is set to 'true', and button is clicked, the function that is called is Stop Polling", () => {
    const { rerender } = renderWithIntl(<PollingSettings {...mockProps} />);
    rerender(withIntl(<PollingSettings {...mockProps} isPolling={true} />));
    fireEvent.click(screen.getByRole("button"));
    expect(mockStopPolling).toBeCalled();
  });

  test("If isPolling prop is set to 'false', the PollingSettings Button displays 'Resume Polling'", () => {
    const { rerender } = renderWithIntl(<PollingSettings {...mockProps} />);
    rerender(withIntl(<PollingSettings {...mockProps} isPolling={false} />));
    expect(screen.getByRole("button")).toHaveAttribute(
      "title",
      "Resume Polling"
    );
  });

  test("If isPolling prop is set to 'false', and button is clicked, the function that is called is Start Polling", () => {
    const { rerender } = renderWithIntl(<PollingSettings {...mockProps} />);
    rerender(withIntl(<PollingSettings {...mockProps} isPolling={false} />));
    fireEvent.click(screen.getByRole("button"));
    expect(mockStartPolling).toBeCalled();
  });

  test("Glyph is rendered as part of the resume/ pause button", () => {
    renderWithIntl(<PollingSettings {...mockProps} />);
    // NOTE: enzyme asserted the 2nd <g> inside the button had class "glyph".
    // Querying observable DOM: the button contains a <g class="glyph"> rendered
    // by the Glyph component.
    const button = screen.getByRole("button");
    expect(button.querySelector("g.glyph")).toBeInTheDocument();
  });

  test("LayoutSection component is rendered by making sure header tag contains 'Instance Polling' text", () => {
    renderWithIntl(<PollingSettings {...mockProps} />);
    // NOTE: enzyme matched the LayoutSection component by name; RTL is DOM-based,
    // so we assert the observable header text it renders from the title prop.
    expect(screen.getByText("Instance Polling")).toBeInTheDocument();
  });

  test("InputRange component is getting rendered", () => {
    const { container } = renderWithIntl(<PollingSettings {...mockProps} />);
    expect(container.querySelectorAll("input[type='range']")).toHaveLength(1);
  });

  test("InputRange value depends on the initial state of the Polling Settings component", () => {
    mockProps.interval = 99000;
    const { container } = renderWithIntl(<PollingSettings {...mockProps} />);
    const range = container.querySelector("input[type='range']");
    expect(range).toHaveValue("99");
  });
});
