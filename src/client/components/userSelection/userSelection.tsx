import * as React from "react";
import "../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./userSelection.styles";
import { Flex, Checkbox, Text, Avatar, Button, Divider } from "@fluentui/react-northstar";
import { PeoplePicker } from "@microsoft/mgt-react";

export interface IUserSelectionProp {
    currentUserName: string;
    selectedLocation: string;
    updateCurrentPage: any;
}

export const UserSelection = (props: IUserSelectionProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <Flex column gap="gap.small">
            <Flex column gap="gap.small" style={{ padding: "2rem" }}>
                <Text size="large" weight="bold" content={`${props.currentUserName}`} />
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
                {/* <PeoplePicker placeholder=" " selectionMode="single" /> */}
            </Flex>
            <Flex column className="center" hAlign="center" vAlign="end"
                style={{
                    position: "absolute",
                    top: "calc(100% - 80px)",
                    background: "#F9F9F9",
                    padding: "1%",
                    width: "100%"
                }}>
                <Text size="large" weight="bold" content={`Location: ${props.selectedLocation}`} />
                <Button primary content="Check-in" onClick={() => {
                    props.updateCurrentPage("Success");
                }} style={{ width: "20em" }} />
            </Flex>
        </Flex>
    );
};