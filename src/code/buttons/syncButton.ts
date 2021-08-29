import { WButton } from "../leafletClasses";
import WasabeeMe from "../model/me";
import { fullSync } from "../uiCommands";
import wX from "../wX";


class SyncButton extends WButton {
  static TYPE = "syncButton";

  update () {
    const loggedIn = WasabeeMe.isLoggedIn();
    if (loggedIn) {
      this.button.style.display = "block";
    } else {
      this.button.style.display = "none";
    }
  }

  constructor (container) {
    super(container);
    this.type = SyncButton.TYPE;
    // this.handler = null; // no handler since we do it all in this.Wupdate()
    this.title = wX("SYNC");

    this.button = this._createButton({
      container: container,
      className: "wasabee-toolbar-sync",
      context: this,
      title: this.title,
      callback: async () => {
        this.button.classList.add("loading");
        await fullSync();
        this.button.classList.remove("loading");
      },
    });

    window.map.on("wasabee:ui:skin wasabee:ui:lang", () => {
      this.button.title = wX("SYNC");
    });

    window.map.on("wasabee:fullsync", () => {
      this.button.classList.remove("loading");
    });

    window.map.on("wasabee:login", () => {
      this.button.classList.add("loading");
    });

    // hide or show depeneding on logged in state
    this.update(); // container & operation not needed
  }
}

export default SyncButton;
