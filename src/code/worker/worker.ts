import { greatCircleArcIntersectByLatLngs } from "../geo";
import { WasabeeOp } from "../model";

declare const self: DedicatedWorkerGlobalScope;
export {};

// Both of these should work.
self.onmessage = async (event: MessageEvent) => {
  const data = event.data;
  if (data.type === "selfblock") {
    const opID = data.opID;
    const operation = await WasabeeOp.load(opID);
    const blocked: TaskID[] = [];
    if (operation) {
      for (const l1 of operation.links) {
        for (const l2 of operation.links) {
          if (
            greatCircleArcIntersectByLatLngs(
              l1.getLatLngs(operation),
              l2.getLatLngs(operation)
            )
          ) {
            blocked.push(l1.ID);
            break;
          }
        }
      }
    }
    self.postMessage({
      type: data.type,
      opID: data.opID,
      blocked: blocked,
    });
  } else if (data.type === "block") {
    const { opID, linkIDs, llE6s } = data;
    const operation = await WasabeeOp.load(opID);
    if (operation) {
      const result: LinkID[] = [];
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
      self.postMessage({
        type: data.type,
        opID: opID,
        linkIDs: result,
      });
    }
  }
};
