import { WDialog } from "../leafletClasses";
import WasabeeOp from "../model/operation";
declare class ExportDialog extends WDialog {
    addHooks(): void;
    _displayDialog(): void;
    _buildContent(operation: WasabeeOp): HTMLDivElement;
    _drawToolsFormat(operation: WasabeeOp): void;
    _bookmarkFormat(operation: any): void;
}
export default ExportDialog;
