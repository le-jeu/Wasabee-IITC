import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeeMarker from "../model/marker";
import WasabeePortal from "../model/portal";
interface SendTargetDialogOptions extends WDialogOptions {
    target: WasabeeMarker | WasabeePortal;
}
declare class SendTargetDialog extends WDialog {
    options: SendTargetDialogOptions;
    _html: HTMLDivElement;
    _targettype: string;
    _value: string;
    constructor(options: SendTargetDialogOptions);
    addHooks(): void;
    _displayDialog(): void;
    _setup(): Promise<void>;
    _getAgentMenu(current: any): Promise<HTMLDivElement>;
    _getPortalId(): string;
    _sendTarget(): void;
}
export default SendTargetDialog;
