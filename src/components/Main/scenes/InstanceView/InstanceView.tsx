import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";
import React, { Suspense, useEffect } from "react";
import { connect } from "react-redux";
import { Actions } from "store/jumpstate";
import type { RootState } from "types";

interface InstanceViewProps {
  instanceID: string;
  runtime: string;
  // string | null mirrors the fabric store slice (selected* default to null).
  selectedInstanceID?: string | null;
  selectedServiceSlug?: string | null;
  serviceName?: string;
  serviceVersion?: string;
  serviceSlug?: string;
}

const DefaultRouter = LazyLoader({
  loader: () => import("./scenes/DefaultInstanceView")
});

const GoRouter = LazyLoader({
  loader: () => import("./scenes/GoInstanceView")
});

const JVMRouter = LazyLoader({
  loader: () => import("./scenes/JVMInstanceView")
});

/**
 * InstanceView is an intermediate router that is responsible for directing to the appropriate runtime-specific router
 * and optionally calling Actions.selectInstance if the instance isn't currently selected
 * @export
 * @param {Object} props - see propTypes
 * @returns JSX.Element
 */
function InstanceView({
  instanceID,
  runtime,
  selectedInstanceID,
  selectedServiceSlug,
  serviceSlug
}: InstanceViewProps) {
  useEffect(() => {
    if (
      serviceSlug &&
      instanceID &&
      (serviceSlug !== selectedServiceSlug || instanceID !== selectedInstanceID)
    ) {
      Actions.selectInstance({ instanceID, serviceSlug });
    }
  }, [instanceID, serviceSlug, selectedInstanceID, selectedServiceSlug]);

  let RuntimeRouter;
  switch (runtime) {
    case "JVM":
      RuntimeRouter = JVMRouter;
      break;
    case "GO":
      RuntimeRouter = GoRouter;
      break;
    default:
      RuntimeRouter = DefaultRouter;
  }

  return (
    <Suspense fallback={<Loading />}>
      <RuntimeRouter />
    </Suspense>
  );
}

function mapStateToProps(state: RootState) {
  return {
    selectedServiceSlug: state.fabric.selectedServiceSlug,
    selectedInstanceID: state.fabric.selectedInstanceID
  };
}

export default connect(mapStateToProps)(InstanceView);
