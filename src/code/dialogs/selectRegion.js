import { WDialog } from "../leafletClasses";
import { getAllPortalsOnScreen } from "../uiCommands";
import { getSelectedOperation } from "../selectedOp";
import wX from "../wX";
//import { postToFirebase } from "../firebaseSupport";

const EPS = 1e-9;

const filterPolygon = function(portals, polygon) {
  const result = [];
  for (const p of portals) {
    let asum = 0;
    let i, j;
    for (i = 0, j = polygon.length - 1; i < polygon.length; j = i, ++i) {
      const ax = polygon[i].lat - p.lat;
      const ay = polygon[i].lng - p.lng;
      const bx = polygon[j].lat - p.lat;
      const by = polygon[j].lng - p.lng;
      const la = Math.sqrt(ax * ax + ay * ay);
      const lb = Math.sqrt(bx * bx + by * by);
      if (Math.abs(la) <= EPS || Math.abs(lb) <= EPS)
        // the point is a vertex of the polygon
        break;
      let cos = (ax * bx + ay * by) / la / lb;
      if (cos < -1) cos = -1;
      if (cos > 1) cos = 1;
      const alpha = Math.acos(cos);
      const det = ax * by - ay * bx;
      if (Math.abs(det) <= EPS && Math.abs(alpha - Math.PI) <= EPS)
        // the point is on a rib of the polygon
        break;
      if (det >= 0) asum += alpha;
      else asum -= alpha;
    }
    if (i == polygon.length && Math.round(asum / Math.PI / 2) % 2 == 0)
      continue;
    result.push(p);
  }
  return result;
};

const SelectRegionDialog = WDialog.extend({
  statics: {
    TYPE: "SelectRegionDialog"
  },

  initialize: function(map = window.map, options) {
    this.type = SelectRegionDialog.TYPE;
    WDialog.prototype.initialize.call(this, map, options);
    this._operation = getSelectedOperation();
    this._title = wX("NO_TITLE"); // should never be displayed
    this._label = wX("NO_LABEL"); // should never be displayed
    this.placeholder = "";
    this.current = "";
    this.portalSet = new Map();
    //postToFirebase({ id: "analytics", action: SelectRegionDialog.TYPE });
  },

  addHooks: function() {
    if (!this._map) return;
    WDialog.prototype.addHooks.call(this);
    window.addHook("pluginDrawTools", this.onPluginDrawTools.bind(this));
    this._displayDialog();
  },

  removeHooks: function() {
    window.removeLayerGroup(this._layerGroup);
    window.removeHook("pluginDrawTools", this.onPluginDrawTools.bind(this));
    WDialog.prototype.removeHooks.call(this);
  },

  onPluginDrawTools: function(draw) {
    const event = draw.event; // layerCreated
    if (event == "layerCreated") {
      const layer = draw.layer;
      if (layer instanceof L.Marker) {
        //pass
      }
      if (layer instanceof L.Polygon) {
        const polygon = layer.getLatLngs();
        const portals = filterPolygon(
          getAllPortalsOnScreen(this._operation),
          polygon
        );
        for (const p of portals) this.portalSet.set(p.id, p);
      }
    }
    if (event == "layersDeleted" || event == "layersEdited") {
      const allPortals = Array.from(this.portalSet.values());
      this.portalSet.clear();
      for (const layer of window.plugin.drawTools.drawnItems.getLayers()) {
        if (layer instanceof L.Polygon) {
          const polygon = layer.getLatLngs();
          const portals = filterPolygon(allPortals, polygon);
          for (const p of portals) this.portalSet.set(p.id, p);
        }
      }
      if (event == "layersEdited") {
        const portalsOnScreen = getAllPortalsOnScreen(this._operation);
        for (const layer of window.plugin.drawTools.drawnItems.getLayers()) {
          if (layer instanceof L.Polygon) {
            const polygon = layer.getLatLngs();
            const portals = filterPolygon(portalsOnScreen, polygon);
            for (const p of portals) this.portalSet.set(p.id, p);
          }
        }
      }
    }

    this._setDisplay.textContent = wX("PORTAL_COUNT", this.portalSet.size);
  },

  _displayDialog: function() {
    const buttons = {};
    buttons[wX("OK")] = () => {
      if (this._callback) this._callback();
      this._dialog.dialog("close");
    };
    buttons[wX("CANCEL")] = () => {
      if (this._cancelCallback) this._cancelCallback();
      this._dialog.dialog("close");
    };

    this._dialog = window.dialog({
      title: this._title,
      html: this._buildContent(),
      width: "auto",
      dialogClass: "wasabee-dialog wasabee-dialog-selectregion",
      closeCallback: () => {
        this.disable();
        delete this._dialog;
      }
    });
    this._dialog.dialog("option", "buttons", buttons);
  },

  setup: function(title, label, callback) {
    this._title = title;
    this._label = label;
    if (callback) this._callback = callback;
  },

  _buildContent: function() {
    const content = L.DomUtil.create("div", "container");
    if (typeof this._label == "string") {
      const label = L.DomUtil.create("label", null, content);
      label.textContent = this._label;
    } else {
      content.appendChild(this._label);
    }

    this._setDisplay = L.DomUtil.create("span", null, content);
    this._setDisplay.textContent = wX("NOT_SET");

    return content;
  }
});

export default SelectRegionDialog;
