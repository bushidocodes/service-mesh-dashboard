import Loadable from "react-loadable";
import { Loading } from "components/Loading";

const LazyLoader = (opts) => {
  return Loadable(
    Object.assign(
      {
        loading: Loading,
        delay: 250,
        timeout: 15000
      },
      opts
    )
  );
};

export { LazyLoader };
