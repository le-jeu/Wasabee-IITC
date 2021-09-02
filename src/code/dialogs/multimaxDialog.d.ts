import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeePortal from "../model/portal";
import WasabeeOp from "../model/operation";
declare class MultimaxDialog extends WDialog {
    needWritePermission: boolean;
    _anchorOneDisplay: HTMLSpanElement;
    _anchorOne: WasabeePortal;
    _anchorTwoDisplay: HTMLSpanElement;
    _anchorTwo: WasabeePortal;
    _flcheck: HTMLInputElement;
    _orderFromEnd: HTMLInputElement;
    _urp: L.LatLng;
    _operation: WasabeeOp;
    addHooks(): void;
    _displayDialog(): void;
    constructor(options?: WDialogOptions);
    MM(pOne: WasabeePortal, pTwo: WasabeePortal, portals: WasabeePortal[], order?: number, // first link is order + 1
    base?: boolean, commentPrefix?: string): any[];
    doMultimax(): any;
    fieldCoversPortal(a: any, b: any, c: any, p: any): boolean;
    buildPOSet(anchor1: any, anchor2: any, visible: any): Map<any, any>;
    longestSequencesPoset(poset: any): {
        maxima: any;
        poset: Map<any, any>;
        number: any;
    };
    longestSequence(poset: any, start: any, dist: any): any;
}
export default MultimaxDialog;
