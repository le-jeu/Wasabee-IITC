import { WDialog } from "../leafletClasses";
import Sortable from "../sortable";
import WasabeeAgent from "../model/agent";
declare class OnlineAgentList extends WDialog {
    _table: Sortable<WasabeeAgent>;
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): void;
    update(): Promise<void>;
    _last_hour(): string;
}
export default OnlineAgentList;
