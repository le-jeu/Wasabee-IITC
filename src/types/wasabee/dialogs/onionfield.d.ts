import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeePortal from "../model/portal";
import WasabeeLink from "../model/link";
import WasabeeOp from "../model/operation";
declare class OnionfieldDialog extends WDialog {
    needWritePermission: boolean;
    _anchorDisplay: HTMLSpanElement;
    _anchor: WasabeePortal;
    _operation: WasabeeOp;
    _colors: string[];
    _colorIterator: number;
    _color: string;
    _trash: string;
    addHooks(): void;
    _displayDialog(): void;
    constructor(options?: WDialogOptions);
    onion(): void;
    _removeFromList(portalsRemaining: any, guid: any): any[];
    _recurser(portalsRemaining: WasabeePortal[], thisPath: WasabeeLink[], one: WasabeePortal, two?: WasabeePortal, three?: WasabeePortal): any;
    _testBlock(current: WasabeeLink[], testing: WasabeeLink): boolean;
    _angle(a: WasabeePortal, b: WasabeePortal, c: WasabeePortal): number;
}
export default OnionfieldDialog;
