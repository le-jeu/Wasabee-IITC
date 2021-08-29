import { WDialog } from "../leafletClasses";
import Sortable from "../sortable";
import wX from "../wX";
import WasabeeMe from "../model/me";
import WasabeePortal from "../model/portal";
import { getAgentWasabeeDkeys, WDKey } from "../wd";

import PortalUI from "../ui/portal";

class WasabeeDList extends WDialog {
  _UIUpdateHook: () => void;
  _me: WasabeeMe;

  async addHooks () {
    WDialog.prototype.addHooks.call(this);
    const context = this;
    this._UIUpdateHook = () => {
      context.update();
    };
    this._me = await WasabeeMe.waitGet();
    await this._displayDialog();
    window.addHook("portalDetailLoaded", this._UIUpdateHook);
  }

  removeHooks () {
    WDialog.prototype.removeHooks.call(this);
    window.removeHook("portalDetailLoaded", this._UIUpdateHook);
  }

  async update () {
    const sortable = await this.getListDialogContent();
    this.setContent(sortable.table);
  }

  async _displayDialog () {
    const sortable = await this.getListDialogContent();

    const buttons = {};
    buttons[wX("OK")] = () => {
      this.closeDialog();
    };

    this.createDialog({
      title: wX("WASABEE_D_LIST"),
      html: sortable.table,
      width: "auto",
      dialogClass: "wasabeedlist",
      buttons: buttons,
      id: window.plugin.wasabee.static.dialogNames.wasabeeDList,
    });
  }

  async getListDialogContent () {
    const content = new Sortable<WDKey>();
    content.fields = [
      {
        name: wX("PORTAL"),
        value: (n) => {
          if (n.Name) return n.Name;
          return n.PortalID;
        },
        sort: (a, b) => a.localeCompare(b),
        format: (cell, value, n) => {
          const p = new WasabeePortal({
            id: n.PortalID,
            name: n.Name,
            lat: n.Lat,
            lng: n.Lng,
          });
          cell.appendChild(PortalUI.displayFormat(p, this._smallScreen));
        },
      },
      {
        name: wX("COUNT"),
        value: (key) => key.Count,
        sort: (a, b) => a - b,
        format: (cell, value) => {
          cell.textContent = value;
        },
      },
      {
        name: wX("CAPSULE"),
        value: (key) => key.CapID,
        sort: (a, b) => a.localeCompare(b),
        format: (cell, value) => {
          cell.textContent = value;
        },
      },
    ];
    content.sortBy = 0;

    content.items = await getAgentWasabeeDkeys(this._me.GoogleID);

    return content;
  }
}

export default WasabeeDList;
