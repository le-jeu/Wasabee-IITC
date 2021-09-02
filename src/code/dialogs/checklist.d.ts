import { WDialog } from "../leafletClasses";
import WasabeeLink from "../model/link";
import WasabeeMarker from "../model/marker";
import Sortable, { SortableField } from "../sortable";
import WasabeeOp from "../model/operation";
declare class OperationChecklistDialog extends WDialog {
    usePane: boolean;
    sortable: Sortable<WasabeeMarker | WasabeeLink>;
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): Promise<void>;
    update(): Promise<void>;
    getFields(operation: WasabeeOp): SortableField<WasabeeLink | WasabeeMarker>[];
    getListDialogContent(operation: WasabeeOp, items: Array<WasabeeLink | WasabeeMarker>, sortBy: number, sortAsc: boolean): Sortable<WasabeeLink | WasabeeMarker>;
    countFields(operation: WasabeeOp, doAlert: any): {
        field: number;
        empty: number;
    };
}
export default OperationChecklistDialog;
