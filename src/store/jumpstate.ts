// Local, dependency-free reimplementation of the (now unmaintained) `jumpstate`
// library's public surface, backed by plain redux@4. See issue #39.
//
// This is a faithful drop-in for `import ... from "jumpstate"`: the runtime
// semantics below are deliberately identical to jumpstate@2.2.2 so that every
// existing call site (State reducers, Effect async flows, the global `Actions`
// singleton, and direct `getState()` reads) keeps behaving exactly as before.
// Only the five named exports the app and tests actually used are implemented:
//
//   State, Effect, Actions, getState, CreateJumpstateMiddleware
//
// (`dispatch` is exported too for completeness — jumpstate exported it — even
// though no call site imports it directly.)

import type { Middleware } from "redux";
import type { RootState } from "types";

/** Minimal action shape used by the jumpstate shim (flat `type`, optional token). */
export type JumpstateAction = {
  type?: string;
  payload?: unknown;
  _token?: number;
};

export type ActionCreator = (payload?: unknown) => unknown;
type EffectHandler = (action: JumpstateAction) => void;
type DispatchFn = (...args: unknown[]) => unknown;
type GetStateFn = () => RootState;

/**
 * Explicit registry of every State method and Effect name the app registers.
 * Under `noUncheckedIndexedAccess`, a bare `Record<string, ActionCreator>`
 * makes `Actions.foo` into `ActionCreator | undefined` at every call site.
 * Naming the keys keeps property access definite once modules have loaded
 * (State/Effect registration runs at import time, before any UI/services).
 * Dynamic registration still uses `registerAction` below.
 */
export type KnownActions = {
  // store/states/dashboards
  setDashboards: ActionCreator;
  // store/states/fabric
  setFabricPollingInterval: ActionCreator;
  setIsPollingFabric: ActionCreator;
  setSelectedInstanceID: ActionCreator;
  setServicesPollingFailures: ActionCreator;
  setSelectedServiceSlug: ActionCreator;
  setFabricMicroservices: ActionCreator;
  // store/states/instance
  setInstanceMetricsPollingInterval: ActionCreator;
  setIsPollingInstanceMetrics: ActionCreator;
  setMetricsPollingFailures: ActionCreator;
  setThreadsError: ActionCreator;
  appendToMetrics: ActionCreator;
  clearMetrics: ActionCreator;
  // store/states/settings
  setThreadsFilter: ActionCreator;
  setUserLocale: ActionCreator;
  // store/states/threadsTable
  fetchThreadsSuccess: ActionCreator;
  clearThreads: ActionCreator;
  // services/dashboards
  loadDashboardsFromJSON: ActionCreator;
  // services/fabricMicroservices
  fetchFabricMicroservicesFailure: ActionCreator;
  fetchAndStoreFabricMicroservices: ActionCreator;
  fetchFabricMicroservicesSuccess: ActionCreator;
  changeFabricMicroservicesPollingInterval: ActionCreator;
  startPollingFabricMicroservices: ActionCreator;
  stopPollingFabricMicroservices: ActionCreator;
  selectInstance: ActionCreator;
  // services/instance/metrics
  fetchAndStoreInstanceMetrics: ActionCreator;
  fetchMetricsSuccess: ActionCreator;
  fetchMetricsFailure: ActionCreator;
  startPollingInstanceMetrics: ActionCreator;
  stopPollingInstanceMetrics: ActionCreator;
  stopPollingAndPurgeInstanceMetrics: ActionCreator;
  changeInstanceMetricsPollingInterval: ActionCreator;
  // services/instance/threads
  fetchAndStoreInstanceThreads: ActionCreator;
  fetchThreadsFailure: ActionCreator;
};

// `Actions` is a shared singleton object. State methods and Effects both attach
// themselves here, and the services layer references it directly. Keeping it a
// single mutable module export preserves jumpstate's global-singleton pattern.
// Cast from empty: keys are filled by State/Effect during module evaluation.
export const Actions = {} as KnownActions;

/** Mutable view used only by State/Effect registration (dynamic string keys). */
const actionRegistry = Actions as Record<string, ActionCreator | undefined>;

function registerAction(name: string, creator: ActionCreator): void {
  actionRegistry[name] = creator;
}

function hasAction(name: string): boolean {
  return actionRegistry[name] != null;
}

// Effect handlers, keyed by action type. The middleware invokes the matching
// handler after an action of that type passes through the reducers.
const effectRegistry: Record<string, EffectHandler> = {};

