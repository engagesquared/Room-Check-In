import * as Express from "express";
import AuthenticationService from "../services/authenticationService";
import eventsGraphAPIService from "../services/eventsGraphAPIService";
import { constants } from "../../constants";
import placesGraphAPIService from "../services/placesGraphAPIService";
import usersGraphAPIService from "../services/usersGraphAPIService";
import dataTableStorageService from "../services/dataTableStorageService";
import { ICheckIn } from "../../interfaces/ICheckIn";
var router = Express.Router();

router.post('/token', async function (req, res) {
    try {
        var token = await AuthenticationService.getAccessToken(req.body.ssoToken);
        res.send(token);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/myEventByLocationId', (req, res) => authorizedApi(req, res, async (token) => {
    var eventsSvc = new eventsGraphAPIService(token);

    var locationId = req.query.locationId as string;
    if (!locationId) {
        res.status(400).send('locationId is not found in request params');
    }

    var result = await eventsSvc.getMyEventByLocationId(locationId);
    res.send(result);
}));

router.get('/myEventDetailsId', (req, res) => authorizedApi(req, res, async (token) => {
    var eventsSvc = new eventsGraphAPIService(token);

    var eventId = req.query.eventId as string;
    if (!eventId) {
        res.status(400).send('eventId is not found in request params');
    }

    var result = await eventsSvc.getMyEventDetailsId(eventId);
    res.send(result);
}));

router.get('/myEventIAttendeesByLocationEmailAddress', (req, res) => authorizedApi(req, res, async (token) => {
    var eventsSvc = new eventsGraphAPIService(token);

    var locationEmailAddress = req.query.locationEmailAddress as string;
    if (!locationEmailAddress) {
        res.status(400).send('locationEmailAddress is not found in request params');
    }

    var result = await eventsSvc.getMyEventIAttendeesByLocationEmailAddress(locationEmailAddress);
    res.send(result);
}));

router.get('/roomById', (req, res) => authorizedApi(req, res, async (token) => {
    var placesSvc = new placesGraphAPIService(token);

    var roomId = req.query.roomId as string;
    if (!roomId) {
        res.status(400).send('roomId is not found in request params');
        return;
    }

    var result = await placesSvc.getPlaceById(roomId);
    res.send(result);
}));

router.get('/roomByDisplayName', (req, res) => authorizedApi(req, res, async (token) => {
        var displayName = req.query.displayName as string;
        if (!displayName) {
            res.status(400).send('displayName is not found in request params');
            return;
        }

        var placesSvc = new placesGraphAPIService(token);

        var result = await placesSvc.getRoomByDisplayName(displayName);
        res.send(result);
}));

router.get('/roomLocationByEmailAddress', (req, res) => authorizedApi(req, res, async (token) => {
    var emailAddress = req.query.emailAddress as string;
    if (!emailAddress) {
        res.status(400).send('roomId is not found in request params');
        return;
    }

    var placesSvc = new placesGraphAPIService(token);

    var result = await placesSvc.getRoomLocationByEmailAddress(emailAddress);
    res.send(result);
}));

router.get('/loggedInUserDetails', (req, res) => authorizedApi(req, res, async (token) => {
    var usersSvc = new usersGraphAPIService(token);

    var result = await usersSvc.getLoggedInUserDetails();
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/userDetailsById', (req, res) => authorizedApi(req, res, async (token) => {
    var userId = req.query.userId as string;
    if (!userId) {
        res.status(400).send('userId is not found in request params');
    }

    var usersSvc = new usersGraphAPIService(token);
    var result = await usersSvc.getUserDetailsById(userId);
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/userDetailsByDisplayName', (req, res) => authorizedApi(req, res, async (token) => {
    var displayName = req.query.displayName as string;
    if (!displayName) {
        res.status(400).send('displayName is not found in request params');
    }

    var usersSvc = new usersGraphAPIService(token);
    var result = await usersSvc.getUserDetailsByDisplayName(displayName);
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/userDetailsByPrincipalName', (req, res) => authorizedApi(req, res, async (token) => {
    var upn = req.query.upn as string;
    if (!upn) {
        res.status(400).send('upn is not found in request params');
    }

    var usersSvc = new usersGraphAPIService(token);
    var result = await usersSvc.getUserDetailsByPrincipalName(upn);
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/checkedInUsers', async function (req, res) {
    var roomId = req.query.roomId as string;
    var eventId = req.query.eventId as string;

    if (!roomId) {
        res.status(400).send('roomId is not found in request params');
    }
    if (!eventId) {
        res.status(400).send('eventId is not found in request params');
    }

    var result = await dataTableStorageService.getCheckedInUsers(roomId, eventId);
    res.send(result);
});

router.post('/checkIn', async function (req, res) {
    var checkIn = (req.body as ICheckIn);
    if (!checkIn) {
        res.status(400).send('checkIn are not found in request body');
    }
    var result = await dataTableStorageService.addCheckIn(checkIn);
    res.setHeader('Content-Type', 'application/json');
    res.send(result);
});

router.get('*', function (req, res) {
    res.status(404).send('Api not found');
});

router.post('*', function (req, res) {
    res.status(404).send('Api not found');
});


async function authorizedApi(req, res, func: Function) {
    try {
        var token = (req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER];
        if (!token) {
            res.status(401).send("Unauthorized");
            return;
        }
        return await func(token);
    } catch (e) {
        res.status(500).send(e);
    }
}

export default router;