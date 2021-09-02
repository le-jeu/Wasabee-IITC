import { WDialog, WDialogOptions } from "../leafletClasses";
import Sortable from "../sortable";
import { KeyOnHand } from "../model/operation";
interface KeyListPortalOptions extends WDialogOptions {
    portalID: string;
}
declare class KeyListPortal extends WDialog {
    options: KeyListPortalOptions;
    _sortable: Sortable<unknown>;
    constructor(options: KeyListPortalOptions);
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): void;
    update(): void;
    getSortable(): Sortable<KeyOnHand>;
    getListDialogContent(portalID: any): HTMLTableElement;
}
export default KeyListPortal;
