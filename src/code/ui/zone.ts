import * as L from "leaflet";

import type WasabeeZone from "../model/zone";

class WLZone extends L.LayerGroup {
  constructor (zone: WasabeeZone) {
    zone.points.sort((a, b) => {
      return a.position - b.position;
    });
    let layer;
    if (zone.points.length == 1)
      layer = L.marker(zone.points[0], {
        // @ts-ignore
        icon: L.divIcon.coloredSvg(zone.color),
      });
    else if (zone.points.length == 2)
      layer = L.polyline(zone.points, { color: zone.color });
    else
      layer = L.polygon(zone.points, {
        color: zone.color,
        opacity: 0.7,
        fill: true,
        interactive: false,
      });
    super([layer]);
  }
}

export default {
  WLZone,
};
