import { WDialog } from "../leafletClasses";
declare class SettingsDialog extends WDialog {
    addHooks(): void;
    update(): void;
    _addCheckBox(container: HTMLDivElement, label: string, id: string, storageKey: string, onChange?: (boolean: any) => void, defValue?: boolean): void;
    _addSelect(container: HTMLDivElement, label: string, storageKey: string, options: [any, any][], onChange?: (string: any) => void): void;
    _getContent(): HTMLDivElement;
    setServer(): void;
    _displayDialog(): void;
    _displaySmallDialog(): void;
}
export default SettingsDialog;
