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

// `Actions` is a shared singleton object. State methods and Effects both attach
// themselves here, and the services layer references it directly. Keeping it a
// single mutable module export preserves jumpstate's global-singleton pattern.
export const Actions: Record<string, (payload?: any) => any> = {};

// Effect handlers, keyed by action type. The middleware invokes the matching
// handler after an action of that type passes through the reducers.
const effectRegistry: Record<string, (action: any) => void> = {};

// `dispatch`/`getState` resolve to the real redux store functions once
// CreateJumpstateMiddleware() has been applied. Until then they warn, matching
// jumpstate's behaviour when used without its middleware.
const warn = () =>
  console.warn(
    "jumpstate shim: getState/dispatch used before CreateJumpstateMiddleware() " +
      "was applied to the store."
  );
let resolvedDispatch: (...args: any[]) => any = warn;
let resolvedGetState: (...args: any[]) => any = warn;

export const dispatch = (...args: any[]): any => resolvedDispatch(...args);
export const getState = (...args: any[]): any => resolvedGetState(...args);

/**
 * Turn a `{ initial, methodName(state, payload) {...} }` config into a redux
 * reducer, registering a global `Actions.methodName(payload)` for each method
 * that dispatches `{ type: methodName, payload }`. Each method is therefore both
 * an action-creator and that action's reducer case — jumpstate's core idea.
 *
 * @param {Object} config - `initial` plus one or more `(state, payload)` methods
 * @returns {Function} a redux reducer
 */
export function State(config: Record<string, any>) {
  const { initial, ...methods } = config;

  const reducer = (state = initial, action: any = {}) => {
    const handler = methods[action.type];
    return handler ? handler(state, action.payload) : state;
  };

  Object.keys(methods).forEach((name) => {
    // First registration of a given name wins (jumpstate skips re-registration
    // rather than overwriting). All method/effect names in this app are unique,
    // so this is just defensive parity.
    if (Actions[name]) return;
    Actions[name] = (payload) => dispatch({ type: name, payload });
  });

  return reducer;
}

// Monotonic token used to thread an Effect's return value back out to the
// promise returned by `Actions.<effect>(payload)`. The effect runs synchronously
// inside `dispatch` (see the middleware), so the result is available by the time
// `dispatch` returns.
let effectToken = 0;
const effectResults: Record<number, any> = {};

/**
 * Register an async side-effect. `Actions.<name>(payload)` dispatches an action
 * of `type === name`; the middleware then invokes `fn(payload, getState,
 * dispatch)`. The call returns a promise that resolves with `fn`'s return value
 * (jumpstate effects are always thenable, even though no call site awaits them).
 *
 * @param {string} name
 * @param {Function} fn - `(payload, getState, dispatch) => any`
 * @returns {Function} the `Actions.<name>` dispatcher
 */
export function Effect(name: string, fn: (...args: any[]) => any) {
  if (typeof name !== "string") {
    throw new Error(
      'Effect requires a string name, e.g. Effect("myEffect", fn).'
    );
  }
  if (Actions[name]) {
    throw new Error(
      `jumpstate shim: an action or effect named "${name}" already exists.`
    );
  }

  effectRegistry[name] = (action) => {
    const result = fn(action.payload, getState, dispatch);
    if (action._token != null) {
      effectResults[action._token] = result;
    }
  };

  Actions[name] = (payload) => {
    const token = effectToken++;
    dispatch({ type: name, payload, _token: token });
    const result = effectResults[token];
    delete effectResults[token];
    return Promise.resolve(result);
  };

  return Actions[name];
}

/**
 * Redux middleware that wires up the global `dispatch`/`getState` and fires the
 * registered Effect for an action's type after it has passed through the
 * reducers. Mirrors jumpstate's middleware (minus the unused Hook registry).
 */
export function CreateJumpstateMiddleware() {
  return (store: any) => {
    resolvedDispatch = store.dispatch;
    resolvedGetState = store.getState;
    return (next: (action: any) => any) => (action: any) => {
      const result = next(action);
      const effect = effectRegistry[action.type];
      if (effect) {
        effect(action);
      }
      return result;
    };
  };
}
