import OperationChecklistDialog from "./checklist.js";
import { WDialogOptions } from "../leafletClasses.js";
import WasabeePortal from "../model/portal.js";
import WasabeeOp from "../model/operation.js";
interface LinkListDialogOptions extends WDialogOptions {
    portal: WasabeePortal;
}
declare class LinkListDialog extends OperationChecklistDialog {
    usePane: boolean;
    options: LinkListDialogOptions;
    constructor(options: LinkListDialogOptions);
    getFields(operation: WasabeeOp): any;
    _displayDialog(): Promise<void>;
    update(): Promise<void>;
}
export default LinkListDialog;
