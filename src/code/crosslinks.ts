import { WasabeePortal, WasabeeMarker, WasabeeBlocker } from "./model";
import { getSelectedOperation } from "./selectedOp";

import * as PortalUI from "./ui/portal";
import type WasabeeOp from "./model/operation";
import type WasabeeLink from "./model/link";
import type { IITC } from "../types/iitc";

import { greatCircleArcIntersectByLatLngs } from "./geo";
import { WLBlockerLayer } from "./map/blocker";

function testPolyLine(
  wasabeeLink: WasabeeLink,
  realLink: IITC.Link,
  operation: WasabeeOp
) {
  if (
    greatCircleArcIntersectByLatLngs(
      realLink.getLatLngs(),
      wasabeeLink.getLatLngs(operation)
    )
  ) {
    if (!operation.markers || operation.markers.length == 0) {
      return true;
    }

    for (const marker of operation.markers) {
      if (
        marker.type == WasabeeMarker.constants.MARKER_TYPE_DESTROY ||
        marker.type == WasabeeMarker.constants.MARKER_TYPE_VIRUS ||
        marker.type == WasabeeMarker.constants.MARKER_TYPE_DECAY
      ) {
        if (
          marker.portalId == realLink.options.data.dGuid ||
          marker.portalId == realLink.options.data.oGuid
        ) {
          return false;
        }
      }
    }
    return true;
  }
  return false;
}

async function addBlockerFromIITC(link: IITC.Link, operation: WasabeeOp) {
  let fromPortal =
    operation.getPortal(link.options.data.oGuid) ||
    PortalUI.get(link.options.data.oGuid);
  if (!fromPortal)
    fromPortal = WasabeePortal.fake(
      (link.options.data.oLatE6 / 1e6).toFixed(6),
      (link.options.data.oLngE6 / 1e6).toFixed(6),
      link.options.data.oGuid
    );
  let toPortal =
    operation.getPortal(link.options.data.dGuid) ||
    PortalUI.get(link.options.data.dGuid);
  if (!toPortal)
    toPortal = WasabeePortal.fake(
      (link.options.data.dLatE6 / 1e6).toFixed(6),
      (link.options.data.dLngE6 / 1e6).toFixed(6),
      link.options.data.dGuid
    );
  await WasabeeBlocker.addBlocker(
    operation,
    fromPortal,
    toPortal,
    link.options.data.team as "R" | "E",
    link.options.guid
  );
  window.plugin.wasabee.crossLinkLayers.addBlocker(fromPortal, toPortal);
}

function testInNewWorker<T>(message) {
  return new Promise<T>((resolve) => {
    const worker = new Worker(window.plugin.wasabee.workerUrl);
    worker.onmessage = (ev) => {
      worker.terminate();
      resolve(ev.data.result as T);
    };
    worker.postMessage(message);
  });
}

async function testLink(link: IITC.Link, operation: WasabeeOp) {
  // if the crosslink already exists, do not recheck
  if (window.plugin.wasabee._crosslinkCache.has(link.options.guid)) {
    return;
  }
  // if (window.plugin.wasabee.workerUrl) {
  //   await testLinksInWorker([link], operation);
  //   return;
  // }

  let cross = false;
  for (const drawnLink of operation.links) {
    if (testPolyLine(drawnLink, link, operation)) {
      window.plugin.wasabee._crosslinkCache.set(link.options.guid, true);
      if (!cross) {
        await addBlockerFromIITC(link, operation);
        cross = true;
      }
      drawnLink.blocked = true;
    }
  }
}

export function testSelfBlock(incoming: WasabeeLink, operation: WasabeeOp) {
  for (const against of operation.links) {
    if (incoming.ID == against.ID) continue;
    if (
      greatCircleArcIntersectByLatLngs(
        against.getLatLngs(operation),
        incoming.getLatLngs(operation)
      )
    ) {
      return true;
    }
  }
  return false;
}

export function testBlocked(
  incoming: WasabeeLink,
  operation: WasabeeOp,
  blockers: WasabeeBlocker[]
) {
  for (const b of blockers) {
    if (
      greatCircleArcIntersectByLatLngs(incoming.getLatLngs(operation), [
        b.fromPortal.latLng,
        b.toPortal.latLng,
      ])
    ) {
      return true;
    }
  }
  return false;
}

export function testBlocker(operation: WasabeeOp, blocker: WasabeeBlocker) {
  for (const l of operation.links) {
    if (
      greatCircleArcIntersectByLatLngs(l.getLatLngs(operation), [
        blocker.fromPortal.latLng,
        blocker.toPortal.latLng,
      ])
    ) {
      return true;
    }
  }
  return false;
}

