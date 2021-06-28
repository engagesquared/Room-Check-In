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
            <Flex className={`${classes.center} ${classes.successMsg}`} >
                <Text align="center"
                    content={t('successMsglbl').replace('{currentUserName}', props.currentUserName)}
                    color="white" />
            </Flex>
            <Flex className={`${classes.center} ${classes.textWidth}`} >
                <Text size="largest"
                    content={`${props.selectedLocation}`} color="white" />
            </Flex>
            <Flex className={`${classes.center} ${classes.buttonAlignment}`}
                hAlign="center" vAlign="end">
                <Button content={t('donebtnlbl')} onClick={() => {
                    props.updateCurrentPage("Home");
                }} tinted className={classes.buttonWidth} />
            </Flex>
        </Flex>
    );
};