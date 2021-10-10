import * as L from "leaflet";

import { WDialog, WDialogOptions } from "../leafletClasses";
import wX from "../wX";
import WasabeeAgent from "../model/agent";


interface AgentDialogOptions extends WDialogOptions {
  gid: string
}

class AgentDialog extends WDialog {
  options: AgentDialogOptions;

  constructor(options: AgentDialogOptions) {
    super(options);
  }

  addHooks () {
    WDialog.prototype.addHooks.call(this);
    this._displayDialog();
  }

  async _displayDialog () {
    const html = L.DomUtil.create("div", null);
    const agent = L.DomUtil.create("div", null, html);

    try {
      const data = await WasabeeAgent.get(this.options.gid);
      const name = L.DomUtil.create("h2", "enl, wasabee-agent-label", agent);
      name.textContent = data.name;
      const vLabel = L.DomUtil.create("label", null, agent);
      vLabel.textContent = "V Verified: ";
      L.DomUtil.create("div", null, vLabel).textContent = data.Vverified.toString();
      const rocksLabel = L.DomUtil.create("label", null, agent);
      rocksLabel.textContent = "Rocks Verified: ";
      L.DomUtil.create("div", null, rocksLabel).textContent = data.rocks.toString();
      const img = L.DomUtil.create("img", null, agent);
      img.src = data.pic;
    } catch (e) {
      console.error(e);
      agent.innerHTML = e.toString();
    }

    const buttons = {};
    buttons[wX("OK")] = () => {
      this.closeDialog();
    };

    this.createDialog({
      title: wX("AGENT_STATS"),
      html: html,
      width: "auto",
      dialogClass: "agent",
      buttons: buttons,
    });
  }

  _displaySmallDialog () {
    this._displayDialog();
  }
}

export default AgentDialog;
