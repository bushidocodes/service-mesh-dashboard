import { withUrlState as rawWithUrlState } from "with-url-state";
import history from "AppHistory";

/**
 * withUrlState is a HOC based on with-url-state that more closely matches
 * the way that React-Redux works. It uses a closure over the AppHistory
 * component to prevent users from having to import the history throughout
 * the app. If the mapOwnPropsToUrlState function is passed in, it maps it
 * through to the with-url-state API, but this is optional to allow this to
 * be used as a simple zero-arg HOC wrapper function.
 *
 * @export
 * @param {func} mapOwnPropsToUrlState - an optional function that allows the
 * actual props passed to the object to be composed together with the url state
 * similar to how one uses ownProps with mapStateToProps
 * @returns func - A function that can wrap a React component to create an HOC
 */
export default function withUrlState(mapOwnPropsToUrlState) {
  if (mapOwnPropsToUrlState) {
    return rawWithUrlState(history, mapOwnPropsToUrlState);
  } else {
    return rawWithUrlState(history);
  }
}
