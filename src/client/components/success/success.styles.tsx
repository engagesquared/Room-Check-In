import { ITheme } from "../../providers/ITheme";

import { createUseStyles } from "react-jss";
export const useStyles = createUseStyles((theme: ITheme) => {
    return {
        paddingTop: {
            paddingTop: "10em",
        },
        center: {
            margin: "0 auto",
        },
        buttonWidth: {
            width: "20em",
        },
        successMsg: {
            marginTop: "5em",
            maxWidth: "15.5em"
        },
        textWidth: {
            maxWidth: "15.5em"
        },
        buttonAlignment: {
            position: "absolute",
            height: "calc(100% - 170px)",
            marginLeft: "calc(50% - 140px)"
        },
        '@global': {
            body: {
                background: "#5358B3"
            },
            input: {
                fontSize: "16px"
            }
        }
    };
});
