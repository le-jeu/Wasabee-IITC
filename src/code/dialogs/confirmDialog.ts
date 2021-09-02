import { WDialog,WDialogOptions  } from "../leafletClasses";
import wX from "../wX";

// generic confirmation screen w/ ok and cancel buttons

interface ConfirmDialogOptions extends WDialogOptions {
  title: string,
  label: string | HTMLElement,
  type?: "agent" | "anchor" | "link" | "marker" | "zone" | "operation" | "team",
  callback?: () => any,
  cancelCallback?: () => any
}

class ConfirmDialog extends WDialog {
  constructor(options: ConfirmDialogOptions) {
    super(options);
  };

  _skippable () {
    const level =
      localStorage[window.plugin.wasabee.static.constants.SKIP_CONFIRM];
    if (level === "always") return true;
    if (level === "entity") {
      switch (this.options.type) {
        case "anchor":
        case "link":
        case "marker":
        case "zone":
        case "agent":
          return true;
        // no default
      }
    }
    return false;
  }

  addHooks () {
    WDialog.prototype.addHooks.call(this);
    if (this._skippable()) {
      console.log("skipping dialog display");
      if (this.options.callback) this.options.callback();
    } else {
      this._displayDialog();
    }
  }

  _displayDialog () {
    const buttons = {};
    buttons[wX("OK")] = () => {
      if (this.options.callback) this.options.callback();
      this.closeDialog();
    };
    buttons[wX("CANCEL")] = () => {
      if (this.options.cancelCallback) this.options.cancelCallback();
      this.closeDialog();
    };

    this.createDialog({
      title: this.options.title,
      html: this._buildContent(),
      width: "auto",
      dialogClass: "confirm",
      buttons: buttons,
      // id: window.plugin.wasabee.static.dialogNames.XXX
    });
  }

  _buildContent () {
    const content = L.DomUtil.create("div", "title");
    if (typeof this.options.label == "string") {
      content.textContent = this.options.label;
    } else {
      content.appendChild(this.options.label);
    }
    return content;
  }
}

export default ConfirmDialog;
