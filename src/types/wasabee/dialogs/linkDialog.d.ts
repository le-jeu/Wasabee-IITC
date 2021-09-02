import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeePortal from "../model/portal";
declare class LinkDialog extends WDialog {
    needWritePermission: boolean;
    _source: WasabeePortal;
    _anchor1: WasabeePortal;
    _anchor2: WasabeePortal;
    _sourceDisplay: HTMLSpanElement;
    _anchor1Display: HTMLSpanElement;
    _desc: HTMLInputElement;
    _anchor2Display: HTMLSpanElement;
    constructor(options?: WDialogOptions);
    addHooks(): void;
    _displayDialog(): void;
}
export default LinkDialog;
