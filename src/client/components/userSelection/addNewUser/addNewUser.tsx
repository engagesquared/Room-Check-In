import * as React from "react";
import "../../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./addNewUser.styles";
import { Flex } from "@fluentui/react-northstar";
import { PeoplePicker } from '@microsoft/mgt-react';

export interface IAddNewUserProp {

}


export const AddNewUser = (props: IAddNewUserProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem", height: "55vh" }}>
            <PeoplePicker />
        </Flex>
    );
};