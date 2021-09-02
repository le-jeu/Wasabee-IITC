import OperationChecklistDialog from "./checklist";
declare class MarkerList extends OperationChecklistDialog {
    _displayDialog(): Promise<void>;
    update(): Promise<void>;
}
export default MarkerList;
