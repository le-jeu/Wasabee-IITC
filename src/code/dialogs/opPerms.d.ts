import { WDialog } from "../leafletClasses";
import WasabeeMe from "../model/me";
declare class OpPermList extends WDialog {
    _me: WasabeeMe;
    addHooks(): Promise<void>;
    removeHooks(): void;
    update(): Promise<void>;
    _displayDialog(): void;
    buildHTML(operation: any): HTMLDivElement;
    buildTable(operation: any): HTMLTableElement;
    addPerm(teamID: string, role: "read" | "write" | "assignonly", zone: number): Promise<void>;
    delPerm(obj: any): Promise<void>;
}
export default OpPermList;
