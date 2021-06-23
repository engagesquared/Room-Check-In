import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
import { Home } from "../components/home/home";
import { Success } from "../components/success/success";
import { UserSelection } from "../components/userSelection/userSelection";
import { Providers } from "@microsoft/mgt-react";
import { MgtTokenProvider } from "../providers/MgtProvider";
import { getLoggedInUserDetails } from "../services/UserService";
import { IUser } from "../../interfaces/IUser";

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

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (token: string) => {
                    const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                    setName(decoded!.name);
                    microsoftTeams.appInitialization.notifySuccess();
                },
                failureCallback: (message: string) => {
                    setError(message);
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [process.env.AUTH_APP_URI as string]
            });
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
        (async () => {
            const currentUserDetail = await getLoggedInUserDetails();
            setcurrentUserDetail(currentUserDetail);
        })();
    }, [getLoggedInUserDetails]);

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
        <Provider theme={theme} style={{
            background: currentPage === "UserSelection"
                ? "#FFFFFF" : "#5358B3"
        }}>
            <React.Suspense fallback="loading">
                {renderPage(currentPage)}
            </React.Suspense>
        </Provider>
    );
};
