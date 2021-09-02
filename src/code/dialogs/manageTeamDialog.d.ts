import { WDialog } from "../leafletClasses";
import { MeTeam } from "../model/me";
import Sortable from "../sortable";
import WasabeeAgent from "../model/agent";
interface ManageTeamDialogOptions {
    team: MeTeam;
}
declare class ManageTeamDialog extends WDialog {
    options: ManageTeamDialogOptions;
    constructor(options: ManageTeamDialogOptions);
    addHooks(): void;
    removeHooks(): void;
    _setupTable(): Promise<Sortable<WasabeeAgent>>;
    _refreshTeam(table: any): Promise<void>;
    update(): Promise<void>;
    _dialogContent(): Promise<HTMLDivElement>;
    _displayDialog(): Promise<void>;
}
export default ManageTeamDialog;
