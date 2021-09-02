import { WDialog } from "../leafletClasses";
import WasabeeMarker from "../model/marker";
import WasabeePortal from "../model/portal";
declare class MarkerAddDialog extends WDialog {
    needWritePermission: boolean;
    _pch: () => void;
    _type: HTMLSelectElement;
    _zones: HTMLSelectElement;
    _assign: HTMLSelectElement;
    _selectedPortal: WasabeePortal;
    _portal: HTMLSpanElement;
    _marker: WasabeeMarker;
    _comment: HTMLInputElement;
    addHooks(): void;
    removeHooks(): void;
    update(): Promise<void>;
    _displayDialog(): Promise<void>;
    _addMarker(selectedType: any, comment: any, zone: any, assign: any): Promise<void>;
    _getAgentMenu(menu: any): Promise<void>;
}
export default MarkerAddDialog;
