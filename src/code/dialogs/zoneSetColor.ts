import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeeZone from "../model/zone";
import { getSelectedOperation } from "../selectedOp";
import { addToColorList } from "../skin";


interface ZoneSetColorDialogOptions extends WDialogOptions {
  zone: WasabeeZone,
}

class ZoneSetColorDialog extends WDialog {
  needWritePermission = true;

  options: ZoneSetColorDialogOptions;

  constructor (options: ZoneSetColorDialogOptions) {
    super(options);
  }

  addHooks () {
    WDialog.prototype.addHooks.call(this);
    this._displayDialog();
  }

  _displayDialog () {
    this.createDialog({
      title: "Zone color",
      html: this._buildContent(),
      width: "auto",
      dialogClass: "zone-color",
    });
  }

  _buildContent () {
    const container = L.DomUtil.create("div", "container");
    const desc = L.DomUtil.create("div", "desc", container);
    desc.textContent =
      "Set the color of all links in zone " + this.options.zone.name;

    const picker = L.DomUtil.create("input", "picker", container);
    picker.type = "color";
    picker.setAttribute("list", "wasabee-colors-datalist");

    L.DomEvent.on(picker, "change", async (ev) => {
      L.DomEvent.stop(ev);
      const so = getSelectedOperation();
      for (const l of so.links) {
        if (l.zone == this.options.zone.id) l.color = picker.value;
      }
      await so.store();
      addToColorList(picker.value);
      window.map.fire("wasabee:op:change");
    });

    return container;
  }
}

export default ZoneSetColorDialog;
