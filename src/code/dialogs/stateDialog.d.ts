import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeeLink from "../model/link";
import WasabeeMarker from "../model/marker";
interface StateDialogOptions extends WDialogOptions {
    target: WasabeeMarker | WasabeeLink;
    opID: string;
}
declare class StateDialog extends WDialog {
    needWritePermission: true;
    options: StateDialogOptions;
    _name: string;
    _html: HTMLDivElement;
    _targetID: string;
    _type: "Link" | "Marker";
    constructor(options: StateDialogOptions);
    addHooks(): void;
    _displayDialog(): void;
    _buildContent(): void;
    _getStateMenu(current: any): HTMLDivElement;
    setState(value: any): void;
}
export default StateDialog;
