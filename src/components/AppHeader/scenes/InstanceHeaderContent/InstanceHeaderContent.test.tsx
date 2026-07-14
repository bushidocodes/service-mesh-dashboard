import { screen } from "@testing-library/react";
import createTestStore from "json/createTestStore";
import state from "json/mockReduxState";
import { renderWithIntl } from "utils/i18nTesting";

// Default export uses useAppSelector + useIntl; drive the runtime switch via
// store state (services[selectedServiceSlug].runtime).
import InstanceHeaderContent from "./InstanceHeaderContent";
import DefaultHeaderContent from "./scenes/DefaultHeaderContent";
import GoHeaderContent from "./scenes/GoHeaderContent";
import JVMHeaderContent from "./scenes/JVMHeaderContent";

// InstanceHeaderContent is a runtime switch that renders exactly ONE of three
// child scenes. Enzyme asserted this via .find(Component)/.props(); RTL is
// DOM-based, so each scene is replaced with an identifiable stub (vi.fn) and
// we assert which stub mounts — and, for the prop-passing test, inspect the
// props the active stub received. This mirrors the original shallow intent.
// Vitest mock factories are hoisted and ESM-shaped: the stub goes on `default`
// (these modules are default-imported) and the real React is pulled in via the
// async `vi.importActual` rather than Jest's synchronous `requireActual`.
vi.mock("./scenes/JVMHeaderContent", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    default: vi.fn(() =>
      React.createElement("div", { "data-testid": "jvm-header" })
    )
  };
});
vi.mock("./scenes/GoHeaderContent", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    default: vi.fn(() =>
      React.createElement("div", { "data-testid": "go-header" })
    )
  };
});
vi.mock("./scenes/DefaultHeaderContent", async () => {
  const React = await vi.importActual<typeof import("react")>("react");
  return {
    default: vi.fn(() =>
      React.createElement("div", { "data-testid": "default-header" })
    )
  };
});

const selectedServiceSlug = "go-exemplar-v1-0";
const selectedInstanceID = "2smao7xwboy0000000000";

function storeForRuntime(runtime: string) {
  return createTestStore({
    ...state,
    fabric: {
      ...state.fabric,
      selectedServiceSlug,
      selectedInstanceID,
      services: {
        ...state.fabric.services,
        [selectedServiceSlug]: {
          ...state.fabric.services[selectedServiceSlug],
          runtime
        }
      }
    }
  });
}

describe("InstanceHeaderContent", () => {
  beforeEach(() => {
    vi.mocked(JVMHeaderContent).mockClear();
    vi.mocked(GoHeaderContent).mockClear();
    vi.mocked(DefaultHeaderContent).mockClear();
  });

  test("returns JVMHeaderContent when runtime is JVM", () => {
    renderWithIntl(<InstanceHeaderContent />, storeForRuntime("JVM"));
    expect(screen.getByTestId("jvm-header")).toBeInTheDocument();
    expect(screen.queryByTestId("go-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("default-header")).not.toBeInTheDocument();
  });

  test("returns GoHeaderContent when runtime is GO", () => {
    renderWithIntl(<InstanceHeaderContent />, storeForRuntime("GO"));
    expect(screen.getByTestId("go-header")).toBeInTheDocument();
    expect(screen.queryByTestId("jvm-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("default-header")).not.toBeInTheDocument();
  });

  test("returns DefaultHeaderContent for an unrecognized runtime", () => {
    renderWithIntl(<InstanceHeaderContent />, storeForRuntime(""));
    expect(screen.getByTestId("default-header")).toBeInTheDocument();
    expect(screen.queryByTestId("jvm-header")).not.toBeInTheDocument();
    expect(screen.queryByTestId("go-header")).not.toBeInTheDocument();
  });

  test("passes basePath, metrics, and a tab per dashboard to the active runtime view", () => {
    renderWithIntl(<InstanceHeaderContent />, storeForRuntime("GO"));
    // The active scene receives basePath, metrics, and the renderTabs() output.
    const call = vi.mocked(GoHeaderContent).mock.calls[0];
    expect(call).toBeDefined();
    const props = call![0];

    expect(props.basePath).toBe(
      `/${selectedServiceSlug}/${selectedInstanceID}`
    );
    expect(props.metrics).toBe(state.instance.metrics);
    // renderTabs() emits one <Tab> per dashboard (http, jvm, finagle).
    expect(props.headerTabs).toHaveLength(Object.keys(state.dashboards).length);
  });
});
