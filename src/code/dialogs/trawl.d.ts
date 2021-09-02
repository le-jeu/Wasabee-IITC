/// <reference types="jquery" />
/// <reference types="jqueryui" />

import { WDialog } from "../leafletClasses";
declare class TrawlDialog extends WDialog {
    automark: HTMLInputElement;
    _mapRefreshHook: any;
    oldDebugTiles: RenderDebugTiles;
    bulkAlert: JQuery<HTMLElement>;
    addHooks(): void;
    _displayDialog(): void;
    _getTrawlPoints(): any[];
    _clearMarkers(): void;
    _bulkLoad(latlngs: L.LatLng[], mapZoom: number): void;
    bulkLoadDone(): void;
}
export default TrawlDialog;
