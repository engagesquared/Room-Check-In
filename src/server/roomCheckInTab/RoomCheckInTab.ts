import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/roomCheckInTab/index.html")
@PreventIframe("/roomCheckInTab/config.html")
@PreventIframe("/roomCheckInTab/remove.html")
export class RoomCheckInTab {
}
