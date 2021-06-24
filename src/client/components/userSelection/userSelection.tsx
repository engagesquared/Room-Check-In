import * as React from "react";
import "../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./userSelection.styles";
import { Flex, Checkbox, Text, Avatar, Button, Divider } from "@fluentui/react-northstar";
import { AddNewUser } from "./addNewUser/addNewUser";
import { AddNewVisitor } from "./addNewVisitor/addNewVisitor";
import { IUser } from "../../../interfaces/IUser";
import { IRoom } from "../../../interfaces/IRoom";
import { getAttendees } from "../../services/PlacesService";
import { getUserDetailsByPrincipalName } from "../../services/UserService";
import { IAttendee } from "../../../interfaces/IAttendee";
import { People } from "@microsoft/mgt-react";
import { addCheckIns } from "../../services/DataTableService";
import { ICheckIn } from "../../../interfaces/ICheckIn";
import { IUserAdd } from "../../../interfaces/IUserAdd";

export interface IUserSelectionProp {
    currentUserName: string;
    selectedLocationDetail: IRoom;
    updateCurrentPage: any;
    currentUserDetail: IUser;
}

export const UserSelection = (props: IUserSelectionProp) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [displayAddUser, setDisplayAddUser] = React.useState<Boolean>(false);
    const [displayVisitor, setDisplayVisitor] = React.useState<Boolean>(false);
    const [attendees, setAttendees] = React.useState<IAttendee[]>([]);
    const [usersAdd, setUsersAdd] = React.useState<IUserAdd[]>([]);
    const [isError, setIsError] = React.useState<boolean>(false);

    const onCheckIn = async () => {
        try {
            setIsLoading(true);
            const checkIns: ICheckIn[] = [{
                users: [{
                    displayName: "user",
                    mail: "email",
                    principalName: "upn",
                    phone: "phone",
                    employeeId: "empId"
                },
                {
                    displayName: "user",
                    mail: "email",
                    phone: "phone",
                }],
                event: {
                    id: "id",
                    subject: "subject",
                    start: new Date().toISOString(),
                    end: new Date().toISOString(),
                    locationDisplayName: "location-name",
                    locationEmail: "location-email"
                },
                room: {
                    id: props.selectedLocationDetail.id,
                    emailAddress: props.selectedLocationDetail.emailAddress,
                    displayName: props.selectedLocationDetail.displayName,
                    phone: props.selectedLocationDetail.phone ?? "",
                    capacity: props.selectedLocationDetail.capacity,
                    building: props.selectedLocationDetail.building ?? ""
                }
            }];
            const checkInsAdded = await addCheckIns(checkIns);
            if (checkInsAdded) {
                props.updateCurrentPage("Success", checkInsAdded);
            } else {
                setIsLoading(false);
                setIsError(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        (async () => {
            if (props.selectedLocationDetail) {
                let usersAdd: IUserAdd[] = [];
                const attendees = await getAttendees(props.selectedLocationDetail.emailAddress);
                setAttendees(attendees);
            }
        })();
    }, [getAttendees, props.selectedLocationDetail]);

    const updateUser = (visitorUserDetail: { name: string, email: string, phone: string }) => {
        // add visitor
        usersAdd.push({
            displayName: visitorUserDetail.name,
            mail: visitorUserDetail.email,
            phone: visitorUserDetail.phone
        });

        // TODO: add all attendees that are not checked in
        /*
        attendees.forEach(async attendee => {
            let user = await getUserDetailsByPrincipalName(attendee.emailAddress.address);
            if (user) {
                usersAdd.push({
                    displayName: user.displayName,
                    principalName: user.userPrincipalName,
                    mail: user.mail ?? "",
                    phone: user.mobilePhone ?? "",
                    employeeId: user.employeeId ?? ""
                });
            }
        });
        */

        setUsersAdd(usersAdd);
        setDisplayVisitor(false);
        setDisplayAddUser(false);
    };

    return (
        <Flex column gap="gap.small">
            <Flex column gap="gap.small" style={{ padding: "2rem" }}>
                <Text size="large" weight="bold" content={`${props.currentUserDetail.displayName}`} />
                <Text content={`Job Title: ${props.currentUserDetail.jobTitle ?? ""}`} />
                <Text content={`${props.currentUserDetail.mail}`} />
            </Flex>
            <Divider size={1} />
            {!displayAddUser && !displayVisitor ?
                <Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem", height: "55vh" }}>
                    <Text size="large" weight="bold" content={`Are these colleagues with you?`} />
                    {attendees.map((attendee) =>
                        <Flex vAlign="center">
                            <Checkbox />
                            {attendee.type !== "external" ? <People peopleQueries={[attendee.emailAddress.address]} /> :
                                <Avatar name={attendee.emailAddress.name} />}
                            <Text content={attendee.emailAddress.name} />
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
                    content={`Location: ${props.selectedLocationDetail?.displayName}`} />
                <Button primary content="Check-in" onClick={onCheckIn} loading={isLoading} style={{ width: "20em" }} />
            </Flex>
        </Flex>
    );
};