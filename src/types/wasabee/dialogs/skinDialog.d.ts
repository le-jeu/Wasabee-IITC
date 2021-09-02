import { WDialog, WDialogOptions } from "../leafletClasses";
declare class SkinDialog extends WDialog {
    _skinSet: Set<string>;
    constructor(options?: WDialogOptions);
    addHooks(): void;
    _buildContent(): HTMLDivElement;
    _displayDialog(): void;
}
export default SkinDialog;
