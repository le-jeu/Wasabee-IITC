import { WDialog } from "../leafletClasses";
declare class OpSettingDialog extends WDialog {
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): void;
    update(): void;
    makeContent(): HTMLDivElement;
}
export default OpSettingDialog;
