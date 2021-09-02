import { WButton } from "../leafletClasses";
import MarkerAddDialog from "../dialogs/markerAddDialog";
import MarkerList from "../dialogs/markerList";
import { getSelectedOperation } from "../selectedOp";
import wX from "../wX";


class MarkerButton extends WButton {
  static TYPE = "MarkerButton";

  constructor (container) {
    super(container);
    this.type = MarkerButton.TYPE;
    this.title = wX("MARKERS BUTTON TITLE");
    this._container = container;

    this.button = this._createButton({
      container: this._container,
      className: "wasabee-toolbar-marker",
      callback: this._toggleActions,
      context: this,
      title: this.title,
    });

    this.actionsContainer = this._createSubActions(this.getSubActions());

    this._container.appendChild(this.actionsContainer);

    window.map.on("wasabee:ui:skin wasabee:ui:lang", this.update, this);
  }

  update () {
    this.button.title = wX("MARKERS BUTTON TITLE");
    const newSubActions = this._createSubActions(this.getSubActions());
    this._container.replaceChild(newSubActions, this.actionsContainer);
    newSubActions.style.display = this.actionsContainer.style.display;
    this.actionsContainer = newSubActions;
  }

  getSubActions () {
    const subActions = [];
    const op = getSelectedOperation();
    if (op.canWrite())
      subActions.push({
        title: wX("ADD MARKER TITLE"),
        text: wX("ADD_MARKER"),
        callback: () => {
          this.disable();
          const md = new MarkerAddDialog();
          md.enable();
        },
        context: this,
      });
    subActions.push({
      title: wX("MARKER LIST TITLE"),
      text: wX("MARKER LIST"),
      callback: () => {
        this.disable();
        const ml = new MarkerList();
        ml.enable();
      },
      context: this,
    });
    return subActions;
  }

  // enable: // default is good
  // disable: // default is good
  // Wupdate() { // nothing to do }
}

export default MarkerButton;
