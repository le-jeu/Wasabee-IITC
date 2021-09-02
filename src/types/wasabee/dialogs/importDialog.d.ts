import WasabeeOp from "../model/operation";
import WasabeePortal from "../model/portal";
import { WDialog } from "../leafletClasses";
declare class ImportDialog extends WDialog {
    _autoload: boolean;
    _namefield: HTMLInputElement;
    _textarea: HTMLTextAreaElement;
    addHooks(): void;
    removeHooks(): void;
    _displayDialog(): void;
    drawToolsFormat(): void;
    fillFromURL(): void;
    importTextareaAsOp(): Promise<void>;
    parseDrawTools(string: any): WasabeeOp;
    buildWindowPortalMap(): Map<any, any>;
    searchWindowPortals(latLng: {
        lat: string;
        lng: string;
    }, pmap: Map<string, string>): false | WasabeePortal;
}
export default ImportDialog;
