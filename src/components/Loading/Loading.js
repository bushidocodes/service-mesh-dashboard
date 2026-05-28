import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";

import Spinner from "./components/Spinner";

/**
 * Suspense fallback that delays the spinner by `delay` ms so fast loads
 * don't flash a spinner on screen. After `delay`, renders <Spinner />.
 *
 * Used as the `fallback` prop on Suspense boundaries that surround
 * React.lazy() components. Load failures should be handled by an
 * upstream <ErrorBoundary />.
 */
const Loading = ({ delay = 250 }) => {
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return undefined;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return show ? <Spinner /> : null;
};

Loading.propTypes = {
  delay: PropTypes.number
};

export { Loading };
