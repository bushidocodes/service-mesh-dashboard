// Freeze the wall clock so components that derive values from the current time
// produce deterministic output. <UpTime/> renders `Date.now() - startTime`, so
// under React Testing Library's full-tree render its snapshot would otherwise
// drift every second. The enzyme suite avoided this only because shallow
// rendering never reached <UpTime/>. Pinning Date.now() (alongside the existing
// TZ=America/New_York pin) keeps uptime snapshots stable across CI runs.
const FIXED_NOW = 1780000000000; // 2026-05-28T03:06:40Z
Date.now = () => FIXED_NOW;

// Stub HTMLCanvasElement.getContext for JSDOM.
// Libraries like Dygraphs call canvas.getContext('2d') during mount; JSDOM does
// not implement it and throws a "not implemented" error that would fail tests.
// Providing a no-op 2D context prevents the crash without affecting assertions
// that only inspect props/DOM structure (never the actual pixel output).
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
    fillStyle: "",
    strokeStyle: "",
    lineWidth: 1,
    font: "",
    textAlign: "start",
    textBaseline: "alphabetic",
    globalAlpha: 1,
    canvas: { width: 0, height: 0 },
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    closePath: jest.fn(),
    stroke: jest.fn(),
    fill: jest.fn(),
    arc: jest.fn(),
    arcTo: jest.fn(),
    bezierCurveTo: jest.fn(),
    quadraticCurveTo: jest.fn(),
    rect: jest.fn(),
    ellipse: jest.fn(),
    clip: jest.fn(),
    rotate: jest.fn(),
    scale: jest.fn(),
    translate: jest.fn(),
    transform: jest.fn(),
    setTransform: jest.fn(),
    resetTransform: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    createRadialGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
    createPattern: jest.fn(() => null),
    drawImage: jest.fn(),
    fillText: jest.fn(),
    strokeText: jest.fn(),
    measureText: jest.fn(() => ({
      width: 0,
      actualBoundingBoxAscent: 0,
      actualBoundingBoxDescent: 0,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: 0
    })),
    getImageData: jest.fn(() => ({
      data: new Uint8ClampedArray(0),
      width: 0,
      height: 0
    })),
    putImageData: jest.fn(),
    createImageData: jest.fn(() => ({ data: new Uint8ClampedArray(0) })),
    setLineDash: jest.fn(),
    getLineDash: jest.fn(() => []),
    isPointInPath: jest.fn(() => false),
    isPointInStroke: jest.fn(() => false)
  }));
}
// Fail tests on any warning
console.error = (message, ...args) => {
  // Normalize message to a string whether it's a string, Error, or format arg
  const msg =
    typeof message === "string"
      ? message
      : message instanceof Error
        ? message.message
        : String(message);
  // React Router v6 uses useLayoutEffect internally, which can fire a benign SSR
  // warning in the jsdom environment. Suppress it.
  if (msg.includes("useLayoutEffect")) return;
  // Some pinned libraries (react-select, react-grid-layout, etc.) trigger state
  // updates from async callbacks that React Testing Library cannot auto-wrap in
  // act(). The assertions still work correctly; this is purely a testing-
  // methodology warning.
  if (msg.includes("not wrapped in act")) return;
  // Several pinned libraries still use the deprecated React 16 lifecycle
  // methods: react-grid-layout, react-modal, react-resizable,
  // react-draggable, react-transition-group.
  // (react-collapse no longer does as of v5.1.1.) Suppress until those
  // libraries are upgraded — see issue #27.
  if (msg.includes("componentWillMount")) return;
  if (msg.includes("componentWillReceiveProps")) return;
  if (msg.includes("componentWillUpdate")) return;
  // react-input-range uses findDOMNode which React 18 deprecated.
  if (msg.includes("findDOMNode")) return;
  // Some pinned libraries declare defaultProps on function components (deprecated
  // in React 18). Suppress until those libraries are upgraded.
  if (
    msg.includes(
      "Support for defaultProps will be removed from function components"
    )
  )
    return;
  throw new Error(message);
};
