import { WDialog, WDialogOptions } from "../leafletClasses";
import WasabeeZone from "../model/zone";
interface ZoneSetColorDialogOptions extends WDialogOptions {
    zone: WasabeeZone;
}
declare class ZoneSetColorDialog extends WDialog {
    needWritePermission: boolean;
    options: ZoneSetColorDialogOptions;
    constructor(options: ZoneSetColorDialogOptions);
    addHooks(): void;
    _displayDialog(): void;
    _buildContent(): HTMLDivElement;
}
export default ZoneSetColorDialog;
