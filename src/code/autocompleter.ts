/** Source */
/** Action */

import { getSelectedOperation } from "./selectedOp";


export function onLinkAdded(e: EventLinkAdded) {
    const link = e.link;
    const operation = getSelectedOperation();
    const wlink = operation.getLinkByPortalIDs(link.options.data.dGuid, link.options.data.oGuid);
    if (wlink) {
        wlink.complete();
        operation.update();
    }
}

// note: this is quadratic
export function onCommData(e: EventPublicChatDataAvailable) {
    const operation = getSelectedOperation();
    for (const msg of e.result) {
        const plext = msg[2];
        if (plext.plext.team === "RESISTANCE") continue;
        const markup = plext.plext.markup;
        if (markup.length === 5
            && markup[0][0] === "PLAYER"
            && markup[1][0] === "TEXT" && markup[1][1].plain === " linked "
            && markup[2][0] === "PORTAL"
            && markup[3][0] === "TEXT" && markup[3][1].plain === " to "
            && markup[4][0] === "PORTAL") {
            const fromLatE6 = markup[2][1].latE6;
            const fromLngE6 = markup[2][1].lngE6;
            const toLatE6 = markup[4][1].latE6;
            const toLngE6 = markup[4][1].lngE6;
            const from = operation.getPortalByLatLng((fromLatE6 * 1e-6).toFixed(6), (fromLngE6 * 1e-6).toFixed(6));
            const to = operation.getPortalByLatLng((toLatE6 * 1e-6).toFixed(6), (toLngE6 * 1e-6).toFixed(6));
            if (from && to) {
                const wlink = operation.getLink(from, to);
                if (wlink) {
                    wlink.complete();
                }
            }
        }
    } 1
    operation.update();
}

// note: this is quadratic
export function analyseCurrentData() {
    const operation = getSelectedOperation();
    for (const guid in window.links) {
        const link = window.links[guid];
        const wlink = operation.getLinkByPortalIDs(link.options.data.dGuid, link.options.data.oGuid);
        if (wlink) {
            wlink.complete();
        }
    }
    operation.update();
}

