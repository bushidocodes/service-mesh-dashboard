import { useLocation } from "react-router-dom";
import { useAppSelector } from "store/hooks";
import { trimID } from "utils";
import AppHeaderContainer from "./components/AppHeaderContainer";
import AppToolBar from "./components/AppToolBar";
import Banner from "./components/Banner";
import AppHeaderContent from "./scenes";

/**
 * Stateless functional React component that renders the App Header
 * @returns JSX.Element
 */
function AppHeader() {
  const { pathname } = useLocation();
  const services = useAppSelector((state) => state.fabric.services);
  const title = getTitle(pathname.replace(/^\/|\/$/g, "").split("/"), services);

  return (
    <AppHeaderContainer>
      <AppToolBar pathname={pathname} serviceNameLookup={services} />
      <Banner title={title} hideBackground={false} />
      <AppHeaderContent />
    </AppHeaderContainer>
  );
}

function getTitle(pathArray: string[], services: Record<string, any>) {
  // an instance ID will always be the second item in this array,
  // however the root can be a number of different things, including a service name slug
  const [root = "", selectedInstance = ""] = pathArray;

  // if the root is a valid service name slug, then use it to look up the real name and version
  const { name: selectedServiceName, version: selectedServiceVersion } =
    services[root] || "";

  if (selectedInstance) {
    return `${selectedServiceName} ${selectedServiceVersion}: ${trimID(
      selectedInstance
    )}`;
  } else if (selectedServiceName) {
    return `${selectedServiceName} ${selectedServiceVersion}`;
  } else if (root) {
    return root;
  } else {
    return "Fabric";
  }
}

export default AppHeader;
