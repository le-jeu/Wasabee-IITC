import { WDialog, WDialogOptions } from "../leafletClasses";
import Sortable from "../sortable";
import WasabeeAgent from "../model/agent";
interface TeamMembershipListOptions extends WDialogOptions {
    teamID: string;
}
declare class TeamMembershipList extends WDialog {
    options: TeamMembershipListOptions;
    constructor(options: TeamMembershipListOptions);
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): Promise<void>;
    _setupTable(): Sortable<WasabeeAgent>;
}
export default TeamMembershipList;
