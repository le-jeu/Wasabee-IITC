import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeePortal from "../model/portal";
import WasabeeLink from "../model/link";
import WasabeeMarker from "../model/marker";
import WasabeeOp from "../model/operation";
interface SetCommentDialogOptions extends WDialogOptions {
    target: WasabeeMarker | WasabeeLink | WasabeePortal;
    operation: WasabeeOp;
}
export declare class SetCommentDialog extends WDialog {
    needWritePermission: true;
    options: SetCommentDialogOptions;
    commentType: "link" | "marker" | "portal";
    dialogTitle: string;
    portal?: WasabeePortal;
    constructor(options: SetCommentDialogOptions);
    addHooks(): void;
    _displayDialog(): void;
    _buildHtml(): HTMLDivElement;
}
export default SetCommentDialog;
