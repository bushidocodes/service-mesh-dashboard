import { LazyLoader } from "components/LazyLoader";
import { Loading } from "components/Loading";
import { Suspense, useEffect } from "react";
import { selectInstance } from "services/fabricMicroservices";
import { useAppDispatch, useAppSelector } from "store/hooks";

interface InstanceViewProps {
  instanceID: string;
  runtime: string;
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
 * and optionally dispatching selectInstance if the instance isn't currently selected
 * @export
 * @param {Object} props - see propTypes
 * @returns JSX.Element
 */
function InstanceView({ instanceID, runtime, serviceSlug }: InstanceViewProps) {
  const dispatch = useAppDispatch();
  const selectedInstanceID = useAppSelector(
    (state) => state.fabric.selectedInstanceID
  );
  const selectedServiceSlug = useAppSelector(
    (state) => state.fabric.selectedServiceSlug
  );

  useEffect(() => {
    if (
      serviceSlug &&
      instanceID &&
      (serviceSlug !== selectedServiceSlug || instanceID !== selectedInstanceID)
    ) {
      dispatch(selectInstance({ instanceID, serviceSlug }));
    }
  }, [
    dispatch,
    instanceID,
    serviceSlug,
    selectedInstanceID,
    selectedServiceSlug
  ]);

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

export default InstanceView;
