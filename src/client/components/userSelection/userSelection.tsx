import * as React from "react";
import "../../localization/localization";
import { useTranslation } from "react-i18next";
import { useStyles } from "./userSelection.styles";
import { Flex, Checkbox, Text, Avatar, Button, Divider, Alert } from "@fluentui/react-northstar";
import { AddNewUser } from "./addNewUser/addNewUser";
import { AddNewVisitor } from "./addNewVisitor/addNewVisitor";
import { IUser } from "../../../interfaces/IUser";
import { IRoom } from "../../../interfaces/IRoom";
import { IAttendee } from "../../../interfaces/IAttendee";
import { People } from "@microsoft/mgt-react";
import { IEvent } from "../../../interfaces/IEvent";
import { ICheckIn } from "../../../interfaces/ICheckIn";
import { IUserAdd } from "../../../interfaces/IUserAdd";
import { addCheckIn } from "../../services/DataTableService";
import { getMyNextEventByLocationEmailAddress } from "../../apis/api-list";
import { IEventAdd } from "../../../interfaces/IEventAdd";
import { v4 as uuidv4 } from 'uuid';
import { constants } from "../../../constants";

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
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [users, setUsers] = React.useState<IAttendee[]>([]);
    const [myNextEvent, setMyNextEvent] = React.useState<IEvent>();
    const [finalAttendees, setFinalAttendees] = React.useState<IAttendee[]>([]);
    const [isError, setIsError] = React.useState<boolean>(false);

    React.useEffect(() => {
        (async () => {
            if (props.selectedLocationDetail) {
                const myNextEvent = await getMyNextEventByLocationEmailAddress(props.selectedLocationDetail.emailAddress);
                const colleagues = myNextEvent.attendees;
                setMyNextEvent(myNextEvent);
                setUsers(colleagues);
            }
        })();
    }, [getMyNextEventByLocationEmailAddress, props.selectedLocationDetail]);

    const updateUser = (isCancel: boolean, userDetail?: { name: string, email: string, phone: string, type: string }) => {
        if (!isCancel) {
            let tempUsers = users;
            let newUserDetail = {
                type: `${userDetail?.type}`,
                status: {
                    response: "true",
                    time: "0001-01-01T00:00:00Z"
                },
                emailAddress: {
                    name: `${userDetail?.name}`,
                    address: `${userDetail?.email}`
                }
            };
            let tempFinalAttendees = finalAttendees;
            tempFinalAttendees.push(newUserDetail);
            tempUsers.push(newUserDetail);
            setFinalAttendees(tempFinalAttendees);
            setUsers(tempUsers);
            setDisplayVisitor(false);
            setDisplayAddUser(false);
        } else {
            setDisplayVisitor(false);
            setDisplayAddUser(false);
        }
    };

    const allAttendees = (slectedAttendee: IAttendee, isChecked: boolean) => {
        let tempfinalAttendees = finalAttendees;
        let tempUsers = users;
        if (isChecked) {
            if (tempfinalAttendees.length + 1 >= props.selectedLocationDetail.capacity) {
                setIsError(true);
            } else {
                tempfinalAttendees.push(slectedAttendee);
            }
        } else {
            setIsError(false);
            tempfinalAttendees = tempfinalAttendees.filter(t => t.emailAddress.address !== slectedAttendee.emailAddress.address)
        }
        let index = tempUsers.findIndex(t => t.emailAddress.address === slectedAttendee.emailAddress.address);
        if (index > -1) {
            setUsers([
                ...tempUsers.slice(0, index),
                Object.assign({}, tempUsers[index], { status: { response: isChecked ? "true" : "false" } })
                , ...tempUsers.slice(index + 1)]);
        }
        setFinalAttendees(tempfinalAttendees);
    };

    const OnCheckIn = async () => {
        setIsLoading(true);
        let tempCurrentUser: any = props.currentUserDetail;
        tempCurrentUser.phone = props.currentUserDetail.mobilePhone
        let tempfinalAttendees: IUserAdd[] = [tempCurrentUser];
        finalAttendees.forEach(element => {
            let tempUser: IUserAdd = {
                displayName: element.emailAddress.name,
                mail: element.emailAddress.address,
                phone: '1234'
            };
            tempfinalAttendees.push(tempUser);
        });
        
        let eventAdd: IEventAdd = {
            id: myNextEvent ? myNextEvent.id : uuidv4(),
            subject: myNextEvent ? myNextEvent.subject: constants.ADHOC_EVENT_NAME,
            start: myNextEvent ? myNextEvent.start.dateTime : new Date().toISOString(),
            end: myNextEvent ? myNextEvent.end.dateTime : ((new Date()).setHours(new Date().getHours()+1)).toString(),
            locationDisplayName: myNextEvent?.location.displayName,
            locationEmail: myNextEvent?.location.locationEmailAddress
        };

        //eventAdd.locationDisplayName = props.selectedLocationDetail.displayName;
        //eventAdd.locationEmail = props.selectedLocationDetail.emailAddress;
        let finalCheckInObject: ICheckIn = {
            event: eventAdd,
            room: props.selectedLocationDetail,
            users: tempfinalAttendees
        };
        await addCheckIn(finalCheckInObject);
        props.updateCurrentPage("Success");
    };

    return (
        <Flex column gap="gap.small">
            <Flex column gap="gap.small" style={{ padding: "2rem" }}>
                <Text size="large" weight="bold" content={`${props.currentUserDetail.displayName}`} />
                <Text content={`Employee Number: 
                ${props.currentUserDetail['employeeId'] ?
                        props.currentUserDetail['employeeId'] : ""}`} />
                <Text content={`${props.currentUserDetail.mail}`} />
            </Flex>
            <Divider size={1} />
            {!displayAddUser && !displayVisitor ?
                [<Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem" }}>
                    {users.length > 0 &&
                        <Text size="large" weight="bold" content={`Are these colleagues with you?`} />
                    }
                    {users.map((user) =>
                        <Flex vAlign="center">
                            <Checkbox checked={
                                user.status.response === "true" ? true : false
                            }
                                onChange={(ev, p) => { allAttendees(user, p ? p.checked : false) }} />
                            {user.type !== "external" ? <People peopleQueries={[user.emailAddress.address]} /> :
                                <Avatar name={user.emailAddress.name} />}
                            <Text content={user.emailAddress.name} />
                        </Flex>
                    )}
                </Flex>, <>{isError && <Alert style={{ width: "100%", textAlign: "center" }} danger
                    content={`A maximum of ${props.selectedLocationDetail.capacity} people are allowed in this room.`} />}</>,
                <Flex column gap="gap.small" style={{ padding: "0 2rem 2rem 2rem", height: "50vh" }}>
                    <Text color="brand" content="+ Add another person" className={classes.pointer}
                        onClick={() => { setDisplayAddUser(true); setDisplayVisitor(false); }} />
                    <Text color="brand" content="+ Add visitor" className={classes.pointer}
                        onClick={() => { setDisplayAddUser(false); setDisplayVisitor(true); }} />
                </Flex>] :
                displayAddUser ?
                    <AddNewUser updateUser={updateUser}></AddNewUser> :
                    displayVisitor ? <AddNewVisitor updateUser={updateUser}></AddNewVisitor> : <></>
            }<Flex style={{ display: "none" }}><div>{finalAttendees.length}</div></Flex>
            <Flex column className={classes.center} hAlign="center" vAlign="end"
                style={{
                    background: "#F9F9F9",
                    padding: "1%",
                    width: "100%"
                }}>
                <Text size="large" weight="bold" style={{ padding: "1em" }}
                    content={`Location: ${props.selectedLocationDetail?.displayName}`} />
                <Button primary content="Check-in" loading={isLoading} onClick={() => {
                    OnCheckIn();
                }} style={{ width: "20em" }} />
            </Flex>
        </Flex>
    );
};