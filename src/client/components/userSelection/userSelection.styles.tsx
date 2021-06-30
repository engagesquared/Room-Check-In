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
        pointer: {
            cursor: "pointer",
        },
        paddingFlex: {
            padding: "2rem"
        },
        paddingHeight: {
            padding: "0 2rem 2rem 2rem",
            height: "55vh"
        },
        locationPadding:{
            padding: "1em"
        },
        errorMsg:{
            width: "100%", textAlign: "center"
        },
        bottomSection:{
            background: "#F9F9F9",
            padding: "1%",
            width: "100%"
        },
        avatar: {
            marginRight: "8px"
        },
        '@global': {
            body: {
                background: "#FFFFFF"
            },
            input: {
                fontSize: "16px"
            }
        }
    };
});