// lets see if using a generator makes the GUI more responsive on large ops
// -- yeild doesn't seem to release the main thread, maybe we need to yeild a
// Promise.resolve(window.links[g]) and await it in the for loop?
function* realLinks() {
  const guids = Object.getOwnPropertyNames(window.links);
  // it is possible that the link was purged while we were yielded
  // checking here should reduce the workload while scrolling/zooming
  for (const g of guids) {
    if (window.links[g] != null) yield window.links[g];
  }
}

export async function checkAllLinks() {
  if (window.isLayerGroupDisplayed("Wasabee Cross Links") === false) return;

  const operation = getSelectedOperation();

  window.plugin.wasabee._crosslinkCache.clear();

  if (!operation.links || operation.links.length == 0) return;

  const markers: PortalID[] = [];
  for (const marker of operation.markers) {
    if (marker.isDestructMarker()) {
      markers.push(marker.portalId);
    }
  }

  if (window.plugin.wasabee.workerUrl) {
    const linkData: [string, IITC.LinkData][] = [];
    for (const guid in window.links) {
      const l = window.links[guid];
      if (
        l &&
        !markers.includes(l.options.data.oGuid) &&
        !markers.includes(l.options.data.dGuid)
      )
        linkData.push([l.options.guid, l.options.data]);
    }
    const linkIDs = await testInNewWorker<string[]>({
      type: "block",
      opID: operation.ID,
      linkIDs: linkData.map((link) => link[0]),
      llE6s: linkData.map((link) => [
        [link[1].oLatE6, link[1].oLngE6],
        [link[1].dLatE6, link[1].dLngE6],
      ]),
    });
    for (const linkID of linkIDs) {
      const link = window.links[linkID];
      if (link) {
        await addBlockerFromIITC(link, operation);
      }
    }
    const nonBlockers = await testInNewWorker<[PortalID, PortalID][]>({
      type: "blocker",
      opID: operation.ID,
    });
    for (const [from, to] of nonBlockers) {
      WasabeeBlocker.removeBlocker(operation, from, to);
    }
    const selfBlockedIDs = await testInNewWorker<TaskID[]>({
      type: "selfblock",
      opID: operation.ID,
    });
    const blockedIDs = await testInNewWorker<TaskID[]>({
      type: "blocked",
      opID: operation.ID,
    });
    for (const l of operation.links) {
      l.selfBlocked = selfBlockedIDs.includes(l.ID);
      l.blocked = blockedIDs.includes(l.ID);
    }
  } else {
    const blockers = await WasabeeBlocker.getAll(operation);
    for (const l of operation.links) {
      l.blocked = testBlocked(l, operation, blockers);
      if (!window.plugin.wasabee.workerUrl)
        l.selfBlocked = testSelfBlock(l, operation);
    }
    for (const b of blockers) {
      if (b.guid) window.plugin.wasabee._crosslinkCache.set(b.guid, true);
      if (!testBlocker(operation, b)) {
        WasabeeBlocker.removeBlocker(operation, b.from, b.to);
      }
    }
    const linkGenerator = realLinks();
    for (const link of linkGenerator) {
      await testLink(link, operation);
    }
  }
  window.map.fire("wasabee:crosslinks:done");
}

function onLinkAdded(data: EventLinkAdded) {
  testLink(data.link, getSelectedOperation());
}

function onMapDataRefreshStart() {
  window.removeHook("linkAdded", onLinkAdded);
}

function onMapDataRefreshEnd() {
  if (window.isLayerGroupDisplayed("Wasabee Cross Links") === false) return;
  window.plugin.wasabee.crossLinkLayers.bringToFront();

  checkAllLinks();
  window.addHook("linkAdded", onLinkAdded);
}

export function initCrossLinks() {
  window.map.on("wasabee:crosslinks", checkAllLinks);
  window.plugin.wasabee.crossLinkLayers = new WLBlockerLayer();
  window.plugin.wasabee._crosslinkCache = new Map();
  window.addLayerGroup(
    "Wasabee Cross Links",
    window.plugin.wasabee.crossLinkLayers,
    true
  );

  window.plugin.wasabee.crossLinkLayers.on("add", checkAllLinks);

  window.addHook("mapDataRefreshStart", onMapDataRefreshStart);
  window.addHook("mapDataRefreshEnd", onMapDataRefreshEnd);
}
