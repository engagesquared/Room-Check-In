import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/optusCheckinTab/index.html")
@PreventIframe("/optusCheckinTab/config.html")
@PreventIframe("/optusCheckinTab/remove.html")
export class OptusCheckinTab {
}
