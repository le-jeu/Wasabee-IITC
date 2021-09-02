import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeePortal from "../model/portal";
declare class SaveLinksDialog extends WDialog {
    needWritePermission: boolean;
    _anchorDisplay: HTMLDivElement;
    _anchor: WasabeePortal;
    addHooks(): void;
    _displayDialog(): void;
    constructor(options?: WDialogOptions);
    saveLinks(): void;
}
export default SaveLinksDialog;
