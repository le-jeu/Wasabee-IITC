import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeePortal from "../model/portal";
declare class FanfieldDialog extends WDialog {
    _anchor: WasabeePortal;
    _start: WasabeePortal;
    _end: WasabeePortal;
    _anchorDisplay: HTMLSpanElement;
    _startDisplay: HTMLSpanElement;
    _endDisplay: HTMLSpanElement;
    _invert: boolean;
    addHooks(): void;
    _displayDialog(): void;
    constructor(options?: WDialogOptions);
    fanfield(): void;
    _draw(sorted: WasabeePortal[]): void;
    _angle(a: any, p: any): number;
}
export default FanfieldDialog;
