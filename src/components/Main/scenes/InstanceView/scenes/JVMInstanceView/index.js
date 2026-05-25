import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LazyLoader } from "components/LazyLoader";
import NotFound from "components/Main/scenes/InstanceView/components/NotFound";

const SummaryGrid = LazyLoader({
  loader: () => import("./scenes/Summary")
});

const ThreadsGrid = LazyLoader({
  loader: () => import("./scenes/Threads")
});

const RoutesGrid = LazyLoader({
  loader: () => import("../../components/Routes")
});

const Explorer = LazyLoader({
  loader: () => import("components/Main/components/Explorer")
});

const GMGrid = LazyLoader({
  loader: () => import("components/Main/components/GMGrid")
});

/**
 * JVM Runtime Router.
 * Paths are relative to the parent /:serviceSlug/:instanceID/* route.
 * @export
 * @returns JSX.Element
 */
export default function JVMInstanceRouter() {
  return (
    <Routes>
      {/* Redirect instance root → /summary */}
      <Route index element={<Navigate replace to="summary" />} />
      <Route path="summary" element={<SummaryGrid />} />
      <Route path="threads" element={<ThreadsGrid />} />
      <Route path="routes" element={<RoutesGrid />} />
      <Route path="explorer" element={<Explorer />} />
      {/* Catch-all for dynamically generated dashboards */}
      <Route path=":dashboardName" element={<GMGrid />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
