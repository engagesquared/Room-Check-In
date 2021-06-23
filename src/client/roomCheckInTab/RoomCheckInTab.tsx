import * as React from "react";
import {
    SearchIcon, Flex, Text, Provider,
    Image, Input, Button, Divider, Avatar, Checkbox
} from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import jwtDecode from "jwt-decode";
import { Home } from "../components/home/home";
import { Success } from "../components/success/success";
import { UserSelection } from "../components/userSelection/userSelection";
import { Providers } from "@microsoft/mgt";
import { MgtTokenProvider } from "../providers/MgtProvider";
import { getClientSideToken } from "../services/AuthService";

const provider = new MgtTokenProvider();
Providers.globalProvider = provider;

/**
 * Implementation of the Room Check-In content page
 */
export const RoomCheckInTab = () => {

    const [{ inTeams, theme, context, themeString }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();
    const [showSuccess, setShowSuccess] = useState<Boolean>(false);
    const [showSelectedRoom, setShowSelectedRoom] = useState<Boolean>(false);

    useEffect(() => {
        if (inTeams === true) {
            (async () => {
                const token = await getClientSideToken();
                const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                setName(decoded!.name);
            })()
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.entityId);
        }
    }, [context]);

    /**
      * The render() method to create the UI of the tab
      */
    return (
        <Provider theme={theme} style={{ background: showSelectedRoom ? "#FFFFFF" : "#5358B3" }}>
            {!showSuccess && !showSelectedRoom &&
                <Flex column gap="gap.small" style={{ paddingTop: "10em" }}>
                    <Flex className="center">
                        <Image src="/assets/LogoIcon.png" />
                    </Flex>
                    <Flex className="center">
                        <Text size="larger" weight="semibold" content="Optus Check-in App" color="white" />
                    </Flex>
                    <Flex className="center" style={{ marginTop: "10em" }} >
                        <Input inverted icon={<SearchIcon />} placeholder="Search for a room" />
                    </Flex>
                    <Flex className="center">
                        <Button content="Search room" onClick={() => {
                            setShowSelectedRoom(true);
                            setShowSuccess(false);
                        }}
                            tinted style={{ width: "15.5em" }} />
                    </Flex>
                    <Flex className="center">
                        <Text content="Or Scan a QR code" color="white" />
                    </Flex>
                </Flex>
            }
            {!showSuccess && showSelectedRoom &&
                <Flex column gap="gap.small">
                    <Flex column gap="gap.small" style={{ padding: "2rem" }}>
                        <Text size="large" weight="bold" content={`Jane Smith`} />
                        <Text content={`Employee Number: 58372`} />
                        <Text content={`jane.smith@optus.com.uk`} />
                    </Flex>
                    <Divider size={1} />
                    <Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem" }}>
                        <Text size="large" weight="bold" content={`Are these colleagues with you?`} />
                        <Flex>
                            <Checkbox />
                            <Avatar image="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/RobertTolbert.jpg" />
                            <Text content="Ray Tanaka" />
                        </Flex>
                        <Flex>
                            <Checkbox />
                            <Avatar image="https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/ElviaAtkins.jpg" />
                            <Text content="Beth Davies" />
                        </Flex>
                        <Text color="brand" content="+ Add another person" />
                    </Flex>
                    <Flex column className="center" hAlign="center" vAlign="end"
                        style={{
                            position: "absolute",
                            top: "calc(100% - 80px)",
                            background: "#F9F9F9",
                            padding: "1%",
                            width: "100%"
                        }}>
                        <Text size="large" weight="bold" content={`Location: OSC.AG.MR21`} />
                        <Button primary content="Check-in" onClick={() => {
                            setShowSuccess(true);
                            setShowSelectedRoom(false);
                        }} style={{ width: "20em" }} />
                    </Flex>
                </Flex>
            }
            {
                showSuccess && !showSelectedRoom &&
                <Flex column gap="gap.small" style={{ paddingTop: "10em" }}>
                    <Flex className="center">
                        <Image src="/assets/Success.png" />
                    </Flex>
                    <Flex className="center" style={{ marginTop: "5em", maxWidth: "15.5em" }} >
                        <Text align="center" content={`Thanks Jane, you have checked into room`} color="white" />
                    </Flex>
                    <Flex className="center" style={{ maxWidth: "15.5em" }}>
                        <Text size="largest"
                            content={`OSC.AG.MR21`} color="white" />
                    </Flex>
                    <Flex className="center" hAlign="center" vAlign="end"
                        style={{
                            position: "absolute",
                            height: "calc(100% - 180px)",
                            marginLeft: "calc(50% - 140px)"
                        }}>
                    </Flex>
                    <Button content="Done" onClick={() => {
                        setShowSuccess(false);
                        setShowSelectedRoom(false);
                    }} tinted style={{ width: "20em" }} />
                </Flex>
            }
        </Provider >
    );
};
