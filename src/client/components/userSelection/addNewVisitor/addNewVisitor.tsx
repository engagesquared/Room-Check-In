import * as React from "react";
import "../../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./addNewVisitor.styles";
import { Button, Flex, Input, SearchIcon, Text } from "@fluentui/react-northstar";

export interface IAddNewVisitorProp {
    updateUser: any;
}


export const AddNewVisitor = (props: IAddNewVisitorProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [name, SetName] = React.useState<string>('');
    const [email, SetEmail] = React.useState<string>('');
    const [phone, SetPhone] = React.useState<string>('');

    return (
        <Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem", height: "55vh" }}>
            <Input styles={{ width: "20em" }}
                label={t('name')}
                onChange={(ev: any, p) => {
                    SetName(p ? p.value : "");
                }}
            />
            <Input styles={{ width: "20em" }}
                label={t('email')} onChange={(ev: any, p) => {
                    SetEmail(p ? p.value : "");
                }}
            />
            <Input styles={{ width: "20em" }}
                label={t('phone')} onChange={(ev: any, p) => {
                    SetPhone(p ? p.value : "");
                }}
            />
            <Button content={t('savebtnlbl')} onClick={() => {
                props.updateUser({ name: name, email: email, phone: phone });
            }}
                tinted className={classes.buttonWidth} />
        </Flex>
    );
};