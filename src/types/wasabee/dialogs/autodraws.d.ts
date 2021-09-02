import { WDialog, WDialogOptions } from "../leafletClasses";
declare class AutodrawsDialog extends WDialog {
    needWritePermission: true;
    menuItems: {
        text: string;
        callback: () => void;
    }[];
    constructor(options?: WDialogOptions);
    addHooks(): void;
    _displayDialog(): void;
    _displaySmallDialog(): void;
}
export default AutodrawsDialog;
