import React, { useEffect, useState } from "react";

import Spinner from "./components/Spinner";

interface LoadingProps {
  delay?: number;
}

/**
 * Suspense fallback that delays the spinner by `delay` ms so fast loads
 * don't flash a spinner on screen. After `delay`, renders <Spinner />.
 *
 * Used as the `fallback` prop on Suspense boundaries that surround
 * React.lazy() components. Load failures should be handled by an
 * upstream <ErrorBoundary />.
 */
const Loading = ({ delay = 250 }: LoadingProps) => {
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return undefined;
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return show ? <Spinner /> : null;
};

export { Loading };
