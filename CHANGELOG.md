## Unreleased

### Changed

* Metrics cache eviction is now based on a fixed max sample count
  (`METRICS_CACHE_MAX_SAMPLES = 60`, ~5 minutes at the default 5s poll
  interval) rather than a ~100MB byte-size cap via `object-sizeof`.
  Under heavy load the cache may retain a different time window than
  before because eviction is driven by poll count, not estimated bytes.
  Settings shows the current sample count instead of a byte size estimate.

<a name="1.0.6"></a>

## [1.0.6](https://github.com/DecipherNow/gm-fabric-dashboard/compare/v1.0.5...v1.0.6) (2018-02-22)

### Bug Fixes

* ⚙️ &nbsp; fix instance polling in settings ([#1505](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1505)) ([3cef656](https://github.com/DecipherNow/gm-fabric-dashboard/commit/3cef656))

### Features

* 🇩🇪 &nbsp; German translations ([#1524](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1524)) ([89c3c3f](https://github.com/DecipherNow/gm-fabric-dashboard/commit/89c3c3f))
* 🤖 &nbsp; automate end to end testing with testcafe ([#1511](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1511)) ([a1fa4bb](https://github.com/DecipherNow/gm-fabric-dashboard/commit/a1fa4bb))
* 📊 &nbsp; color code legend ([#1512](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1512)) ([26cfdcd](https://github.com/DecipherNow/gm-fabric-dashboard/commit/26cfdcd))
* 🏹 &nbsp; generate GitHub release ([#1510](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1510)) ([2b6a771](https://github.com/DecipherNow/gm-fabric-dashboard/commit/2b6a771))

<a name="1.0.5"></a>

## [1.0.5](https://github.com/DecipherNow/gm-fabric-dashboard/compare/v1.0.4...v1.0.5) (2018-02-10)

### Bug 🐛 Fixes 🔨

* add margin to prevent lapping ([#1438](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1438)) ([ae7a394](https://github.com/DecipherNow/gm-fabric-dashboard/commit/ae7a394))
* instance polling error ([#1442](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1442)) ([62fa6e0](https://github.com/DecipherNow/gm-fabric-dashboard/commit/62fa6e0))
* remove console log from Glyph ([#1430](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1430)) ([04eb16b](https://github.com/DecipherNow/gm-fabric-dashboard/commit/04eb16b))
* run linters in circleci ([#1368](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1368)) ([bb0bcbe](https://github.com/DecipherNow/gm-fabric-dashboard/commit/bb0bcbe))
* sparklines overflow tabs ([#1433](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1433)) ([f1ab903](https://github.com/DecipherNow/gm-fabric-dashboard/commit/f1ab903))
* storybook now imports css as expected ([#1474](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1474)) ([07feb8c](https://github.com/DecipherNow/gm-fabric-dashboard/commit/07feb8c))
* upgraded storybook dependencies ([#1432](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1432)) ([e1ed88f](https://github.com/DecipherNow/gm-fabric-dashboard/commit/e1ed88f))

### Features

#### Internationalization 🌐 🗣️ 👂

* notification i18n ([#1493](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1493)) ([76fb5ba](https://github.com/DecipherNow/gm-fabric-dashboard/commit/76fb5ba))
* add intl shape ([#1494](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1494)) ([0e43dcc](https://github.com/DecipherNow/gm-fabric-dashboard/commit/0e43dcc))
* add react-intl ([#1460](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1460)) ([6a81219](https://github.com/DecipherNow/gm-fabric-dashboard/commit/6a81219))
* add storybook-intl ([#1479](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1479)) ([14bc81c](https://github.com/DecipherNow/gm-fabric-dashboard/commit/14bc81c))

- fabric view i18n ([#1464](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1464)) ([c0dbe19](https://github.com/DecipherNow/gm-fabric-dashboard/commit/c0dbe19))
- footer i18n ([#1486](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1486)) ([b92aa03](https://github.com/DecipherNow/gm-fabric-dashboard/commit/b92aa03))
- GMLineChart i18n ([#1487](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1487)) ([f411199](https://github.com/DecipherNow/gm-fabric-dashboard/commit/f411199))
- implement internationalization for dynamically generated dashboards ([#1497](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1497)) ([4cb4056](https://github.com/DecipherNow/gm-fabric-dashboard/commit/4cb4056))
- instance view i18n ([#1476](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1476)) ([c5985c3](https://github.com/DecipherNow/gm-fabric-dashboard/commit/c5985c3))
- jvm/summary i18n ([#1482](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1482)) ([17bcbbb](https://github.com/DecipherNow/gm-fabric-dashboard/commit/17bcbbb))
- language widget ([#1496](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1496)) ([be23b60](https://github.com/DecipherNow/gm-fabric-dashboard/commit/be23b60))
- service view i18n ([#1468](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1468)) ([07d5a97](https://github.com/DecipherNow/gm-fabric-dashboard/commit/07d5a97))
- settings view i18n ([#1470](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1470)) ([068f4e9](https://github.com/DecipherNow/gm-fabric-dashboard/commit/068f4e9))
- table i18n ([#1480](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1480)) ([6f5dc12](https://github.com/DecipherNow/gm-fabric-dashboard/commit/6f5dc12))

#### Persist UI control state to the URL 🚦

* Explorer withUrlState ([#1449](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1449)) ([769b59e](https://github.com/DecipherNow/gm-fabric-dashboard/commit/769b59e))
* implement with-url-state for FabricGrid ([#1373](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1373)) ([dfb7bc6](https://github.com/DecipherNow/gm-fabric-dashboard/commit/dfb7bc6))
* implemented withurlstate in FunctionsGrid ([#1446](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1446)) ([a14f3b8](https://github.com/DecipherNow/gm-fabric-dashboard/commit/a14f3b8))
* RoutesGrid withUrlState ([#1443](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1443)) ([a1dda11](https://github.com/DecipherNow/gm-fabric-dashboard/commit/a1dda11))
* ServiceView withUrlState ([#1444](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1444)) ([500ca09](https://github.com/DecipherNow/gm-fabric-dashboard/commit/500ca09))

#### Other small enhancements 📈

* add tool to audit dependency licenses ([#1380](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1380)) ([f07316b](https://github.com/DecipherNow/gm-fabric-dashboard/commit/f07316b))
* graph areas now filled by default ([#1452](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1452)) ([6e8ced3](https://github.com/DecipherNow/gm-fabric-dashboard/commit/6e8ced3))
* Client side routing now uses a slug representing a microservice name and version

<a name="1.0.4"></a>

## [1.0.4](https://github.com/DecipherNow/gm-fabric-dashboard/compare/v1.0.3...v1.0.4) (2018-01-16)

### Bug Fixes 🐛🔨

* added sort by latency to JVM routes table ([#1294](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1294)) ([e6a0339](https://github.com/DecipherNow/gm-fabric-dashboard/commit/e6a0339))
* location.state defaults to object ([#1289](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1289)) ([1bf3b3d](https://github.com/DecipherNow/gm-fabric-dashboard/commit/1bf3b3d))
* replace Nunito with Metropolis ([#1351](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1351)) ([9809ba4](https://github.com/DecipherNow/gm-fabric-dashboard/commit/9809ba4))
* update mesh header ([#1346](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1346)) ([ee85a23](https://github.com/DecipherNow/gm-fabric-dashboard/commit/ee85a23))

### Features 🚀🚀🚀

* allow users to access service view for service with no metrics ([#1360](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1360)) ([57d9f1a](https://github.com/DecipherNow/gm-fabric-dashboard/commit/57d9f1a))
* make react select searchable ([#645](https://github.com/DecipherNow/gm-fabric-dashboard/issues/645)) ([0ffcd22](https://github.com/DecipherNow/gm-fabric-dashboard/commit/0ffcd22))
* add Storybook stories for Table([#1278](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1278)) ([e393fa1](https://github.com/DecipherNow/gm-fabric-dashboard/commit/e393fa1)), notfounderror([#645](https://github.com/DecipherNow/gm-fabric-dashboard/issues/645)) ([0ffcd22](https://github.com/DecipherNow/gm-fabric-dashboard/commit/0ffcd22)), and layoutsection ([#1288](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1288)) ([cff948b](https://github.com/DecipherNow/gm-fabric-dashboard/commit/cff948b))
* add unit tests for AppHeader, Uptime, dygraph utils, Button, Notification, Selectors, Loading, Glyph, DygraphWrapper, Appheader, InstanceView
* Add copyright text and update footer responsiveness behavior ([#1342](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1342)) ([1084a27](https://github.com/DecipherNow/gm-fabric-dashboard/commit/1084a27))
* Deleted functionality to run without a `discovery-service` instance

### Yak Shaving 🐃💇

* Cleaned up our README and other docs
* Updated dependencies
* modify our CircleCI behavior to filter branches ([#1335](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1335)) ([cac5b21](https://github.com/DecipherNow/gm-fabric-dashboard/commit/cac5b21)) and run with Circle CI 2.0 workflows
* lint commit msgs and automate changelog ([#1340](https://github.com/DecipherNow/gm-fabric-dashboard/issues/1340)) ([85e2051](https://github.com/DecipherNow/gm-fabric-dashboard/commit/85e2051))
* Simplify the dev workflow. Now just run `npm start` and get coding!

<a name="1.0.3"></a>

## [1.0.3](https://github.com/DecipherNow/gm-fabric-dashboard/compare/v1.0.2...v1.0.3) (2017-12-14)

### Added

* Added a user guide
* Added styled-component tests
* Added support for Storyshot testing
* Created a reusable Table component

### Changed

* Improved JVM Threads view with sorting and grouping options
* Refactored all remaining SCSS logic into styled-components
* Fixed bugs in IE11, Edge, and Safari 10.1
* Improved modal accessibility
* Updated dependencies

### Removed

* Removed SCSS tooling
* Removed UIKit

### Test Coverage: 52.54% ([1.0.3 Coverage Report])

### Bundle Size: ~1.32 MB ([1.0.3 Bundle Size Report])

### Production Build: ([1.0.3 Build])

## [1.0.2] - 2017-12-04

### Added

* Added more unit tests
* Added PropType shapes as nested PropTypes validation
* Added a skeleton for a user guide

### Changed

* Refactor filenames and imports to be search-friendly
* Refactored SCSS files into Styled Components
* Fixed bugs in IE11 and Safari 10.1
* Improved visual interaction without affecting accessibility features

### Removed

* Removed SCSS stylesheets

### Test Coverage: 38.22% ([1.0.2 Coverage Report])

### Bundle Size: ~2.61 MB ([1.0.2 Bundle Size Report])

### Production Build: ([1.0.2 Build])

## [1.0.1] - 2017-11-22

### Added

* Added more unit tests
* Updated build version of Node to 8.x LTS
* Moved form styles into a styled-component

### Changed

* Updated status icons in JVM service instance threads table
* Fixed various IE11 issues
* Fixed keyboard tab navigation in Firefox 52 (ESR)
* Fixed service view sort case sensitivity
* Fixed toggle asc/desc order in Service view
* Improved handling of metrics keys

### Removed

* Removed form SASS styles

### Test Coverage: 31.57% ([1.0.1 Coverage Report])

### Bundle Size: ~2.43 MB ([1.0.1 Bundle Size Report])

### Production Build: ([1.0.1 Build])

## [1.0.0] - 2017-11-16

### Added

* New styles for modals and notification
* Added more unit tests
* Implemented code splitting at the route level

### Changed

* Updated npm dependencies
* Updated README with demo
* Updated error text and bar colors
* Updated publish script
* Added auto restart to docker image

### Removed

* Removed sourcemaps from production bundle

### Test Coverage: 25.35% ([1.0.0 Coverage Report])

### Bundle Size: ~1.42 MB ([1.0.0 Bundle Size Report])

### Production Build: ([1.0.0 Build])

## [0.9.1] - 2017-11-09

### Added

* Implemented a new custom icon system
* Added more unit tests for utility functions
* Improved user experience for invalid services and service instances

### Changed

* Fixed spaces in service names in url bar
* Increased net change calculations to three decimal points
* App Header in Service View now has a tab
* Updated appearance for polling settings
* Refactored SCSS into Styled Components
* Fixed various cross-browser issues

### Removed

* Removed all UIKit icons
* Removed jQuery

### Test Coverage: 16.48% ([0.9.1 Coverage Report])

### Bundle Size: ~1.11 MB ([0.9.1 Bundle Size Report])

### Production Build: ([0.9.1 Build])

## [0.9.0] - 2017-11-03

### Added

* New App Header Nav ✨
* Improved keyboard nav support
* Improved use of ARIA tags
* Added HTTP verb to JVM routes dashboard
* Serving JS bundle with gzip compression
* Added detail icons to Fabric Card View
* Added Enzympe tests using Jest Snapshots

### Changed

* Implemented support for new `gm-fabric-go` process memory utilization metrics
* Updated npm dependencies
* Fixed various IE11 issues
* Refactored SCSS into Styled Components
* Storybook stories now live alongside the components they cover
* Began refactoring UIKit icons to a new custom Icon system

### Removed

* Removed old sidebar components
* Removed scss stylesheets

### Test Coverage: 4.57% ([0.9.0 Coverage Report])

### Bundle Size: ~1.25 MB ([0.9.0 Bundle Size Report])

### Production Build: ([0.9.0 Build])

## [0.8.1] - 2017-10-30

### Added

* Color coded error rates
* Added HTTP verb to JVM routes dashboard

### Changed

* Implemented support for new `discovery-service` API
* Updated npm dependencies
* New HTTP verb label component
* Refactored SCSS into Styled Components

### Removed

* Removed gradients to improved Fabric dashboard performance with 150+ cards
* Removed scss stylesheets

### Test Coverage: 4.89% ([0.8.1 Coverage Report])

### Bundle Size: 1.25 MB ([0.8.1 Bundle Size Report])

### Production Build: ([0.8.1 Build])

## [0.8.0] - 2017-10-26

### Added

* Fabric Dashboard controls now route driven
* Added routes visualization to Go dashboards
* MIT license

### Changed

* Various IE11 fixes
* Modified mock-sds to be dynamic
* Refactored SCSS into Styled Components
* Updated Docs
* Fixed spelling errors
* Replaced Mathjs with smaller tool

### Removed

* Removed scss stylesheets

### Test Coverage: 5.15% ([0.8.0 Coverage Report])

### Bundle Size: ~1.19 + MB ([0.8.0 Bundle Size Report])

### Production Build: ([0.8.0 Build])

## [0.7.1] - 2017-10-18

### Added

* Implemented a service dashboard, which currently only is used to navigate to microservice instance dashboards.
* Linked the fabric dashboard nav elements to the new service dashboards

### Changed

* Increased uptime precision
* General keyboard and a11y improvements, including a link to skip to main content
* Fixed group by capability and group by owner bugs

### Removed

* Removed scss stylesheets that have been decomposed into styled-components

### Test Coverage: 3.51% ([0.7.1 Coverage Report])

### Bundle Size: ~1.62 MB ([0.7.1 Bundle Size Report])

### Production Build: ([0.7.1 Build])

## [0.7.0] - 2017-10-12

### Added

* App renders cleanly on IE11. Hooray for the Enterprise!
* App is navigable by keyboard
* Services landing page now has a route driven search
* New Publish script simplifies Docker deployment process

### Changed

* Massive bug bash. Greater stability throughout the app
* Further internal refactoring from SCSS towards Styled-Components
* Updated dependencies

### Test Coverage: 3.36% ([0.7.0 Coverage Report])

### Bundle Size: ~1.61 MB ([0.7.0 Bundle Size Report])

### Production Build: ([0.7.0 Build])

## [0.6.0] - 2017-10-03

### Added

* Added support for polling of groups from the "Fabric Server" discovery service
* Implemented Phase 0 Services view, including searching and filtering
* Implemented an interim solution for selection of instances from the table view.
* Added unit tests for trimID
* Improved in-line comments throughout the app
* Created production-ready Docker image to facilitate new Docker-based deployment process.

### Changed

* Implemented React Storybook for development of UI components in isolation from the larger app
* Began process of refactoring sass into Styled-Components based React components
* Updated dependencies, including React 16.0 and Enzyme 3.

### Test Coverage: 3.45% ([0.6.0 Coverage Report])

### Bundle Size: ~ 1.5 MB ([0.6.0 Bundle Size Report])

### Production Build: ([0.6.0 Build])

## [0.5.0] - 2017-09-15

### Added

* Improved dashboard support for the gm-fabric-go microservice metrics API
* Added support for backed "Fabrics Server" discovery service support behind a flag. This includes UI components and routing to allow a single dashboard to monitor a fabric of microservices.
* Added interim Docker container tooling for the dev pipeline. This will be improved in the future.

### Changed

* Disabled local storage persistence of dashboards pending further work on dashboard customization tools
* External Web fonts are new embedded into the app to render in environments with no Internet connectivity
* Fixed URL import support in sass files, inlcuding mesh image in sidebar footer
* Reorganized source files according to runtime and responsibility

### Test Coverage: 3.42% ([0.5.0 Coverage Report])

### Bundle Size: ~ 1.5 MB ([0.5.0 Bundle Size Report])

### Production Build: ([0.5.0 Build])

## [0.4.0] - 2017-09-08

### Added

* Experimental support for gm-fabric-go microservices

### Changed

* Updated dependencies
* Simplified use of Webpack Dev Server proxy
* Substantial internal refactoring to separate out runtime-specific components into modules

### Test Coverage: 4.27% ([0.4.0 Coverage Report])

### Bundle Size: ~ 1.5 MB ([0.4.0 Bundle Size Report])

### Production Build: ([0.4.0 Build])

## [0.3.3] - 2017-09-01

### Changed

* Minor style changes
* Updated dependencies

### Test Coverage: 5.53% ([0.3.3 Coverage Report])

### Bundle Size: ~ 1.5 MB ([0.3.3 Bundle Size Report])

### Production Build: ([0.3.3 Build])

## [0.3.2] - 2017-08-23

### Added

* Improved style and responsiveness

### Changed

* Refactored AJAX web worker for improved error handling
* Improvement deployment process to help us prepare for new features
* Improved use of History API by Explorer component

### Test Coverage: 5.55% ([0.3.2 Coverage Report])

### Bundle Size: ~ 1.5 MB ([0.3.2 Bundle Size Report])

### Production Build: ([0.3.2 Build])

## [0.3.1] - 2017-08-18

### Added

* Colors! The app now has sass through the use of sophisticated SCSS mixins and functions. This is implemented on the Summary page and provides us a strong foundation for expanded use of colors in the future.
* Created a new Inspector element for the explorer view that is React Fiber ready and allows faster searching across a large corpus of metrics. Search time has gone from ~3 seconds to near instant.
* The Explorer is now route driven to allow users to send each other specific views by copy/pasting the URL.
* The edge port now properly shows 443 or 80 depending on if TLS is used.
* Large numbers are not styled appropriately based on operating system and browser locale settings. For example, this means that one thousand point one is 1,000.1 in the US and 1.000,1 in Germany.

### Changed

* Modified Webpack config to use prepacked UglifyJS
* Improved the mock GM-Fabric-JVM endpoint, including fixing the threads endpoint, adding a single randomized element to ensure that the threads components were dynamically updating as expected, and providing a means to simulate a microservice not reporting any known HTTP/HTTPS routes
* Updated numerous dependencies. Most significantly, this including updating to React 16.0.0-beta.5 to allow us a means to troubleshoot UI components that are incompatible with the new React Fiber architecture.

### Removed

* Removed dependencies on JSON-Inspector and UglifyJS

### Test Coverage: 3.29% ([0.3.1 Coverage Report])

### Bundle Size: ~ 1.5 MB ([0.3.1 Bundle Size Report])

### Production Build: ([0.3.1 Build])

## [0.3.0] - 2017-08-10

### Added

* Significant amounts of UX polish
* Added footer
* Back button in sidebar can now be configured to point to a target URL via the backButtonUrl head attribute
* Added numerous heads-up vitals to the summary component

### Changed

* Fixed a Local Storage Bug
* Significantly changed the routes component to make it easier to diagnose issues and dive in for a closer look
* Set the default polling rate to 5 seconds
* Changed the default runtime to JVM, as this is the only currently supported runtime

### Removed

* Although moving and resizing grids was pretty cool, this functionality has been disabled until we have further enhanced the tools to create, edit, and delete dashboards, including defining new charts.

### Test Coverage: 3.35% ([0.3.0 Coverage Report])

### Bundle Size: ~ 1.5 MB ([0.3.0 Bundle Size Report])

### Production Build: ([0.3.0 Build])

## [0.2.1] - 2017-08-04

### Added

* Implemented Prettier for CSS
* Added Dygraphs, Worker-Loader, PromiseWorker, node-sass, sass-loader

### Changed

* Modified Graphite and other components in docker-compose infrastructure
* Ejected from Create React App
* Updated WebPack to 3.x and a bunch of other minor point releases
* Refactored stylesheet source from from less to scss
* Reimplemented GMLineChart using dygraphs
* Reimplemented AJAX and LocalStorage functionality as Web Workers
* Substantially refactored utils to use the simpler native dygraph structure
* Set nav cards to open by default if drawer exists
* Fall back to Hash History to preserve JS source maps.

### Removed

* Removed Prometheus from docker-compose infrastructure
* Removed Stylelint, Recharts

### Test Coverage: 3.5% ([0.2.1 Coverage Report])

### Bundle Size: ~ 1.4 MB ([0.2.1 Bundle Size Report])

### Production Build: ([0.2.1 Build])

## [0.2.0] - 2017-07-28

### Added

* Added preliminary docker-compose infrastructure for developing against Envoy and a timeseries database
* Added breadcrumbs and a new bar at the top of the main view
* Added summary and instance links (currently mocked out) at the top of the new sidebar

### Changed

* Replaced horizontal nav with vertical sidebar style nav
* Nav cards now place metrics and sparklines in a drawer that can be collapsed or opened
* Nav cards now can render icons from UIKit 3
* Moved settings to an icon at the new bar at the top of the main view
* Restored active nav highlighting regression introduced by React Router v4 update
* Updated README with new information about use of Docker during development

### Test Coverage: 3.7% ([0.2.0 Coverage Report])

## [0.1.1] - 2017-07-21

### Added

* Added Prettier with default settings, refactored all source JS code, and set a pre-commit hook for Prettier and stylelint
* Add text to README about a workaround if Jest fails test unexpectedly

### Changed

* Updated the CircleCI config to follow version 2 standards
* Changed from `jest-junit-reporter` to `jest-junit` an alternate junior formatter for Jest test results
* Changed the production build process and tooling to fix issues with deep React Router routes interfering with JS bundle loading
* Updated `react-scripts` to 1.0.10
* Resolved outstanding ESLINT errors

### Removed

* Removed static React components built for Grey Matter Fabric Go microservices
* Removed ESLint rules that are now handled by Prettier

### Test Coverage: 4% ([0.1.1 Coverage Report])

## [0.1.0] - 2017-07-18

### Added

* Generated app using Create React App, adding Redux, React-Redux, React-Router, Jumpstate, UIKit 3, Recharts, Sparklines, less, stylelint
* Added scraper to ingest metrics from a Finagle metrics.json file complete with user configurable period.
* Created various utility functions to manipulate timeseries data.
* Created a system for generating dashboards from state persisted as JSON
* Created a general purpose grid system that allows resize-able drag-and-dropable chart
* Created a handful of generate purpose charts
* Created hand-crafted charts and dashboards for summary metrics, routes, and stack traces
* Created a general-purpose Explorer that displays a line chart for any arbitrary metric
* Wrote several unit tests
* Created a CircleCI CI pipeline with JUNIT reporting and Istanbul code coverage reporting
* Created BASH deployment scripts that allow for nesting in a deep route
* Wrote a README explaining how to use the dashboard

### Test Coverage: 2%

[unreleased]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v1.0.2...v1.0.3
[1.0.3 coverage report]: https://2841-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[1.0.3 bundle size report]: https://2841-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[1.0.3 build]: https://2841-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[1.0.2]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v1.0.1...v1.0.2
[1.0.2 coverage report]: https://2548-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[1.0.2 bundle size report]: https://2548-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[1.0.2 build]: https://2548-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[1.0.1]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v1.0.0...v1.0.1
[1.0.1 coverage report]: https://2278-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[1.0.1 bundle size report]: https://2278-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[1.0.1 build]: https://2278-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[1.0.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.9.1...v1.0.0
[1.0.0 coverage report]: https://2176-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[1.0.0 bundle size report]: https://2176-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[1.0.0 build]: https://2176-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.9.1]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.9.0...v0.9.1
[0.9.1 coverage report]: https://1928-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.9.1 bundle size report]: https://1928-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.9.1 build]: https://1928-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.9.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.8.1...v0.9.0
[0.9.0 coverage report]: https://1649-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.9.0 bundle size report]: https://1649-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.9.0 build]: https://1649-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.8.1]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.8.0...v0.8.1
[0.8.1 coverage report]: https://1310-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.8.1 bundle size report]: https://1310-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.8.1 build]: https://1310-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.8.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.7.1...v0.8.0
[0.8.0 coverage report]: https://1254-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.8.0 bundle size report]: https://1254-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.8.0 build]: https://1254-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.7.1]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.7.0...v0.7.1
[0.7.1 coverage report]: https://1014-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.7.1 bundle size report]: https://1014-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.7.1 build]: https://1014-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.7.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.6.0...v0.7.0
[0.7.0 coverage report]: https://948-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.7.0 bundle size report]: https://948-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.7.0 build]: https://948-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.6.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.5.0...v0.6.0
[0.6.0 coverage report]: https://781-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.6.0 bundle size report]: https://781-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.6.0 build]: https://781-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.5.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.4.0...v0.5.0
[0.5.0 coverage report]: https://703-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.5.0 bundle size report]: https://703-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.5.0 build]: https://703-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.4.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.3.3...v0.4.0
[0.4.0 coverage report]: https://682-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.4.0 bundle size report]: https://682-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.4.0 build]: https://682-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.3.3]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.3.3...v0.3.3
[0.3.3 coverage report]: https://653-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.3.3 bundle size report]: https://653-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.3.3 build]: https://653-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.3.2]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.3.1...v0.3.2
[0.3.2 coverage report]: https://606-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.3.2 bundle size report]: https://606-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.3.2 build]: https://606-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.3.1]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.3.0...v0.3.1
[0.3.1 coverage report]: https://538-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.3.1 bundle size report]: https://538-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.3.1 build]: https://538-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.3.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.2.1...v0.3.0
[0.3.0 coverage report]: https://493-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.3.0 bundle size report]: https://493-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.3.0 build]: https://493-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.2.1]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.2.0...v0.2.1
[0.2.1 coverage report]: https://354-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.2.1 bundle size report]: https://354-85883218-gh.circle-artifacts.com/0/home/circleci/repo/bundlesize/report.html
[0.2.1 build]: https://354-85883218-gh.circle-artifacts.com/0/home/circleci/repo/build.tar.gz
[0.2.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.1.1...v0.2.0
[0.2.0 coverage report]: https://309-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.1.1]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/v0.1.0...v0.1.1
[0.1.1 coverage report]: https://258-85883218-gh.circle-artifacts.com/0/home/circleci/repo/coverage/lcov-report/index.html
[0.1.0]: https://github.com/DecipherNow/gm-fabric-dashboard/compare/5a0e78...v0.1.0
