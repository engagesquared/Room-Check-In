import * as React from "react";
import "../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./home.styles";
import { Flex, Image, Text, Input, Button, SearchIcon } from "@fluentui/react-northstar";
import { QrScanner } from "./qrScanner/qrScanner";

export interface IHomeProps {
    updateCurrentPage: any;
}

export const Home = (props: IHomeProps) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isScan, setIsScan] = React.useState<Boolean>(false);

    return (
        <Flex column gap="gap.small" className={classes.paddingTop}>
            {!isScan ?
                <><Flex className={classes.center}>
                    <Image src="/assets/LogoIcon.svg" />
                </Flex>
                    <Flex className={classes.center}>
                        <Text size="larger" weight="semibold"
                            content={t('applbl')} color="white" />
                    </Flex>
                    <Flex className={`${classes.center} ${classes.paddingTop}`} >
                        <Input styles={{ width: "20em" }} inverted icon={<SearchIcon />} placeholder={t('roomSearchPlaceholder')} />
                    </Flex>
                    <Flex className={classes.center}>
                        <Button content={t('roomSearchbtnlbl')} onClick={() => {
                            props.updateCurrentPage("UserSelection");
                        }}
                            tinted className={classes.buttonWidth} />
                    </Flex>
                    <Flex className={classes.center}>
                        <Text content={t('roomSearchScanQRCode')}
                            onClick={() => setIsScan(true)} color="white" />
                    </Flex></> :
                <QrScanner updateCurrentPage={props.updateCurrentPage}></QrScanner>
            }
        </Flex>
    );
};