import OperationChecklistDialog from "./checklist";
import { WDialogOptions } from "../leafletClasses";
import WasabeePortal from "../model/portal";
import WasabeeOp from "../model/operation";
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
