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
    if (!this._map) return;
    WDialog.prototype.addHooks.call(this);

    this._layerGroup = new L.LayerGroup();
    window.addLayerGroup("Wasabee Selection Region", this._layerGroup, true);
    this.portalSet = new Map();

    this._displayDialog();
  },

  removeHooks: function () {
    window.removeLayerGroup(this._layerGroup);
    WDialog.prototype.removeHooks.call(this);
  },

  _displayDialog: function () {
    if (!this._map) return;

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

  _buildContent: function () {
    const container = L.DomUtil.create("div", "container");

    const addAll = L.DomUtil.create("button", null, container);
    addAll.textContent = "Add to selection all portals in view";
    const clearSelection = L.DomUtil.create("button", null, container);
    clearSelection.textContent = "Clear selection";

    const statusDisplay = L.DomUtil.create("div", null, container);
    statusDisplay.textContent = wX("NOT_SET");

    L.DomEvent.on(addAll, "click", () => {
      L.rectangle(window.map.getBounds()).addTo(this._layerGroup);
      for (const p of getAllPortalsOnScreen(getSelectedOperation())) {
        this.portalSet.set(p.id, p);
      }
      if (this.portalSet.size)
        statusDisplay.textContent = wX("PORTAL_COUNT", this.portalSet.size);
      else statusDisplay.textContent = wX("NOT_SET");
    });

    L.DomEvent.on(clearSelection, "click", () => {
      this.portalSet.clear();
      this._layerGroup.clearLayers();
      statusDisplay.textContent = wX("NOT_SET");
    });
    return container;
  },
});

export default SelectRegionDialog;
