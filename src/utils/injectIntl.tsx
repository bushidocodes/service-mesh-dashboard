import { ComponentType } from "react";
import { useIntl } from "react-intl";

/**
 * injectIntl compatibility shim for react-intl v10.
 *
 * react-intl v10 removed the injectIntl HOC in favour of the useIntl hook.
 * This shim recreates the old API (an `intl` prop) so that existing
 * components can keep working unchanged while the codebase migrates
 * incrementally to hooks.
 *
 * Generic over the wrapped component's props (rather than `any`) so callers
 * still get typed props on the wrapped export - matching react-intl's own
 * injectIntl typing and keeping callback-prop inference working at JSX call
 * sites (e.g. `onSearch={(filterString) => ...}`).
 */
export function injectIntl<P extends { intl: unknown }>(
  Component: ComponentType<P>
): ComponentType<Omit<P, "intl">> {
  function Wrapped(props: Omit<P, "intl">) {
    const intl = useIntl();
    return <Component {...(props as P)} intl={intl} />;
  }

  Wrapped.displayName = `injectIntl(${
    Component.displayName || Component.name || "Component"
  })`;

  return Wrapped;
}

export default injectIntl;
