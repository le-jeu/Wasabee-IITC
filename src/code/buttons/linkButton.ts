import { WButton } from "../leafletClasses";
import LinkDialog from "../dialogs/linkDialog";
import AutodrawsDialog from "../dialogs/autodraws";
import wX from "../wX";


class LinkButton extends WButton {
  static TYPE = "LinkButton";

  needWritePermission = true;

  constructor (container) {
    super(container);
    this.type = LinkButton.TYPE;
    this.title = wX("LINKS BUTTON TITLE");

    this.button = this._createButton({
      container: this._container,
      className: "wasabee-toolbar-link",
      callback: this._toggleActions,
      context: this,
      title: this.title,
    });

    this.actionsContainer = this._createSubActions(this.getSubActions());

    this._container.appendChild(this.actionsContainer);

    window.map.on("wasabee:ui:skin wasabee:ui:lang", () => {
      this.button.title = wX("LINKS BUTTON TITLE");
      const newSubActions = this._createSubActions(this.getSubActions());
      this._container.replaceChild(newSubActions, this.actionsContainer);
      newSubActions.style.display = this.actionsContainer.style.display;
      this.actionsContainer = newSubActions;
    });
  }

  getSubActions () {
    return [
      {
        title: wX("ADD LINK TITLE"),
        text: wX("ADD_LINKS"),
        callback: () => {
          this.disable();
          const ld = new LinkDialog();
          ld.enable();
        },
        context: this,
      },
      {
        title: wX("AUTO_DRAWS"),
        text: wX("AUTO_DRAWS"),
        callback: () => {
          this.disable();
          const a = new AutodrawsDialog();
          a.enable();
        },
        context: this,
      },
    ];
  }

  // enable: // default is good
  // disable: // default is good
  // Wupdate() { // nothing to do }
}

export default LinkButton;
