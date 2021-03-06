import * as React from "react";
import "../../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./addNewUser.styles";
import { Alert, Button, Flex, Input, Text } from "@fluentui/react-northstar";
import { UserPicker } from '../MGTPeoplePicker';

export interface IAddNewUserProp {
    updateUser: any;
}


export const AddNewUser = (props: IAddNewUserProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [selectedUser, setSelectedUser] = React.useState<any>();
    const [isError, setIsError] = React.useState<boolean>(false);
    const onUserChange = (e: any) => {
        const result = e.detail && e.detail.length ? e.detail[0] : "";
        setSelectedUser(result);
    };

    const onSave = () => {
        selectedUser ? props.updateUser(false, {
            name: selectedUser.displayName,
            email: selectedUser.mail,
            phone: selectedUser.mobilePhone ?? "",
            type: "internal",
            principalName: selectedUser.userPrincipalName
        }) : setIsError(true);
    };

    return (
        <Flex className={classes.container} column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem", height: "55vh" }}>
            <Text content={t('name')} />
            <Flex styles={{ width: "23em", display: "block" }}>
                <UserPicker
                    showMax={25}
                    selectionMode="single"
                    selectionChanged={onUserChange}
                />
            </Flex>
            <Input styles={{ width: "20em" }} disabled
                label={t('email')} value={selectedUser ?
                    selectedUser.mail : ""}
            />
            <Input styles={{ width: "20em" }} disabled
                label={t('phone')} value={selectedUser ? selectedUser.mobilePhone ?? "" : ""}
            />
            <Flex>
                <Button content={t('savebtnlbl')} onClick={onSave}
                    tinted style={{ marginRight: "10px" }} />
                <Button content={'cancel'} tinted onClick={() => { props.updateUser(true); }}></Button>
            </Flex>
            {isError && <Alert style={{ width: "100%", textAlign: "center" }} danger
                content={`Please select atleast one user`} />}
        </Flex>
    );
};