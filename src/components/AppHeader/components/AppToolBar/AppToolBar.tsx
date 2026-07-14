import decipherLogo from "components/AppHeader/assets/decipherLogo.svg";
import ButtonGroup from "components/ButtonGroup";
import NavButton from "components/NavButton";
import { Link } from "react-router-dom";
import AppToolBarHeader from "./components/AppToolBarHeader";
import AppVersionLink from "./components/AppVersionLink";
import BrandContainer from "./components/BrandContainer";
import BrandLogo from "./components/BrandLogo";
import BrandText from "./components/BrandText";
import Breadcrumb from "./components/Breadcrumb";
import Breadcrumbs from "./components/Breadcrumbs";
import LanguageSelector from "./components/LanguageSelector";
import SkipNav from "./components/SkipNav";

interface AppToolBarProps {
  appVersion?: string;
  hideRoot?: boolean;
  pathname: string;
  serviceNameLookup?: Record<string, any>;
  toolbarButtons?: any[];
}

const defaultToolbarButtons = [
  {
    path: "/settings",
    icon: "cog",
    label: "Settings",
    outline: "none"
  }
];
/**
 * Stateless functional React component that renders the bar at top of main content with breadcrumbs represending client routing and a link to settings
 * @param {Object} props - See propTypes
 * @returns JSX.Element
 */
function AppToolBar({
  pathname,
  hideRoot: _hideRoot,
  toolbarButtons = defaultToolbarButtons,
  serviceNameLookup = {}
}: AppToolBarProps) {
  return (
    <AppToolBarHeader>
      <SkipNav type="button" skipToId="main-content">
        Skip Navigation
      </SkipNav>
      <BrandContainer>
        <BrandLogo alt="" src={decipherLogo} />
        <BrandText>
          <Link
            to={{
              pathname: "/",
              search: ""
            }}
          >
            Fabric
          </Link>
        </BrandText>
      </BrandContainer>

      <Breadcrumbs hideRoot>
        <Breadcrumb>
          <Link to="/">fabric</Link>
        </Breadcrumb>
        {
          //strip out leading slashes to get route as array
          pathname
            .replace(/^\/|\/$/g, "")
            // Decode ALL escaped slashes, not just the first. A string-argument
            // .replace() only swaps the first match, so a path with multiple
            // encoded slashes (e.g. "a%2Fb%2Fc") split into the wrong segments.
            // The /gi flag covers every occurrence and both %2F and %2f.
            .replace(/%2F/gi, "/")
            .split("/")
            .map((val, idx) => {
              let breadcrumbName;

              if (serviceNameLookup[val]) {
                // if the current value is a service name we need to look up the actual name from the slug
                breadcrumbName = serviceNameLookup[val].name;
              } else breadcrumbName = val;

              return val ? (
                <Breadcrumb key={`${val}|${idx}`}>
                  <Link
                    to={`${pathname.substr(0, pathname.indexOf(val))}${val}`}
                  >
                    {breadcrumbName.length < 30
                      ? breadcrumbName
                      : `${breadcrumbName.substr(0, 30)}...`}
                  </Link>
                </Breadcrumb>
              ) : null;
            })
        }
      </Breadcrumbs>
      <LanguageSelector />
      <AppVersionLink
        href="https://github.com/DecipherNow/gm-fabric-dashboard/blob/master/CHANGELOG.md"
        rel="noopener noreferrer"
        target="_blank"
      >
        {/*REACT_APP_VERSION is generated from package.json via dotenv*/}
        {process.env.REACT_APP_VERSION}
      </AppVersionLink>

      <ButtonGroup toolbar>
        {toolbarButtons.map((button) => (
          <NavButton
            active={pathname === "/settings" ? true : false}
            key={button.path}
            hideLabel
            icon={button.icon}
            label={button.label}
            outline={"none"}
            to={button.path}
          />
        ))}
      </ButtonGroup>
    </AppToolBarHeader>
  );
}

export default AppToolBar;
