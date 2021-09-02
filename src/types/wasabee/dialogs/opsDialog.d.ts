import { WDialog } from "../leafletClasses";
import Sortable from "../sortable";
declare type Op = {
    id: string;
    name: string;
    localchanged: boolean;
    remotechanged: boolean;
    fetched: string;
    local: boolean;
    perm: "read" | "write" | "assignonly";
    hidden: boolean;
    currentserver: boolean;
    server: string;
    background: boolean;
    owner?: string;
    ownerDisplay?: HTMLElement;
};
declare class OpsDialog extends WDialog {
    usePane: boolean;
    sortable: Sortable<Op>;
    _enabled: any;
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): Promise<void>;
    update(): Promise<void>;
    initSortable(): void;
    updateSortable(sortBy: any, sortAsc: any): Promise<void>;
}
export default OpsDialog;
