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

router.post('*', function(req, res) {
    res.status(404).send('Api not found');
});

router.get('/token', async function(req, res) {
    try {
        var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
        res.send(token);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/myEventByLocationId', async function(req, res) {
    try {
        var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
        var eventsSvc = new eventsGraphAPIService(token);

        var locationId = req.query.locationId as string;
        if (!locationId) {
            res.status(400).send('locationId is not found in request params');
        }
        
        var result = await eventsSvc.getMyEventByLocationId(locationId);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/myEventDetailsId', async function(req, res) {
    try {
        var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
        var eventsSvc = new eventsGraphAPIService(token);

        var eventId = req.query.eventId as string;
        if (!eventId) {
            res.status(400).send('eventId is not found in request params');
        }
        
        var result = await eventsSvc.getMyEventDetailsId(eventId);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/myEventIAttendeesByLocationEmailAddress', async function(req, res) {
    try {
        var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
        var eventsSvc = new eventsGraphAPIService(token);

        var locationEmailAddress = req.query.locationEmailAddress as string;
        if (!locationEmailAddress) {
            res.status(400).send('locationEmailAddress is not found in request params');
        }
        
        var result = await eventsSvc.getMyEventIAttendeesByLocationEmailAddress(locationEmailAddress);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/roomById', async function(req, res) {
    try {
        var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
        var placesSvc = new placesGraphAPIService(token);

        var roomId = req.query.roomId as string;
        if (!roomId) {
            res.status(400).send('roomId is not found in request params');
            return;
        }
        
        var result = await placesSvc.getPlaceById(roomId);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/roomByDisplayName', async function(req, res) {
    try {
        var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
        var placesSvc = new placesGraphAPIService(token);

        var displayName = req.query.displayName as string;
        if (!displayName) {
            res.status(400).send('displayName is not found in request params');
            return;
        }
        
        var result = await placesSvc.getRoomByDisplayName(displayName);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/roomLocationByEmailAddress', async function(req, res) {
    try {
        var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
        var placesSvc = new placesGraphAPIService(token);

        var emailAddress = req.query.emailAddress as string;
        if (!emailAddress) {
            res.status(400).send('roomId is not found in request params');
            return;
        }
        
        var result = await placesSvc.getRoomLocationByEmailAddress(emailAddress);
        res.send(result);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/loggedInUserDetails', async function(req, res) {
    try {
        var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
        var usersSvc = new usersGraphAPIService(token);
    
        var result = await usersSvc.getLoggedInUserDetails();
        if (result) {
            res.send(result);
        } else {
            res.sendStatus(404);
        }
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/checkedInUsersInRoom', async function(req, res) {
    var roomId = (req.params as any).roomId;
    var eventId = (req.params as any).eventId;

    if (!roomId) {
        res.status(400).send('roomId is not found in request params');
    }
    if (!eventId) {
        res.status(400).send('eventId is not found in request params');
    }

    var result = await dataTableStorageService.getAllCheckedInUsersInRoomAndEvent(roomId, eventId);
    res.send(result);
});

router.post('/checkIns', async function(req, res) {
    var checkIns = (req.body as ICheckIn[]);
    if (!checkIns) {
        res.status(400).send('checkIns are not found in request body');
    }
    var result = await dataTableStorageService.addCheckIns(checkIns);
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
});

export default router;