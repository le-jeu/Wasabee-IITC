import { greatCircleArcIntersectByLatLngs } from "../geo";
import { WasabeeBlocker, WasabeeOp } from "../model";

declare const self: DedicatedWorkerGlobalScope;
export {};

// Both of these should work.
self.onmessage = async (event: MessageEvent) => {
  const data = event.data;
  const opID = data.opID;
  const result: unknown[] = [];
  const operation = await WasabeeOp.load(opID);
  if (operation) {
    if (data.type === "selfblock") {
      // are op links blocked by op links ?
      for (const l1 of operation.links) {
        for (const l2 of operation.links) {
          if (
            greatCircleArcIntersectByLatLngs(
              l1.getLatLngs(operation),
              l2.getLatLngs(operation)
            )
          ) {
            result.push(l1.ID);
            break;
          }
        }
      }
    } else if (data.type === "blocked") {
      // are op links blocked by blockers ?
      const blockers = await WasabeeBlocker.getAll(operation);
      for (const l of operation.links) {
        for (const b of blockers) {
          if (
            greatCircleArcIntersectByLatLngs(l.getLatLngs(operation), [
              b.fromPortal.latLng,
              b.toPortal.latLng,
            ])
          ) {
            result.push(l.ID);
            break;
          }
        }
      }
    } else if (data.type === "blocker") {
      // are blockers blocking op links ?
      const markers: PortalID[] = [];
      for (const marker of operation.markers) {
        if (marker.isDestructMarker()) {
          markers.push(marker.portalId);
        }
      }
      const blockers = await WasabeeBlocker.getAll(operation);
      for (const b of blockers) {
        let blocking = false;
        if (!markers.includes(b.from) && !markers.includes(b.to)) {
          for (const l of operation.links) {
            if (
              greatCircleArcIntersectByLatLngs(l.getLatLngs(operation), [
                b.fromPortal.latLng,
                b.toPortal.latLng,
              ])
            ) {
              blocking = true;
              break;
            }
          }
        }
        if (!blocking) result.push([b.from, b.to]);
      }
    } else if (data.type === "block") {
      // are real links blocking op links ?
      const { linkIDs, llE6s } = data;
      for (let i = 0; i < linkIDs.length; i++) {
        const ll = [
          { lat: llE6s[i][0][0] * 1e-6, lng: llE6s[i][0][1] * 1e-6 },
          { lat: llE6s[i][1][0] * 1e-6, lng: llE6s[i][1][1] * 1e-6 },
        ];
        for (const l of operation.links) {
          if (greatCircleArcIntersectByLatLngs(l.getLatLngs(operation), ll)) {
            result.push(linkIDs[i]);
            break;
          }
        }
      }
    }
  }
  self.postMessage({
    type: data.type,
    opID: opID,
    result: result,
  });
};
