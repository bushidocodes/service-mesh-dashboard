import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";
import NotFound from "components/Main/scenes/InstanceView/components/NotFound";
import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const SettingsGrid = LazyLoader({
  loader: () => import("components/Main/components/Settings")
});

const Explorer = LazyLoader({
  loader: () => import("components/Main/components/Explorer")
});

const GMGrid = LazyLoader({
  loader: () => import("components/Main/components/GMGrid")
});

/**
 * Default Runtime Router for unknown Runtimes
 * @export
 * @returns JSX.Element
 */
export default function DefaultInstanceRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Root Redirect */}
        <Route index element={<Navigate to="explorer" replace />} />
        {/* General Routes shared by all runtimes */}
        <Route path="settings" element={<SettingsGrid />} />
        <Route path="explorer" element={<Explorer />} />
        {/* Catch all route for dynamically generated dashboards */}
        <Route path=":dashboardName" element={<GMGrid />} />
        {/* Should never match, but included just in case */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
