import { WDialogOptions } from "../leafletClasses";
import WasabeePortal from "../model/portal";
import MultimaxDialog from "./multimaxDialog";
import WasabeeOp from "../model/operation";
declare class MadridDialog extends MultimaxDialog {
    needWritePermission: boolean;
    _anchorOneDisplay: HTMLSpanElement;
    _anchorOne: WasabeePortal;
    _setOneDisplay: HTMLSpanElement;
    _portalSetOne: WasabeePortal[];
    _anchorTwoDisplay: HTMLSpanElement;
    _anchorTwo: WasabeePortal;
    _setTwoDisplay: HTMLSpanElement;
    _portalSetTwo: WasabeePortal[];
    _setThreeDisplay: HTMLSpanElement;
    _portalSetThree: WasabeePortal[];
    _flcheck: HTMLInputElement;
    _balancedcheck: HTMLInputElement;
    _operation: WasabeeOp;
    _displayDialog(): void;
    constructor(options?: WDialogOptions);
    getSpine(pOne: WasabeePortal, pTwo: WasabeePortal, portals: WasabeePortal[]): any;
    doBalancedMadrid(): number;
    doMadrid(): number;
}
export default MadridDialog;
