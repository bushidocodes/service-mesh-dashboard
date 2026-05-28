import React from "react";

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

export default {
  title: "App Header"
};

export const AppToolbar = {
  render: () => (
    <AppToolBar
      hideRoot={true}
      pathname="/stuff/things"
      appVersion="0.7.1"
      toolbarButtons={mockToolbarButtons}
    />
  )
};

export const TabNavigation = {
  render: () => (
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
  )
};

export const BannerStory = {
  render: () => (
    <Banner
      hideBackground={false}
      title="Security Service: 00ab2a"
      extras={bannerExtras}
    />
  )
};

export const DefaultAppHeader = {
  render: () => (
    <AppHeaderContainer>
      <AppToolBar
        hideRoot={true}
        pathname="/stuff/things"
        appVersion="0.7.1"
        toolbarButtons={mockToolbarButtons}
      />{" "}
      <Banner
        hideBackground={false}
        title="Security Service: 00ab2a"
        extras={bannerExtras}
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
  )
};
