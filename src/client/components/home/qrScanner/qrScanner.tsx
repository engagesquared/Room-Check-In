import * as React from "react";
import "../../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./qrScanner.styles";
import { Button, Flex } from "@fluentui/react-northstar";
import * as microsoftTeams from "@microsoft/teams-js";
// import QrReader from 'react-qr-scanner';

export interface IQrScannerProps {
    updateCurrentPage: any;
}

export const QrScanner = (props: IQrScannerProps) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [text, setText] = React.useState<string>('');
    const onScan = (scanneddata) => {
        alert(scanneddata);
    }
    const handleError = (err) => {
        console.error(err)
    }
    const config: microsoftTeams.media.BarCodeConfig = {
        timeOutIntervalInSec: 30
    };
    React.useEffect(() => {

        microsoftTeams.media.scanBarCode((error: microsoftTeams.SdkError, decodedText: string) => {
            if (error) {
                if (error.message) {
                    setText(" ErrorCode: " + error.errorCode + error.message);
                } else {
                    setText(" ErrorCode: " + error.errorCode);
                }
            } else if (decodedText) {
                setText(decodedText);
            }
        }, config)
    });

    return (
        <Flex column gap="gap.small" className={classes.paddingTop}>
            {/* <QrReader
                delay={100}
                style={{
                    height: 240,
                    width: 320,
                }}
                onError={handleError}
                onScan={onScan}
            /> */}
            <Button content={t('roomSearchbtnlbl')} onClick={() => {
                alert(text);
                props.updateCurrentPage("UserSelection");
            }}
                tinted className={classes.buttonWidth} />
        </Flex>
    );
};