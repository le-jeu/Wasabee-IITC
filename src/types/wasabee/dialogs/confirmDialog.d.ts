import { WDialog, WDialogOptions } from "../leafletClasses";
interface ConfirmDialogOptions extends WDialogOptions {
    title: string;
    label: string | HTMLElement;
    type?: "agent" | "anchor" | "link" | "marker" | "zone" | "operation" | "team";
    callback?: () => any;
    cancelCallback?: () => any;
}
declare class ConfirmDialog extends WDialog {
    constructor(options: ConfirmDialogOptions);
    _skippable(): boolean;
    addHooks(): void;
    _displayDialog(): void;
    _buildContent(): HTMLDivElement;
}
export default ConfirmDialog;
