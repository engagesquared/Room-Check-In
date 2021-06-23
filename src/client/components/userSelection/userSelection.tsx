import * as React from "react";
import "../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./userSelection.styles";
import { Flex, Checkbox, Text, Avatar, Button, Divider } from "@fluentui/react-northstar";
import { AddNewUser } from "./addNewUser/addNewUser";
import { AddNewVisitor } from "./addNewVisitor/addNewVisitor";
import { IUser } from "../../../interfaces/IUser";
import { IRoom } from "../../../interfaces/IRoom";
import { getColleagues } from "../../services/PlacesService";
import { IAttendee } from "../../../interfaces/IAttendee";
import { People } from "@microsoft/mgt-react";

export interface IUserSelectionProp {
    currentUserName: string;
    selectedLocationDetail: IRoom;
    updateCurrentPage: any;
    currentUserDetail: IUser;
}

export const UserSelection = (props: IUserSelectionProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [displayAddUser, setDisplayAddUser] = React.useState<Boolean>(false);
    const [displayVisitor, setDisplayVisitor] = React.useState<Boolean>(false);
    const [users, setUsers] = React.useState<IAttendee[]>([]);


    React.useEffect(() => {
        (async () => {
            if (props.selectedLocationDetail) {
                const currentUserDetail = await getColleagues(props.selectedLocationDetail.emailAddress);
                setUsers(currentUserDetail);
            }
        })();
    }, [getColleagues, props.selectedLocationDetail]);

    const updateUser = (userDetail: { name: string, email: string, phone: string }) => {
        let tempUsers = users;
        let newUserDetail = {
            type: "external",
            status: {
                response: "none",
                time: "0001-01-01T00:00:00Z"
            },
            emailAddress: {
                name: `${userDetail.name}`,
                address: `${userDetail.email}`
            }
        };
        tempUsers.push(newUserDetail);
        setUsers(tempUsers);
        setDisplayVisitor(false);
        setDisplayAddUser(false);
    };

    return (
        <Flex column gap="gap.small">
            <Flex column gap="gap.small" style={{ padding: "2rem" }}>
                <Text size="large" weight="bold" content={`${props.currentUserDetail.displayName}`} />
                <Text content={`Job Title: ${props.currentUserDetail.jobTitle}`} />
                <Text content={`${props.currentUserDetail.mail}`} />
            </Flex>
            <Divider size={1} />
            {!displayAddUser && !displayVisitor ?
                <Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem", height: "55vh" }}>
                    <Text size="large" weight="bold" content={`Are these colleagues with you?`} />
                    {users.map((user) =>
                        <Flex vAlign="center">
                            <Checkbox />
                            {user.type !== "external" ? <People peopleQueries={[user.emailAddress.address]} /> :
                                <Avatar name={user.emailAddress.name} />}
                            <Text content={user.emailAddress.name} />
                        </Flex>
                    )}
                    <Text color="brand" content="+ Add another person" className={classes.pointer}
                        onClick={() => { setDisplayAddUser(true); setDisplayVisitor(false); }} />
                    <Text color="brand" content="+ Add visitor" className={classes.pointer}
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
                    content={`Location: ${props.selectedLocationDetail?.label}`} />
                <Button primary content="Check-in" onClick={() => {
                    props.updateCurrentPage("Success");
                }} style={{ width: "20em" }} />
            </Flex>
        </Flex>
    );
};