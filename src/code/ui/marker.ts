import * as L from "leaflet";

import WasabeeAgent from "../model/agent";

import SetCommentDialog from "../dialogs/setCommentDialog";
import MarkerChangeDialog from "../dialogs/markerChangeDialog";
import StateDialog from "../dialogs/stateDialog";
import { getSelectedOperation } from "../selectedOp";
import { deleteMarker } from "../uiCommands";

import AgentUI from "./agent";
import PortalUI from "./portal";

import wX from "../wX";
import type WasabeeMarker from "../model/marker";


class WLMarker extends PortalUI.WLPortal {
  state: string;

  constructor (marker: WasabeeMarker) {
    super({
      portalId: marker.portalId,
      id: marker.ID,
      icon: L.divIcon({
        className: `wasabee-marker-icon ${marker.type} wasabee-status-${marker.state}`,
        shadowUrl: null,
        iconSize: L.point(24, 40),
        iconAnchor: L.point(12, 40),
        popupAnchor: L.point(-1, -48),
      }),
    });
    this.state = marker.state,
    this.type = "marker";
  }

  setState (state: string) {
    if (state != this.state) {
      L.DomUtil.removeClass(this.getElement(), `wasabee-status-${this.state}`);
      L.DomUtil.addClass(this.getElement(), `wasabee-status-${state}`);
      this.state = state;
    }
  }

  _popupContent () {
    const operation = getSelectedOperation();
    const marker = operation.getMarker(this.options.id);
    const portal = operation.getPortal(marker.portalId);

    if (portal == null) {
      console.log("null portal getting marker popup");
      return (L.DomUtil.create("div", "wasabee-marker-popup").textContent =
        "invalid portal");
    }

    const canWrite = operation.canWrite();

    const content = PortalUI.WLPortal.prototype._popupContent.call(this);

    const desc = L.DomUtil.create("div", "desc", content);
    const kind = L.DomUtil.create(
      "span",
      `wasabee-marker-popup-kind ${marker.type}`,
      desc
    );
    kind.textContent = wX(marker.type);
    desc.appendChild(PortalUI.displayFormat(portal));
    if (canWrite) {
      L.DomEvent.on(kind, "click", this._setMarkerType, this);
    }
    this._popupMarkerComment(desc, marker, canWrite);
    this._popupPortalComments(desc, portal, canWrite);

    this._popupAssignState(content, marker);

    const buttonSet = L.DomUtil.create(
      "div",
      "wasabee-marker-buttonset",
      content
    );
    if (canWrite) this._deleteButton(buttonSet, wX("DELETE_ANCHOR"));
    if (operation.canWriteServer())
      this._assignButton(buttonSet, wX("ASSIGN"), marker);
    if (canWrite) this._stateButton(buttonSet, marker);
    if (operation.isOnCurrentServer())
      this._sendTargetButton(buttonSet, wX("SEND TARGET"), marker);
    this._mapButton(buttonSet, wX("ANCHOR_GMAP"));

    return content;
  }

  _popupMarkerComment (container, marker, canWrite) {
    if (marker.comment) {
      const comment = L.DomUtil.create(
        "div",
        "wasabee-marker-popup-comment",
        container
      );
      comment.textContent = marker.comment;
      if (canWrite) L.DomEvent.on(comment, "click", this._setComment, this);
    }
  }

  async _popupAssignState (container, marker) {
    const assignment = L.DomUtil.create(
      "div",
      "wasabee-popup-assignment",
      container
    );
    if (marker.state != "completed" && marker.assignedTo) {
      try {
        const a = await WasabeeAgent.get(marker.assignedTo);
        assignment.textContent = wX("ASS_TO"); // FIXME convert formatDisplay to html and add as value to wX
        if (a) assignment.appendChild(await AgentUI.formatDisplay(a));
        else assignment.textContent += " " + marker.assignedTo;
      } catch (err) {
        console.error(err);
      }
    }
    if (marker.state == "completed" && marker.completedID) {
      try {
        const a = await WasabeeAgent.get(marker.completedID);
        assignment.innerHTML = wX("COMPLETED BY", {
          agentName: a ? a.name : marker.completedID,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  _stateButton (container, marker) {
    const operation = getSelectedOperation();
    const stateButton = L.DomUtil.create("button", null, container);
    stateButton.textContent = wX("MARKER STATE");
    L.DomEvent.on(stateButton, "click", (ev) => {
      L.DomEvent.stop(ev);
      const sd = new StateDialog({ target: marker, opID: operation.ID });
      sd.enable();
      this.closePopup();
    });
  }

  _deleteAction () {
    const operation = getSelectedOperation();
    const portal = operation.getPortal(this.options.portalId);
    const marker = operation.getMarker(this.options.id);
    deleteMarker(operation, marker, portal);
  }

  _setComment (ev) {
    L.DomEvent.stop(ev);
    const operation = getSelectedOperation();
    const marker = operation.getMarker(this.options.id);
    const scd = new SetCommentDialog({
      target: marker,
      operation: operation,
    });
    scd.enable();
    this.closePopup();
  }

  _setMarkerType (ev) {
    L.DomEvent.stop(ev);
    const operation = getSelectedOperation();
    const marker = operation.getMarker(this.options.id);
    const ch = new MarkerChangeDialog({ marker: marker });
    ch.enable();
    this.closePopup();
  }
}

export default {
  WLMarker,
};
