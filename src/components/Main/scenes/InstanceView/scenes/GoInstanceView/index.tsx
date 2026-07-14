import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";
import NotFound from "components/Main/scenes/InstanceView/components/NotFound";
import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

const SummaryGrid = LazyLoader({
  loader: () => import("./scenes/Summary")
});

const FunctionsGrid = LazyLoader({
  loader: () => import("./scenes/Functions")
});

const RoutesGrid = LazyLoader({
  loader: () => import("../../components/Routes")
});

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
 * Go Runtime Router
 * @export
 * @returns JSX.Element
 */
export default function GoInstanceRouter() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Root Redirect */}
        <Route index element={<Navigate to="summary" replace />} />
        {/* Custom Runtime Specific Stuff */}
        <Route path="summary" element={<SummaryGrid />} />
        <Route path="routes" element={<RoutesGrid />} />
        <Route path="functions" element={<FunctionsGrid />} />
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
