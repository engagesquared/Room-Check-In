import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/roomCheckinTab/index.html")
@PreventIframe("/roomCheckinTab/config.html")
@PreventIframe("/roomCheckinTab/remove.html")
export class RoomCheckinTab {
}
