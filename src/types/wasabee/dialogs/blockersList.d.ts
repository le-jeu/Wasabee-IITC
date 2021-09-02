import { WDialog } from "../leafletClasses";
import Sortable from "../sortable";
import WasabeeLink from "../model/link";
declare class BlockerList extends WDialog {
    usePane: true;
    sortable: Sortable<WasabeeLink>;
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): void;
    update(): void;
    _getListDialogContent(sortBy: number, sortAsc: boolean): Sortable<WasabeeLink>;
}
export default BlockerList;
