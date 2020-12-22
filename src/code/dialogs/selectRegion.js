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

    this._layerGroup = new L.FeatureGroup();
    window.addLayerGroup("Wasabee Selection Region", this._layerGroup, true);
    this.portalSet = new Map();

    this._defaultSet = new Map();
    this._drawlayers = new Map();
    this._drawlayers.set("default", this._defaultSet);

    window.map.on("draw:created", this._addLayer, this);
    window.map.on("draw:edited", this._refreshLayer, this);
    window.map.on("draw:deleted", this._refreshLayer, this);

    this._setupControl();

    this._displayDialog();
  },

  removeHooks: function () {
    window.map.removeControl(this._drawControl);

    if (window.plugin.drawTools) {
      window.plugin.drawTools.addDrawControl();
    }

    window.map.off("draw:created", this._addLayer, this);
    window.map.off("draw:edited", this._refreshLayer, this);
    window.map.off("draw:deleted", this._refreshLayer, this);

    this._clearLayers();

    window.removeLayerGroup(this._layerGroup);
    WDialog.prototype.removeHooks.call(this);
  },

  _setupControl: function () {
    const polygonOptions = {
      stroke: true,
      color: "#ff7744",
      weight: 4,
      opacity: 1,
      fill: true,
      fillColor: "#ff7744", // to use the same as 'color' for fill
      fillOpacity: 0.2,
      dashArray: "",
    };
    const editOptions = L.extend({}, polygonOptions, {
      dashArray: "10,10",
    });

    const toolbarOptions = {
      draw: {
        rectangle: false,
        circlemarker: false,
        polygon: {
          shapeOptions: polygonOptions,
        },
        polyline: false,
        circle: false,
        marker: false,
      },

      edit: {
        featureGroup: this._layerGroup,
        edit: {
          selectedPathOptions: editOptions,
        },
      },
    };
    if (window.plugin.drawTools)
      window.map.removeControl(window.plugin.drawTools.drawControl);
    this._drawControl = new L.Control.Draw(toolbarOptions);
    window.map.addControl(this._drawControl);
  },

  _addLayer: function (e) {
    const layer = e.layer;
    if (e.layerType == "polygon") {
      this._layerGroup.addLayer(layer);
      const set = new Map();
      this._drawlayers.set(layer._leaflet_id, set);
      let latLngs = layer.getLatLngs();
      // for multipolygon, I don't get how this is possible
      if (latLngs.length == 1) latLngs = latLngs[0];
      for (const p of getAllPortalsOnScreen(getSelectedOperation())) {
        if (this._polygonContains(latLngs, p)) {
          this.portalSet.set(p.id, p);
          set.set(p.id, p);
        }
      }
      this._updateCount();
    }
  },

  _refreshLayer: function (e) {
    const layers = e.layers;
    layers.eachLayer((layer) => {
      if (this._drawlayers.has(layer._leaflet_id)) {
        if (e.type == "draw:edited") {
          const set = this._drawlayers.get(layer._leaflet_id);
          const oldSet = new Set(set);
          set.clear();
          let latLngs = layer.getLatLngs();
          // for multipolygon, I don't get how this is possible
          if (latLngs.length == 1) latLngs = latLngs[0];
          for (const [id, p] of oldSet) {
            if (this._polygonContains(latLngs, p)) {
              set.set(id, p);
            }
          }
          for (const p of getAllPortalsOnScreen(getSelectedOperation())) {
            if (!set.has(p.id) && this._polygonContains(latLngs, p)) {
              set.set(p.id, p);
            }
          }
        } else {
          this._drawlayers.delete(layer._leaflet_id);
        }
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

  // adapted from fanfield2.filterPolygon
  // does not care about curves, but this is supposed to be used
  // with z15
  _polygonContains(polygon, point) {
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
