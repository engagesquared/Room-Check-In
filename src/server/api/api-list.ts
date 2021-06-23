import * as Express from "express";
import AuthenticationService from "../services/authenticationService";
import eventsGraphAPIService from "../services/eventsGraphAPIService";
import { constants } from "../../constants";
import placesGraphAPIService from "../services/placesGraphAPIService";
import usersGraphAPIService from "../services/usersGraphAPIService";
import dataTableStorageService from "../services/dataTableStorageService";
import { ICheckIn } from "../../interfaces/ICheckIn";
var router = Express.Router();

router.get('*', function(req, res) {
    res.status(404).send('Api not found');
});

router.get('/token', async function(req, res) {
    var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
    res.send(token);
});

router.get('/myEventByLocationId', async function(req, res) {
    var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
    var eventsSvc = new eventsGraphAPIService(token);

    var locationId = (req.params as any).locationId;
    if (!locationId) {
        res.status(400).send('locationId is not found in request params');
    }
    
    var result = await eventsSvc.getMyEventByLocationId(locationId);
    res.send(result);
});

router.get('/myEventByLocationEmailAddress', async function(req, res) {
    var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
    var eventsSvc = new eventsGraphAPIService(token);

    var locationEmailAddress = (req.params as any).locationEmailAddress;
    if (!locationEmailAddress) {
        res.status(400).send('locationEmailAddress is not found in request params');
    }
    
    var result = await eventsSvc.getMyEventByLocationEmailAddress(locationEmailAddress);
    res.send(result);
});

router.get('/placeById', async function(req, res) {
    var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
    var placesSvc = new placesGraphAPIService(token);

    var roomId = (req.params as any).roomId;
    if (!roomId) {
        res.status(400).send('roomId is not found in request params');
    }
    
    var result = await placesSvc.getPlaceById(roomId);
    res.send(result);
});

router.get('/roomByDisplayName', async function(req, res) {
    var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
    var placesSvc = new placesGraphAPIService(token);

    var roomId = (req.params as any).roomId;
    if (!roomId) {
        res.status(400).send('roomId is not found in request params');
    }
    
    var result = await placesSvc.getRoomByDisplayName(roomId);
    res.send(result);
});

router.get('/loggedInUserDetails', async function(req, res) {
    var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
    var usersSvc = new usersGraphAPIService(token);

    var result = await usersSvc.getLoggedInUserDetails();
    res.send(result);
});

router.post('/checkIn', async function(req, res) {
    var checkIns = (req.body as ICheckIn[]);
    if (!checkIns) {
        res.status(400).send('checkInUser is not found in request body');
    }
    var result = await dataTableStorageService.checkIn(checkIns)
    res.send(result);
});

router.get('/checkedInUsersInRoom', async function(req, res) {
    var roomId = (req.params as any).roomId;
    if (!roomId) {
        res.status(400).send('roomId is not found in request params');
    }

    var result = await dataTableStorageService.getCheckedInUsersInRoom(roomId);
    res.send(result);
});

export default router;