import { WDialog } from "../leafletClasses";
declare class ZoneDialog extends WDialog {
    ZonedrawHandler: any;
    addHooks(): void;
    removeHooks(): void;
    update(): void;
    _displayDialog(): void;
    _displaySmallDialog(): void;
    buildList(): HTMLDivElement;
}
export default ZoneDialog;
