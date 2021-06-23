import * as React from "react";
import "../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./userSelection.styles";
import { Flex, Checkbox, Text, Avatar, Button, Divider } from "@fluentui/react-northstar";
import { AddNewUser } from "./addNewUser/addNewUser";
import { AddNewVisitor } from "./addNewVisitor/addNewVisitor";

export interface IUserSelectionProp {
    currentUserName: string;
    selectedLocation: string;
    updateCurrentPage: any;
}

export const UserSelection = (props: IUserSelectionProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [displayAddUser, setDisplayAddUser] = React.useState<Boolean>(false);
    const [displayVisitor, setDisplayVisitor] = React.useState<Boolean>(false);
    const [users, setUsers] = React.useState<{
        name: string,
        image?: string
    }[]>([{ name: 'Ray Tanaka', image: 'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/RobertTolbert.jpg' },
    { name: 'Beth Davies', image: 'https://fabricweb.azureedge.net/fabric-website/assets/images/avatar/ElviaAtkins.jpg' }]);

    const updateUser = (userDetail: { name: string, email: string, phone: string }) => {
        let tempUsers = users;
        tempUsers.push({ name: userDetail.name, image: '' });
        setUsers(tempUsers);
        setDisplayVisitor(false);
        setDisplayAddUser(false);
    };

    return (
        <Flex column gap="gap.small">
            <Flex column gap="gap.small" style={{ padding: "2rem" }}>
                <Text size="large" weight="bold" content={`${props.currentUserName}`} />
                <Text content={`Employee Number: 58372`} />
                <Text content={`jane.smith@optus.com.uk`} />
            </Flex>
            <Divider size={1} />
            {!displayAddUser && !displayVisitor ?
                <Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem", height: "55vh" }}>
                    <Text size="large" weight="bold" content={`Are these colleagues with you?`} />
                    {users.map((user) =>
                        <Flex vAlign="center">
                            <Checkbox />
                            {user.image ? <Avatar image={user.image} /> : <Avatar name={user.name} />}
                            <Text style={{ paddingLeft: "1em" }} content={user.name} />
                        </Flex>
                    )}
                    <Text color="brand" content="+ Add another person"
                        onClick={() => { setDisplayAddUser(true); setDisplayVisitor(false); }} />
                    <Text color="brand" content="+ Add visitor"
                        onClick={() => { setDisplayAddUser(false); setDisplayVisitor(true); }} />
                </Flex> :
                displayAddUser ? <AddNewUser></AddNewUser> :
                    displayVisitor ? <AddNewVisitor updateUser={updateUser}></AddNewVisitor> : <></>
            }
            <Flex column className={classes.center} hAlign="center" vAlign="end"
                style={{
                    background: "#F9F9F9",
                    padding: "1%",
                    width: "100%"
                }}>
                <Text size="large" weight="bold" style={{ padding: "1em" }}
                    content={`Location: ${props.selectedLocation}`} />
                <Button primary content="Check-in" onClick={() => {
                    props.updateCurrentPage("Success");
                }} style={{ width: "20em" }} />
            </Flex>
        </Flex>
    );
};