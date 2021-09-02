import { WDialog } from "../leafletClasses";
import WasabeeMe from "../model/me";
import WasabeePortal from "../model/portal";
declare class DefensiveKeysDialog extends WDialog {
    _selectedPortal: WasabeePortal;
    _portal: HTMLElement;
    _me: WasabeeMe;
    _count: HTMLInputElement;
    _capID: HTMLInputElement;
    _pch: () => void;
    addHooks(): Promise<void>;
    removeHooks(): void;
    _portalClickedHook(): Promise<void>;
    _buildContent(): HTMLDivElement;
    _displayDialog(): void;
    _addDKey(): Promise<void>;
}
export default DefensiveKeysDialog;
