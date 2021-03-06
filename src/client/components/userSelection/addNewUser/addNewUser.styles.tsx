import { ITheme } from "../../../providers/ITheme";

import { createUseStyles } from "react-jss";
export const useStyles = createUseStyles((theme: ITheme) => {
    return {
        container: {
            "& mgt-people-picker": {
                "--input-border": "none",
                "--input-background-color": "#f5f5f5",
            }
        },
        paddingTop: {
            paddingTop: "10em",
        },
        center: {
            margin: "0 auto",
        },
        buttonWidth: {
            width: "15.5em",
        },
        '@global': {
            body: {
                background: "#FFFFFF"
            },
            input: {
                fontSize: "16px",
                width: "20em"
            }
        }
    };
});
