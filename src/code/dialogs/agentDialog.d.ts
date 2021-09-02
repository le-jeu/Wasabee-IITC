import { WDialog, WDialogOptions } from "../leafletClasses";
interface AgentDialogOptions extends WDialogOptions {
    gid: string;
}
declare class AgentDialog extends WDialog {
    options: AgentDialogOptions;
    constructor(options: AgentDialogOptions);
    addHooks(): void;
    _displayDialog(): Promise<void>;
    _displaySmallDialog(): void;
}
export default AgentDialog;
