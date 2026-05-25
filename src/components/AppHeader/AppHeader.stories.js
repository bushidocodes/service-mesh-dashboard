import React from "react";
import StoryRouter from "storybook-router";

import { storiesOf } from "@storybook/react";
import { withKnobs, text, boolean, object } from "@storybook/addon-knobs/react";

import AppToolBar from "./components/AppToolBar";
import Tab from "./components/Tab";
import TabNav from "./components/TabNav";
import TabGroup from "./components/TabGroup";
import AppHeaderContainer from "./components/AppHeaderContainer";
import Banner from "./components/Banner";

const mockTabs = [
  {
    path: "/",
    icon: "Summary",
    title: "Summary",
    details: [{ name: "Uptime", value: "15 Days" }]
  },
  {
    path: "go",
    icon: "Functions",
    title: "Functions",
    details: [{ name: "Functions", value: "24" }],
    graphData: [6, 2, 5.2, 8, 3, 6, 5.37, 7, 3.3, 8]
  },
  {
    path: "go",
    icon: "Threads",
    title: "Threads",
    details: [{ name: "Threads", value: "26" }],
    graphData: [6, 2, 5.2, 8, 3, 6, 5.37, 7, 3.3, 8]
  },
  {
    path: "go",
    icon: "Http",
    title: "HTTP",
    details: [{ name: "Error Rate", value: "0.121%" }],
    graphData: [6, 2, 5.2, 8, 3, 6, 5.37, 7, 3.3, 8]
  },
  {
    path: "go",
    icon: "JVM",
    title: "JVM",
    details: [{ name: "Memory Used", value: "116 MB" }],
    graphData: [6, 2, 5.2, 8, 3, 6, 5.37, 7, 3.3, 8]
  }
];

const mockSecondaryTabs = [
  {
    path: "/",
    icon: "Explorer",
    title: "Explorer"
  },
  {
    path: "go",
    icon: "Configuration",
    title: "Configuration"
  }
];

const mockToolbarButtons = [
  {
    path: "/settings",
    icon: "cog",
    label: "Settings"
  },
  {
    path: "#",
    icon: "bell",
    label: "Alerts"
  }
];

const bannerExtras = [
  {
    path: "/settings",
    title: "Extra, Extra, Read all about it"
  }
];

storiesOf("App Header", module)
  .addDecorator(withKnobs)
  .addDecorator(StoryRouter())
  .add("AppToolbar", () => (
    <AppToolBar
      hideRoot={boolean("Hide Root Breadcrumb", true)}
      pathname={text("pathname", "/stuff/things")}
      appVersion={text("Version Number", "0.7.1")}
      toolbarButtons={object("Toolbar Buttons", mockToolbarButtons)}
    />
  ))
  .add("Tab Navigation", () => {
    return (
      <TabNav>
        {mockTabs.map((item) => {
          return (
            <Tab
              key={item.title}
              href={item.path}
              icon={item.icon}
              lines={item.details}
              title={item.title}
              chartData={item.chartData}
            />
          );
        })}
        <TabGroup>
          {mockSecondaryTabs.map((item) => {
            return (
              <Tab
                key={item.title}
                href={item.path}
                icon={item.icon}
                title={item.title}
              />
            );
          })}
        </TabGroup>
      </TabNav>
    );
  })
  .add("Banner", () => (
    <Banner
      hideBackground={boolean("Hide Banner Background", false)}
      title={text("Section Title", "Security Service: 00ab2a")}
      extras={object("Banner Extras", bannerExtras)}
    />
  ))
  .add("Default App Header", () => {
    return (
      <AppHeaderContainer>
        <AppToolBar
          hideRoot={boolean("Hide Root Breadcrumb", true)}
          pathname={text("pathname", "/stuff/things")}
          appVersion={text("Version Number", "0.7.1")}
          toolbarButtons={object("Toolbar Buttons", mockToolbarButtons)}
        />{" "}
        <Banner
          hideBackground={boolean("Hide Banner Background", false)}
          title={text("Section Title", "Security Service: 00ab2a")}
          extras={object("Banner Extras", bannerExtras)}
        />
        <TabNav>
          {mockTabs.map((item) => {
            return (
              <Tab
                key={item.title}
                href={item.path}
                icon={item.icon}
                lines={item.details}
                title={item.title}
                chartData={item.chartData}
              />
            );
          })}
          <TabGroup>
            {mockSecondaryTabs.map((item) => {
              return (
                <Tab
                  key={item.title}
                  href={item.path}
                  icon={item.icon}
                  title={item.title}
                />
              );
            })}
          </TabGroup>
        </TabNav>
      </AppHeaderContainer>
    );
  });

// <AppHeader
//   tabs={object("Tabs", mockTabs)}
//   bannerTitle={"Security Service: 00ab2a"}
//   bannerExtras={object("Banner Extras", bannerExtras)}
//   secondaryTabs={object("Secondary Tabs", mockSecondaryTabs)}
//   hideRoot={boolean("Hide Root Breadcrumb", true)}
//   pathname={text("pathname", "/stuff/things")}
//   AppVersion={text("Version Number", "0.7.1")}
//   toolbarButtons={object("Toolbar Buttons", mockToolbarButtons)}
// />
