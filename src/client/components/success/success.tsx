import * as React from "react";
import "../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./success.styles";
import { Flex, Image, Text, Input, Button, SearchIcon } from "@fluentui/react-northstar";

export interface ISuccessProp {
    currentUserName: string;
    selectedLocation: string;
    updateCurrentPage: any;
}

export const Success = (props: ISuccessProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <Flex column gap="gap.small" className={classes.paddingTop}>
            <Flex className={classes.center}>
                <Image src="/assets/Success.svg" />
            </Flex>
            <Flex className={classes.center} style={{ marginTop: "5em", maxWidth: "15.5em" }} >
                <Text align="center" content={`Thanks ${props.currentUserName}, you have checked into room`} color="white" />
            </Flex>
            <Flex className={classes.center} style={{ maxWidth: "15.5em" }}>
                <Text size="largest"
                    content={`${props.selectedLocation}`} color="white" />
            </Flex>
            <Flex className={classes.center} hAlign="center" vAlign="end"
                style={{
                    position: "absolute",
                    height: "calc(100% - 170px)",
                    marginLeft: "calc(50% - 140px)"
                }}>
                <Button content="Done" onClick={() => {
                    props.updateCurrentPage("Home");
                }} tinted style={{ width: "20em" }} />
            </Flex>
        </Flex>
    );
};