// `dispatch`/`getState` resolve to the real redux store functions once
// CreateJumpstateMiddleware() has been applied. Until then they warn, matching
// jumpstate's behaviour when used without its middleware.
const warn = (): void => {
  console.warn(
    "jumpstate shim: getState/dispatch used before CreateJumpstateMiddleware() " +
      "was applied to the store."
  );
};
let resolvedDispatch: DispatchFn = warn as DispatchFn;
let resolvedGetState: GetStateFn = warn as GetStateFn;

export const dispatch = (...args: unknown[]): unknown =>
  resolvedDispatch(...args);
// getState returns the full Redux tree; typing it as RootState gives the
// services/components that read `getState().slice.field` real type safety.
export const getState = (): RootState => resolvedGetState();

/**
 * Turn a `{ initial, methodName(state, payload) {...} }` config into a redux
 * reducer, registering a global `Actions.methodName(payload)` for each method
 * that dispatches `{ type: methodName, payload }`. Each method is therefore both
 * an action-creator and that action's reducer case — jumpstate's core idea.
 *
 * @param config - `initial` plus one or more `(state, payload)` methods
 * @returns a redux reducer
 */
export function State(config: {
  initial: unknown;
  [methodName: string]: unknown;
}) {
  const { initial, ...methods } = config;

  const reducer = (state = initial, action: JumpstateAction = {}) => {
    const handler = action.type != null ? methods[action.type] : undefined;
    return typeof handler === "function"
      ? (handler as (s: unknown, p: unknown) => unknown)(state, action.payload)
      : state;
  };

  Object.keys(methods).forEach((name) => {
    // First registration of a given name wins (jumpstate skips re-registration
    // rather than overwriting). All method/effect names in this app are unique,
    // so this is just defensive parity.
    if (hasAction(name)) return;
    registerAction(name, (payload) => dispatch({ type: name, payload }));
  });

  return reducer;
}

// Monotonic token used to thread an Effect's return value back out to the
// promise returned by `Actions.<effect>(payload)`. The effect runs synchronously
// inside `dispatch` (see the middleware), so the result is available by the time
// `dispatch` returns.
let effectToken = 0;
const effectResults: Record<number, unknown> = {};

/**
 * Register an async side-effect. `Actions.<name>(payload)` dispatches an action
 * of `type === name`; the middleware then invokes `fn(payload, getState,
 * dispatch)`. The call returns a promise that resolves with `fn`'s return value
 * (jumpstate effects are always thenable, even though no call site awaits them).
 *
 * The handler type is deliberately loose (`...args: never[]`) so existing service
 * effect signatures (which often only declare a payload param, or reuse the 2nd
 * slot for other defaults) stay assignable without `any`. At the call site the
 * shim always passes `(payload, getState, dispatch)`.
 *
 * @param name
 * @param fn - `(payload, getState, dispatch) => unknown`
 * @returns the `Actions.<name>` dispatcher
 */
export function Effect(name: string, fn: (...args: never[]) => unknown) {
  if (typeof name !== "string") {
    throw new Error(
      'Effect requires a string name, e.g. Effect("myEffect", fn).'
    );
  }
  if (hasAction(name)) {
    throw new Error(
      `jumpstate shim: an action or effect named "${name}" already exists.`
    );
  }

  effectRegistry[name] = (action) => {
    const result = fn(
      action.payload as never,
      getState as never,
      dispatch as never
    );
    if (action._token != null) {
      effectResults[action._token] = result;
    }
  };

  const creator: ActionCreator = (payload) => {
    const token = effectToken++;
    dispatch({ type: name, payload, _token: token });
    const result = effectResults[token];
    delete effectResults[token];
    return Promise.resolve(result);
  };
  registerAction(name, creator);

  return creator;
}

/**
 * Redux middleware that wires up the global `dispatch`/`getState` and fires the
 * registered Effect for an action's type after it has passed through the
 * reducers. Mirrors jumpstate's middleware (minus the unused Hook registry).
 */
export function CreateJumpstateMiddleware(): Middleware {
  return (store) => {
    resolvedDispatch = store.dispatch as DispatchFn;
    resolvedGetState = store.getState as GetStateFn;
    return (next) => (action) => {
      const result = next(action);
      const typedAction = action as JumpstateAction;
      const effect =
        typedAction.type != null ? effectRegistry[typedAction.type] : undefined;
      if (effect) {
        effect(typedAction);
      }
      return result;
    };
  };
}
