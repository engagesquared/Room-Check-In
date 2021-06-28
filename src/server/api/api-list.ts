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

// users APIs [START]
router.get('/users/me', (req, res) => authorizedApi(req, res, async (token) => {
    var usersSvc = new usersGraphAPIService(token);

    var result = await usersSvc.getLoggedInUser();
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/users/all', (req, res) => authorizedApi(req, res, async (token) => {
    var usersSvc = new usersGraphAPIService(token);

    var result = await usersSvc.getAllUsers();
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/users/membersOnly', (req, res) => authorizedApi(req, res, async (token) => {
    var usersSvc = new usersGraphAPIService(token);

    var result = await usersSvc.getAllUsersByUserType('Member');
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/users/guestsOnly', (req, res) => authorizedApi(req, res, async (token) => {
    var usersSvc = new usersGraphAPIService(token);

    var result = await usersSvc.getAllUsersByUserType('Guest');
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/users/:userId', (req, res) => authorizedApi(req, res, async (token) => {
    var userId = req.query.userId as string;
    if (!userId) {
        res.status(400).send('userId is not found in request params');
    }

    var usersSvc = new usersGraphAPIService(token);
    var result = await usersSvc.getUserById(userId);
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/users/byDisplayName/:displayName', (req, res) => authorizedApi(req, res, async (token) => {
    var displayName = req.query.displayName as string;
    if (!displayName) {
        res.status(400).send('displayName is not found in request params');
    }

    var usersSvc = new usersGraphAPIService(token);
    var result = await usersSvc.getUserByDisplayName(displayName);
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));

router.get('/users/byUserPrincipalName/:upn', (req, res) => authorizedApi(req, res, async (token) => {
    var upn = req.query.upn as string;
    if (!upn) {
        res.status(400).send('upn is not found in request params');
    }

    var usersSvc = new usersGraphAPIService(token);
    var result = await usersSvc.getUserByPrincipalName(upn);
    if (result) {
        res.send(result);
    } else {
        res.sendStatus(404);
    }
}));
// users APIs [START]

// places APIs [START]
router.get('/places/:roomId', (req, res) => authorizedApi(req, res, async (token) => {
    var placesSvc = new placesGraphAPIService(token);

    var roomId = req.query.roomId as string;
    if (!roomId) {
        res.status(400).send('roomId is not found in request params');
        return;
    }

    var result = await placesSvc.getPlaceById(roomId);
    res.send(result);
}));

router.get('/places/byDisplayName/:displayName', (req, res) => authorizedApi(req, res, async (token) => {
        var displayName = req.query.displayName as string;
        if (!displayName) {
            res.status(400).send('displayName is not found in request params');
            return;
        }

        var placesSvc = new placesGraphAPIService(token);

        var result = await placesSvc.getRoomByDisplayName(displayName);
        res.send(result);
}));

router.get('/places/byEmailAdress/:emailAddress', (req, res) => authorizedApi(req, res, async (token) => {
    var emailAddress = req.query.emailAddress as string;
    if (!emailAddress) {
        res.status(400).send('emailAddress is not found in request params');
        return;
    }

    var placesSvc = new placesGraphAPIService(token);

    var result = await placesSvc.getRoomByEmailAddress(emailAddress);
    res.send(result);
}));
// places APIs [END]

// events APIs [START]
router.get('/me/events/:eventId', (req, res) => authorizedApi(req, res, async (token) => {
    var eventsSvc = new eventsGraphAPIService(token);

    var eventId = req.query.eventId as string;
    if (!eventId) {
        res.status(400).send('eventId is not found in request params');
    }

    var result = await eventsSvc.getMyEventById(eventId);
    res.send(result);
}));

router.get('/me/events/byLocationDisplayName/:locationDisplayName', (req, res) => authorizedApi(req, res, async (token) => {
    var eventsSvc = new eventsGraphAPIService(token);

    var locationDisplayName = req.query.locationDisplayName as string;
    if (!locationDisplayName) {
        res.status(400).send('locationDisplayName is not found in request params');
    }

    var result = await eventsSvc.getMyNextEventByLocationDisplayName(locationDisplayName);
    res.send(result);
}));

router.get('/me/events/byLocationEmailAddress/:locationEmailAddress', (req, res) => authorizedApi(req, res, async (token) => {
    var eventsSvc = new eventsGraphAPIService(token);

    var locationEmailAddress = req.query.locationEmailAddress as string;
    if (!locationEmailAddress) {
        res.status(400).send('locationEmailAddress is not found in request params');
    }

    var result = await eventsSvc.getMyNextEventByLocationEmailAddress(locationEmailAddress);
    res.send(result);
}));
// events APIs [END]

// data-table APIs [START]
router.get('/users/checkedIn/:roomId/:eventId', async function (req, res) {
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

router.post('/users/checkIn', async function (req, res) {
    var checkIn = (req.body as ICheckIn);
    if (!checkIn) {
        res.status(400).send('checkIn are not found in request body');
    }
    if (!checkIn.users) {
        res.status(400).send('users are not found in request body');
    }
    if (!checkIn.room) {
        res.status(400).send('room is not found in request body');
    }
    if (!checkIn.event) {
        res.status(400).send('event is not found in request body');
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
// data-table APIs [END]

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