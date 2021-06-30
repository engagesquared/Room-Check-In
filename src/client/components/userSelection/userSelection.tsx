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
import * as moment from 'moment';

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
                if (myNextEvent) {
                    const colleagues = myNextEvent.attendees;
                    if (colleagues) {
                        setMyNextEvent(myNextEvent);
                        setUsers(colleagues.filter(t => t.type.toLowerCase() !== "resource")
                            .filter(t => t.emailAddress.address.toLowerCase() !== props.currentUserDetail.mail?.toLowerCase()));
                    }
                }
            }
        })();
    }, [getMyNextEventByLocationEmailAddress, props.selectedLocationDetail]);

    const updateUser = (isCancel: boolean,
        userDetail?: { name: string, email: string, phone: string, type: string, principalName?: string }) => {
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
                },
                phoneNumber: userDetail?.phone,
                principalName: userDetail?.principalName ? userDetail?.principalName : userDetail?.email
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
        let flag = false;
        let tempUsers = users;
        if (isChecked) {
            if (tempfinalAttendees.length + 1 >= props.selectedLocationDetail.capacity) {
                setIsError(true);
            } else {
                tempfinalAttendees.push(slectedAttendee);
                flag = true;
            }
        } else {
            setIsError(false);
            flag = true;
            tempfinalAttendees = tempfinalAttendees.filter(t => t.emailAddress.address !== slectedAttendee.emailAddress.address)
        }
        if (flag) {
            let index = tempUsers.findIndex(t => t.emailAddress.address === slectedAttendee.emailAddress.address);
            if (index > -1) {
                setUsers([
                    ...tempUsers.slice(0, index),
                    Object.assign({}, tempUsers[index], { status: { response: isChecked ? "true" : "false" } })
                    , ...tempUsers.slice(index + 1)]);
            }
        }
        setFinalAttendees(tempfinalAttendees);
    };

    const OnCheckIn = async () => {
        setIsLoading(true);
        let tempCurrentUser: any = props.currentUserDetail;
        tempCurrentUser.phone = props.currentUserDetail.mobilePhone;
        tempCurrentUser.principalName = props.currentUserDetail.userPrincipalName;

        let tempfinalAttendees: IUserAdd[] = [tempCurrentUser];
        finalAttendees.forEach(element => {
            let tempUser: IUserAdd = {
                displayName: element.emailAddress.name,
                mail: element.emailAddress.address,
                phone: element.phoneNumber,
                principalName: element.principalName,
                external: element.type == "external"
            };
            tempfinalAttendees.push(tempUser);
        });

        // add room details to event
        let eventAdd: IEventAdd = {
            locationDisplayName: props.selectedLocationDetail.displayName,
            locationEmail: props.selectedLocationDetail.emailAddress
        };

        // add event details, only if next event is available
        if (myNextEvent) {
            eventAdd.id = myNextEvent.id;
            eventAdd.subject = myNextEvent.subject;
            eventAdd.start = myNextEvent.start.dateTime;
            eventAdd.end = myNextEvent.end.dateTime;
        }

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
            <Flex column gap="gap.small" className={classes.paddingFlex}>
                <Text size="large" weight="bold" content={`${props.currentUserDetail.displayName}`} />
                {props.currentUserDetail['employeeId'] &&
                    <Text content={`Employee Number: ${props.currentUserDetail['employeeId']}`} />
                }
                <Text content={`${props.currentUserDetail.mail}`} />
            </Flex>
            <Divider size={1} />
            {!displayAddUser && !displayVisitor ?
                <Flex column gap="gap.small" className={classes.paddingHeight}>
                    {users.length > 0 &&
                        <Text size="large" weight="bold"
                            content={t('colleaguesMsglbl')} />
                    }
                    {users.map((user) =>
                        <Flex vAlign="center">
                            <Checkbox checked={
                                user.status.response === "true" ? true : false
                            }
                                onChange={(ev, p) => { allAttendees(user, p ? p.checked : false) }} />
                            {user.type !== "external" ?
                                <People peopleQueries={[user.emailAddress.address]} /> :
                                <Avatar className={classes.avatar} name={user.emailAddress.name} />
                            }
                            <Text content={user.emailAddress.name} />
                        </Flex>
                    )}
                    {isError &&
                        <Alert className={classes.errorMsg} danger
                            content={t('maxUserErrorMsglbl').replace('{capacity}',
                                props.selectedLocationDetail.capacity.toString())} />
                    }
                    <Text color="brand" content={t('addUser')} className={classes.pointer}
                        onClick={() => { setDisplayAddUser(true); setDisplayVisitor(false); }} />
                    <Text color="brand" content={t('addVisitor')} className={classes.pointer}
                        onClick={() => { setDisplayAddUser(false); setDisplayVisitor(true); }} />
                </Flex> :
                displayAddUser ?
                    <AddNewUser updateUser={updateUser}></AddNewUser> :
                    displayVisitor ?
                        <AddNewVisitor updateUser={updateUser}></AddNewVisitor> : <></>
            }<Flex style={{ display: "none" }}><div>{finalAttendees.length}</div></Flex>
            <Flex column className={`${classes.center} ${classes.bottomSection}`}
                hAlign="center" vAlign="end">
                <Text size="large" weight="bold" className={classes.locationPadding}
                    content={t('locationlbl').replace('{displayName}', props.selectedLocationDetail?.displayName)} />
                <Button primary content={t('checkinBtnlbl')} loading={isLoading} onClick={() => {
                    OnCheckIn();
                }} className={classes.buttonWidth} />
            </Flex>
        </Flex>
    );
};