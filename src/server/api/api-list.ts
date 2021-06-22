import * as Express from "express";
import AuthenticationService from "../services/authenticationService";
import EventsGraphAPIService from "../services/eventsGraphAPIService";
import { constants } from "../../constants";
var router = Express.Router();


router.get('/token', async function(req, res) {
    var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
    res.send(token);
});

router.get('/myEventAttendeesByLocationId', async function(req, res) {
    var token = await AuthenticationService.getAccessToken((req.headers as any)[constants.APP_ACCESS_TOKEN_HEADER]);
    var eventsSvc = new EventsGraphAPIService(token);

    var displayName = (req.params as any).displayName;
    if (!displayName) {
        res.status(400).send('Invalid request');
    }
    
    var result = await eventsSvc.getMyEventAttendeesByLocationId(displayName);
    res.send(result);
});

router.get('*', function(req, res) {
    res.status(404).send('Api not found');
});

export default router;