import * as React from "react";
import "../../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./addNewVisitor.styles";
import { Button, Flex, Input, Alert, SearchIcon, Text, Form, FormButton } from "@fluentui/react-northstar";

export interface IAddNewVisitorProp {
    updateUser: any;
}

export const AddNewVisitor = (props: IAddNewVisitorProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [name, SetName] = React.useState<string>('');
    const [email, SetEmail] = React.useState<string>('');
    const [phone, SetPhone] = React.useState<string>('');
    const [isError, setIsError] = React.useState<boolean>(false);

    const onSave = () => {
        if (name && email && phone) {
            props.updateUser(false, { name: name, email: email, phone: phone, type: "external" });
        } else {
            setIsError(true);
        }
    };

    return (
        <Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem", height: "55vh" }}>
            <Form onSubmit={onSave} className={"childMarginBottom"}>
                <Input styles={{ width: "23em" }} required
                    label={t('name')}
                    onChange={(ev: any, p) => {
                        SetName(p ? p.value : "");
                    }}
                />
                <Input styles={{ width: "23em" }} required type="email"
                    label={t('email')} onChange={(ev: any, p) => {
                        SetEmail(p ? p.value : "");
                    }}
                />
                <Input styles={{ width: "23em" }} required type="tel"
                    pattern="/^(?:\(?(?:\+?61|0)4\)?(?:[ -]?[0-9]){7}[0-9]$/"
                    label={t('phone')} onChange={(ev: any, p) => {
                        SetPhone(p ? p.value : "");
                    }}
                />
                <Flex>
                    <FormButton content={t('savebtnlbl')} tinted
                        style={{ marginRight: "10px" }} />
                    <Button content={t('cancelbtnlbl')} tinted
                        onClick={() => { props.updateUser(true); }}></Button>
                </Flex>
            </Form>
            {isError && <Alert style={{ width: "100%", textAlign: "center" }} danger
                content={t('mandatoryMsglbl')} />}
        </Flex>
    );
};