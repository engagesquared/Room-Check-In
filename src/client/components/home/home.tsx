import * as React from "react";
import "../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./home.styles";
import { Flex, Image, Text, Input, Button, SearchIcon, Alert } from "@fluentui/react-northstar";
import { QrScanner } from "./qrScanner/qrScanner";
import { getRoomByDisplayName, getRoomById } from "../../services/PlacesService";
import * as microsoftTeams from "@microsoft/teams-js";

export interface IHomeProps {
    updateCurrentPage: any;
}

export const Home = (props: IHomeProps) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isScan, setIsScan] = React.useState<Boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [roomname, SetRoomName] = React.useState<string>('');
    const [isError, setIsError] = React.useState<boolean>(false);

    const onSearchPlace = async () => {
        try {
            setIsLoading(true);
            const roomDetails = await getRoomByDisplayName(roomname);
            if (roomDetails) {
                props.updateCurrentPage("UserSelection", roomDetails);
            } else {
                setIsLoading(false);
                setIsError(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const config: microsoftTeams.media.BarCodeConfig = {
        timeOutIntervalInSec: 30
    };

    const onScannedPlace = async (scanedPlace: string | null) => {
        if (scanedPlace) {
            const roomDetails = await getRoomById(scanedPlace);
            if (roomDetails) {
                props.updateCurrentPage("UserSelection", roomDetails);
            } else {
                setIsLoading(false);
                setIsError(true);
            }
        } else {
            setIsLoading(false);
            setIsError(true);
        }
    };

    const onScannerClick = () => {
        microsoftTeams.media.scanBarCode((error: microsoftTeams.SdkError, decodedText: string) => {
            if (error) {
                if (error.message) {
                }
            } else if (decodedText) {
                const urlParams = new URL(decodedText).searchParams;
                const myParam = urlParams.get('location');
                setIsLoading(true);
                onScannedPlace(myParam);
            }
        }, config);
    };


    return (
        <Flex column gap="gap.small" className={`${classes.paddingTop} ${classes.container}`}>
            {!isScan ?
                <><Flex className={classes.center}>
                    <Image src="/assets/LogoIcon.svg" />
                </Flex>
                    <Flex className={classes.center}>
                        <Text size="larger" weight="semibold"
                            content={t('applbl')} color="white" />
                    </Flex>
                    <Flex className={`${classes.center} ${classes.paddingTop}`} >
                        <Input styles={{ width: "20em" }}
                            inverted
                            icon={<SearchIcon />}
                            placeholder={t('roomSearchPlaceholder')}
                            onChange={(ev: any, p) => {
                                setIsError(false);
                                SetRoomName(p ? p.value : "");
                            }} />
                    </Flex>
                    <Flex className={classes.center}>
                        <Button content={t('roomSearchbtnlbl')} onClick={onSearchPlace}
                            tinted className={classes.buttonWidth} loading={isLoading}
                        />
                    </Flex>
                    <Flex className={classes.center}>
                        {isError && <Alert style={{ width: "20em", textAlign: "center" }} danger content="Room not found" />}
                    </Flex>
                    <Flex className={classes.center}>
                        <Text content={t('roomSearchScanQRCode')} className={classes.pointer}
                            onClick={onScannerClick} color="white" />
                    </Flex></> :
                <QrScanner updateCurrentPage={props.updateCurrentPage}></QrScanner>
            }
        </Flex>
    );
};