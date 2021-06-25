import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import * as microsoftTeams from "@microsoft/teams-js";
import { useTeams } from "msteams-react-base-component";
import { Provider } from "@fluentui/react-northstar";
import { Home } from "../components/home/home";
import { Success } from "../components/success/success";
import { UserSelection } from "../components/userSelection/userSelection";
import { Providers } from "@microsoft/mgt-react";
import { MgtTokenProvider } from "../providers/MgtProvider";
import { getLoggedInUserDetails } from "../services/UserService";
import { getClientSideToken, getServerSideToken } from "../services/AuthService";
import { IUser } from "../../interfaces/IUser";
import { constants } from "../../constants";
import { appInsightsAppSetting } from "../../appSettings";
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

const provider = new MgtTokenProvider();
Providers.globalProvider = provider;

/**
 * Implementation of the Room Check-In content page
 */
export const RoomCheckInTab = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();
    const [currentPage, setCurrentPage] = useState<string>('Home');
    const [currentPageData, setCurrentPageData] = useState<any>();
    const [currentUserDetail, setcurrentUserDetail] = useState<IUser>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const appInsights = new ApplicationInsights({
        config: {
            instrumentationKey: appInsightsAppSetting.appInsightsInstrumentationKey,
        }
    });
    appInsights.loadAppInsights();
    appInsights.trackPageView();

    useEffect(() => {
        if (inTeams === true) {
            (async () => {
                const clientToken = await getClientSideToken();
                microsoftTeams.appInitialization.notifySuccess();
                const decoded: { [key: string]: any; } = jwtDecode(clientToken) as { [key: string]: any; };
                setName(decoded!.name);

                const serverToken = await getServerSideToken();
                axios.interceptors.request.use((config) => {
                    config.headers[constants.APP_ACCESS_TOKEN_HEADER] = serverToken;
                    return config;
                });
                setIsLoading(false);
            })();
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.entityId);
        }
    }, [context]);

    useEffect(() => {
        if (!isLoading) {
            (async () => {
                const currentUserDetail = await getLoggedInUserDetails();
                setcurrentUserDetail(currentUserDetail);
            })();
        }
    }, [isLoading, getLoggedInUserDetails]);

    const updatePage = (currentPage: string, data?: any) => {
        setCurrentPage(currentPage);
        setCurrentPageData(data);
    };

    const renderPage = (pageName: string) => {
        switch (pageName) {
            case 'Home':
                return (<Home updateCurrentPage={updatePage} />);
            case 'UserSelection':
                return (<UserSelection updateCurrentPage={setCurrentPage} currentUserName={name ? name : ""}
                    selectedLocationDetail={currentPageData}
                    currentUserDetail={currentUserDetail as IUser} />);
            case 'Success':
                return (<Success updateCurrentPage={setCurrentPage} currentUserName={name ? name : ""}
                    selectedLocation={"OSC.AG.MR21"} />)
            default:
                break;
        }
    }

    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Provider theme={theme} style={{ background: currentPage === "UserSelection" ? "#FFFFFF" : "#5358B3" }}>
            <React.Suspense fallback="loading">
                {renderPage(currentPage)}
            </React.Suspense>
        </Provider>
    );
};
