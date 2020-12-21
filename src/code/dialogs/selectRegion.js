import { WDialog } from "../leafletClasses";
import wX from "../wX";
import { getSelectedOperation } from "../selectedOp";
import { getAllPortalsOnScreen } from "../uiCommands";

// generic confirmation screen w/ ok and cancel buttons

const SelectRegionDialog = WDialog.extend({
  statics: {
    TYPE: "selectRegionDialog",
  },

  options: {
    // title
    // portalCallback
  },

  addHooks: function () {
    WDialog.prototype.addHooks.call(this);

    this._layerGroup = new L.LayerGroup();
    window.addLayerGroup("Wasabee Selection Region", this._layerGroup, true);
    this.portalSet = new Map();

    this._defaultSet = new Map();
    this._drawlayers = new Map();
    this._drawlayers.set("default", this._defaultSet);

    window.map.on("draw:created", this.addLayer, this);
    window.map.on("draw:edited", this.refreshLayer, this);
    window.map.on("draw:deleted", this.refreshLayer, this);

    this._displayDialog();
  },

  removeHooks: function () {
    window.map.off("draw:created", this.addLayer, this);
    window.map.off("draw:edited", this.refreshLayer, this);
    window.map.off("draw:deleted", this.refreshLayer, this);

    this._clearLayers();

    window.removeLayerGroup(this._layerGroup);
    WDialog.prototype.removeHooks.call(this);
  },

  addLayer: function (e) {
    const layer = e.layer;
    if (e.layerType == "polygon") {
      const set = new Map();
      this._drawlayers.set(layer._leaflet_id, set);
      layer.setStyle({ color: "#3388ff" }); //default
      for (const p of getAllPortalsOnScreen(getSelectedOperation())) {
        if (this.polygonContains(layer.getLatLngs(), p)) {
          this.portalSet.set(p.id, p);
          set.set(p.id, p);
        }
      }
      this._updateCount();
    }
  },

  refreshLayer: function (e) {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      if (this._drawlayers.has(layer._leaflet_id)) {
        this._drawlayers.delete(layer._leaflet_id);
        window.plugin.drawTools.drawnItems.removeLayer(layer);
        window.plugin.drawTools.save();
      }
    });
    this.portalSet.clear();
    for (const set of this._drawlayers.values())
      for (const [id, p] of set) this.portalSet.set(id, p);
    this._updateCount();
  },

  _clearLayers: function () {
    if (window.plugin.drawTools) {
      const drawnItems = window.plugin.drawTools.drawnItems;
      drawnItems.eachLayer((layer) => {
        if (this._drawlayers.has(layer._leaflet_id))
          drawnItems.removeLayer(layer);
      });
      window.plugin.drawTools.save();
    }
    this._drawlayers.clear();
    this._drawlayers.set("default", this._defaultSet);
  },

  polygonContains(polygon, point) {
    let asum = 0;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, ++i) {
      const ax = polygon[i].lng - +point.lng;
      const ay = polygon[i].lat - +point.lat;
      const bx = polygon[j].lng - +point.lng;
      const by = polygon[j].lat - +point.lat;
      const la = Math.sqrt(ax * ax + ay * ay);
      const lb = Math.sqrt(bx * bx + by * by);
      if (Math.abs(la) < 1e-5 || Math.abs(lb) < 1e-5) return true;
      let cos = (ax * bx + ay * by) / la / lb;
      if (cos < -1) cos = -1;
      if (cos > 1) cos = 1;
      const alpha = Math.acos(cos);
      const det = ax * by - ay * bx;
      if (Math.abs(det) < 1e-10 && Math.abs(alpha - Math.PI) < 0.1) return true;
      if (det >= 0) asum += alpha;
      else asum -= alpha;
    }
    if (Math.round(asum / Math.PI / 2) % 2 === 0) return false;

    return true;
  },

  _displayDialog: function () {
    const buttons = {};
    buttons[wX("OK")] = () => {
      if (this.options.portalCallback)
        this.options.portalCallback(Array.from(this.portalSet.values()));
      this._dialog.dialog("close");
    };

    this.createDialog({
      title: this.options.title,
      html: this._buildContent(),
      width: "auto",
      dialogClass: "select-region",
      buttons: buttons,
    });
  },

  _updateCount() {
    if (this.portalSet.size)
      this._statusDisplay.textContent = wX("PORTAL_COUNT", {
        count: this.portalSet.size,
      });
    else this._statusDisplay.textContent = wX("NOT_SET");
  },

  _buildContent: function () {
    const container = L.DomUtil.create("div", "container");

    const addAll = L.DomUtil.create("button", null, container);
    addAll.textContent = wX("SELECT_REGION_ADD_BUTTON");
    const clearSelection = L.DomUtil.create("button", null, container);
    clearSelection.textContent = wX("SELECT_REGION_CLEAR_BUTTON");

    this._statusDisplay = L.DomUtil.create("div", null, container);
    this._statusDisplay.textContent = wX("NOT_SET");

    L.DomEvent.on(addAll, "click", () => {
      L.rectangle(window.map.getBounds()).addTo(this._layerGroup);
      for (const p of getAllPortalsOnScreen(getSelectedOperation())) {
        this.portalSet.set(p.id, p);
        this._defaultSet.set(p.id, p);
      }
      this._updateCount();
    });

    L.DomEvent.on(clearSelection, "click", () => {
      this.portalSet.clear();
      this._defaultSet.clear();
      this._clearLayers();
      this._layerGroup.clearLayers();
      this._statusDisplay.textContent = wX("NOT_SET");
    });
    return container;
  },
});

export default SelectRegionDialog;
