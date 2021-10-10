import * as L from "leaflet";

import { WDialog, WDialogOptions } from "../leafletClasses";
import Sortable from "../sortable";
import WasabeeTeam from "../model/team";
import wX from "../wX";

import AgentUI from "../ui/agent";
import type WasabeeAgent from "../model/agent";


interface TeamMembershipListOptions extends WDialogOptions {
  teamID: string;
}

class TeamMembershipList extends WDialog {
  options: TeamMembershipListOptions;

  constructor (options: TeamMembershipListOptions) {
    super(options)
  }

  addHooks () {
    WDialog.prototype.addHooks.call(this);
    window.map.on("wasabee:logout", this.closeDialog, this);
    this._displayDialog().catch((e) => {
      console.error(e);
      alert(e.toString());
    });
  }

  removeHooks () {
    WDialog.prototype.removeHooks.call(this);
    window.map.off("wasabee:logout", this.closeDialog, this);
  }

  async _displayDialog () {
    const table = this._setupTable();

    const team = await WasabeeTeam.get(this.options.teamID, 10); // max cache age of 10 seconds
    table.items = team.getAgents();

    const buttons = {};
    buttons[wX("OK")] = () => {
      this.closeDialog();
    };

    this.createDialog({
      title: team.name,
      html: table.table,
      width: "auto",
      dialogClass: "teamlist",
      buttons: buttons,
    });
  }

  _setupTable () {
    const table = new Sortable<WasabeeAgent>();
    table.fields = [
      {
        name: wX("AGENT"),
        value: (agent) => agent.name,
        sort: (a, b) => a.localeCompare(b),
        format: async (cell, value, agent) =>
          cell.appendChild(
            await AgentUI.formatDisplay(agent, this.options.teamID)
          ),
      },
      {
        name: wX("SQUAD"),
        value: (agent) => agent.squad,
        sort: (a, b) => a.localeCompare(b),
        // , format: (cell, value) => (cell.textContent = value)
      },
      {
        name: "Sharing Location",
        value: (agent) => agent.state,
        sort: (a, b) => a.localeCompare(b),
        format: (cell, value) => {
          if (value) cell.textContent = "✅";
        },
      },
      {
        name: "Sharing W-D Keys",
        value: (agent) => agent.ShareWD,
        sort: (a, b) => a.localeCompare(b),
        format: (cell, value) => {
          if (value) cell.textContent = "✅";
        },
      },
    ];
    table.sortBy = 0;

    return table;
  }
}

export default TeamMembershipList;
