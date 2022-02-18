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
  }
};
