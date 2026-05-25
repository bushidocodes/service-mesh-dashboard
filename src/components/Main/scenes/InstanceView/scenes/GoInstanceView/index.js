import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LazyLoader } from "components/LazyLoader";
import NotFound from "components/Main/scenes/InstanceView/components/NotFound";

const SummaryGrid = LazyLoader({
  loader: () => import("./scenes/Summary")
});

const FunctionsGrid = LazyLoader({
  loader: () => import("./scenes/Functions")
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
 * Go Runtime Router.
 * Paths are relative to the parent /:serviceSlug/:instanceID/* route.
 * @export
 * @returns JSX.Element
 */
export default function GoInstanceRouter() {
  return (
    <Routes>
      {/* Redirect instance root → /summary */}
      <Route index element={<Navigate replace to="summary" />} />
      <Route path="summary" element={<SummaryGrid />} />
      <Route path="routes" element={<RoutesGrid />} />
      <Route path="functions" element={<FunctionsGrid />} />
      <Route path="explorer" element={<Explorer />} />
      {/* Catch-all for dynamically generated dashboards */}
      <Route path=":dashboardName" element={<GMGrid />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
