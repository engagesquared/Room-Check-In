import { ITheme } from "../../../providers/ITheme";

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
            width: "15.5em",
        },
        '@global': {
            body: {
                background: "#FFFFFF"
            },
            input: {
                width: "20em",
                fontSize: "16px"
            }
        }
    };
});
