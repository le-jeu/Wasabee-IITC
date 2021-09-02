import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeeLink from "../model/link";
import WasabeeMarker from "../model/marker";
import WasabeePortal from "../model/portal";
interface AssignDialogOptions extends WDialogOptions {
    target: WasabeeLink | WasabeeMarker | WasabeePortal;
}
declare class AssignDialog extends WDialog {
    needWritePermission: boolean;
    options: AssignDialogOptions;
    _html: HTMLDivElement;
    _name: string;
    _targetID: string;
    _type: "Link" | "Marker" | "Anchor";
    _label: string | HTMLDivElement;
    constructor(options: AssignDialogOptions);
    addHooks(): void;
    _displayDialog(): void;
    _setup(): Promise<void>;
    _buildContent(): HTMLDivElement;
    _getAgentMenu(current: string | null): Promise<HTMLDivElement>;
    localAssign(value: any): void;
}
export default AssignDialog;
