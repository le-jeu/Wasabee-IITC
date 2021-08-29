import { WDialog, WDialogOptions } from "../leafletClasses";
import wX from "../wX";

// generic prompt screen


interface PromptDialogOptions extends WDialogOptions {
  title: string,
  label: string,
  placeholder?: string,
  current?: string,
  suggestions?: { text: string, value: string}[],
  callback?: () => void,
  cancelCallback?: () => void,
}

class PromptDialog extends WDialog {
  inputField: HTMLInputElement;

  options: PromptDialogOptions;

  constructor (options: PromptDialogOptions) {
    options.placeholder = options.placeholder || "";
    options.current = options.current || "";
    super(options);
  }

  addHooks () {
    WDialog.prototype.addHooks.call(this);
    this._displayDialog();
  }

  removeHooks () {
    WDialog.prototype.removeHooks.call(this);
  }

  _displayDialog () {
    const buttons = {};
    buttons[wX("OK")] = () => {
      if (this.options.callback) this.options.callback();
      // callback must fire appropriate ui update events
      this.closeDialog();
    };
    buttons[wX("CANCEL")] = () => {
      if (this.options.cancelCallback) this.options.cancelCallback();
      // cancelCallback must fire appropriate ui update events
      this.closeDialog();
    };

    this.createDialog({
      title: this.options.title,
      html: this._buildContent(),
      width: "auto",
      dialogClass: "prompt",
      buttons: buttons,
    });
  }

  _buildContent () {
    const content = L.DomUtil.create("div", "container");
    if (typeof this.options.label == "string") {
      const label = L.DomUtil.create("label", null, content);
      label.textContent = this.options.label;
    } else {
      content.appendChild(this.options.label);
    }
    this.inputField = L.DomUtil.create("input", null, content);
    this.inputField.id = "inputField";
    this.inputField.placeholder = this.options.placeholder;
    this.inputField.value = this.options.current;

    if (this.options.suggestions) {
      const datalist = L.DomUtil.create("datalist", null, content);
      datalist.id = "wasabee-prompt-suggestions";
      for (const entry of this.options.suggestions) {
        const option = L.DomUtil.create("option", null, datalist);
        if (typeof entry === "string") {
          option.value = entry;
        } else {
          option.textContent = entry.text;
          option.value = entry.value;
        }
      }
      this.inputField.setAttribute("list", "wasabee-prompt-suggestions");
    }
    return content;
  }
}

export default PromptDialog;
