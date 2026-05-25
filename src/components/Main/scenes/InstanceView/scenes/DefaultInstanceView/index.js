import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { LazyLoader } from "components/LazyLoader";
import NotFound from "components/Main/scenes/InstanceView/components/NotFound";

const Explorer = LazyLoader({
  loader: () => import("components/Main/components/Explorer")
});

const GMGrid = LazyLoader({
  loader: () => import("components/Main/components/GMGrid")
});

/**
 * Default Runtime Router for unknown runtimes.
 * Paths are relative to the parent /:serviceSlug/:instanceID/* route.
 * @export
 * @returns JSX.Element
 */
export default function DefaultInstanceRouter() {
  return (
    <Routes>
      {/* Redirect instance root → /explorer */}
      <Route index element={<Navigate replace to="explorer" />} />
      <Route path="explorer" element={<Explorer />} />
      {/* Catch-all for dynamically generated dashboards */}
      <Route path=":dashboardName" element={<GMGrid />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
