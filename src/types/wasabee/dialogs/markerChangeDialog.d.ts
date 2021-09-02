import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeeMarker from "../model/marker";
interface MarkerChangeDialogOptions extends WDialogOptions {
    marker: WasabeeMarker;
}
declare class MarkerChangeDialog extends WDialog {
    needWritePermission: true;
    options: MarkerChangeDialogOptions;
    _type: HTMLSelectElement;
    constructor(options: MarkerChangeDialogOptions);
    addHooks(): void;
    _displayDialog(): void;
}
export default MarkerChangeDialog;
