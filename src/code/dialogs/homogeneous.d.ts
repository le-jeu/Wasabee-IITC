import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeeOp from "../model/operation";
declare class HomogeneousDialog extends WDialog {
    needWritePermission: true;
    _layerGroup: L.LayerGroup;
    _anchorDisplayOne: HTMLSpanElement;
    _anchorOne: any;
    _anchorDisplayTwo: HTMLSpanElement;
    _anchorTwo: any;
    _anchorDisplayThree: HTMLSpanElement;
    _anchorThree: any;
    depthMenu: HTMLSelectElement;
    orderMenu: HTMLSelectElement;
    _fullSearchCheck: HTMLInputElement;
    _redrawButton: HTMLButtonElement;
    _operation: WasabeeOp;
    _tree: any;
    _urp: L.LatLng;
    _failed: number;
    _colors: string[];
    _trash: any;
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): void;
    constructor(options?: WDialogOptions);
    hfield(): void;
    hdeepfield(): void;
    _draw(): void;
    _recurser(depth: any, portalsCovered: any, one: any, two: any, three: any): {
        success: boolean;
        anchors: any[];
        split: number;
        portal: any;
        children: any;
    } | {
        success: boolean;
        anchors: any[];
        split: number;
    };
    _fullRecurser(portalsCovered: any, one: any, two: any, three: any): any;
    _drawTreeCore(tree: any): void;
    _drawTreeBase(tree: any, one: any, two: any): void;
    _getSubregions(centerPoint: any, possibles: any, one: any, two: any, three: any): any[][];
    _getCenter(a: any, b: any, c: any): import("../../types/leaflet").LatLng;
    _fieldCovers(a: any, b: any, c: any, p: any): boolean;
}
export default HomogeneousDialog;
