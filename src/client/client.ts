// Default entry point for client scripts
// Automatically generated
// Please avoid from modifying to much...
import * as ReactDOM from "react-dom";
import * as React from "react";
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { appInsightsAppSetting } from "../appSettings";

const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: appInsightsAppSetting.appInsightsInstrumentationKey,
    }
});
appInsights.loadAppInsights();
appInsights.trackPageView();

export const render = (type: any, element: HTMLElement) => {
    ReactDOM.render(React.createElement(type, {}), element);
};
// Automatically added for the roomCheckInTab tab
export * from "./roomCheckInTab/RoomCheckInTab";
export * from "./roomCheckInTab/RoomCheckInTabConfig";
export * from "./roomCheckInTab/RoomCheckInTabRemove";
