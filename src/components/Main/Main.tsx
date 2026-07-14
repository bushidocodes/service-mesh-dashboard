import ErrorBoundary from "components/ErrorBoundary";
import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";
import { Suspense, useEffect } from "react";
import { startPollingFabricMicroservices } from "services/fabricMicroservices";
import { useAppDispatch } from "store/hooks";
import { getFabricServer } from "utils/head";
import AppContent from "./components/AppContent";

const FabricRouter = LazyLoader({
  loader: () => import("./scenes/FabricView")
});

/**
 * Base React component of GM Fabric Dashboard.
 * Kicks off fabric polling on mount. Dashboards load via the fabric microservices
 * path once a service runtime is known (see fabricMicroservices.tsx).
 */
function Main() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fabricServer = getFabricServer();
    if (fabricServer) {
      console.log("Fabric Server Detected");
      // Begin polling Fabric-wide metrics from the Fabric Server. The thunk
      // resolves the discovery-service endpoint itself (via getFabricServer),
      // so no argument is needed here.
      dispatch(startPollingFabricMicroservices());
    } else {
      console.log("Fabric Server Not Defined!");
    }
  }, [dispatch]);

  return (
    <AppContent id="main-content" tabIndex={0}>
      {/* main-content id is here so that SkipNav can focus on it */}
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <FabricRouter />
        </Suspense>
      </ErrorBoundary>
    </AppContent>
  );
}

export default Main;
