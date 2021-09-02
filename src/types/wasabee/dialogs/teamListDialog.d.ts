import { WDialog } from "../leafletClasses";
import WasabeeMe from "../model/me";
declare class TeamListDialog extends WDialog {
    _me: WasabeeMe;
    addHooks(): Promise<void>;
    removeHooks(): void;
    update(): Promise<void>;
    _buildContent(): HTMLDivElement;
    _displayDialog(): void;
    toggleTeam(teamID: any, currentState: any): Promise<string>;
    toggleShareWD(teamID: any, currentState: any): Promise<string>;
    toggleLoadWD(teamID: any, currentState: any): Promise<string>;
}
export default TeamListDialog;
