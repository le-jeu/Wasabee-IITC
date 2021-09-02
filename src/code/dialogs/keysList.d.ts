import { WDialog } from "../leafletClasses";
import Sortable from "../sortable";
import WasabeeMe from "../model/me";
import WasabeeOp from "../model/operation";
declare type Key = {
    id: string;
    Required: number;
    onHand: number;
    iHave: number;
    capsule: string;
};
declare class KeysList extends WDialog {
    usePane: boolean;
    _opID: string;
    _me: WasabeeMe;
    sortable: Sortable<Key>;
    addHooks(): Promise<void>;
    removeHooks(): void;
    _displayDialog(): void;
    update(): Promise<void>;
    getListDialogContent(operation: WasabeeOp, sortBy: any, sortAsc: any): Sortable<Key>;
}
export default KeysList;
