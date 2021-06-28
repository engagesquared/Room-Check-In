import { ITheme } from "../../providers/ITheme";

import { createUseStyles } from "react-jss";
export const useStyles = createUseStyles((theme: ITheme) => {
    return {
        container: {
            '& ui-alert': {
                width: "20em",
                textAlign: "center"
            }
        },
        alertAlignment: {
            width: "20em",
            textAlign: "center"
        },
        paddingTop: {
            paddingTop: "10em",
        },
        center: {
            margin: "0 auto",
        },
        buttonWidth: {
            width: "20em",
        },
        pointer: {
            cursor: "pointer",
        },
        '@global': {
            body: {
                background: "#5358B3"
            },
            input: {
                width: "calc(17em + 7px)",
                fontSize: "16px"
            }
        }

    };
});
