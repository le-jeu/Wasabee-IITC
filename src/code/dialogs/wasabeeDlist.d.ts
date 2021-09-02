import { WDialog } from "../leafletClasses";
import Sortable from "../sortable";
import WasabeeMe from "../model/me";
import { WDKey } from "../wd";
declare class WasabeeDList extends WDialog {
    _UIUpdateHook: () => void;
    _me: WasabeeMe;
    addHooks(): Promise<void>;
    removeHooks(): void;
    update(): Promise<void>;
    _displayDialog(): Promise<void>;
    getListDialogContent(): Promise<Sortable<WDKey>>;
}
export default WasabeeDList;
