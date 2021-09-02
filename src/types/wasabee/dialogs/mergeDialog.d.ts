import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeeOp from "../model/operation";
interface MergeDialogOptions extends WDialogOptions {
    title: string;
    opOwn: WasabeeOp;
    opRemove: WasabeeOp;
    updateCallback?: (op: WasabeeOp) => any;
}
declare class MergeDialog extends WDialog {
    options: MergeDialogOptions;
    _opRebase: WasabeeOp;
    _layer: L.LayerGroup;
    addHooks(): void;
    removeHooks(): void;
    rebase(): Promise<void>;
    useServer(): Promise<void>;
    useLocal(): void;
    _displayDialog(): void;
    formatSummary(summary: any): HTMLDivElement;
    formatChanges(changes: any, origin: WasabeeOp, operation: WasabeeOp): HTMLTableElement;
}
export default MergeDialog;
