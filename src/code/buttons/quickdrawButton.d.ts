import { WTooltip, WButton } from "../leafletClasses";
import WasabeeOp from "../model/operation";
import WasabeePortal from "../model/portal";
declare class QuickdrawButton extends WButton {
    static TYPE: string;
    needWritePermission: boolean;
    handler: QuickDrawControl;
    picker: HTMLInputElement;
    _changeColorSubAction: {
        title: any;
        text: any;
        html: any;
        callback: () => void;
        context: any;
    };
    _toggleModeSubAction: {
        title: any;
        text: any;
        callback: () => void;
        context: any;
    };
    _endSubAction: {
        title: any;
        text: any;
        callback: () => QuickDrawControl;
        context: QuickDrawControl;
    };
    constructor(container: any);
    getSubActions(): {
        title: any;
        text: any;
        callback: () => void;
        context: any;
    }[];
    enable(): void;
    disable(): void;
}
declare class QuickDrawControl extends L.Handler {
    _nextDrawnLinksColor: string;
    _tooltip: WTooltip;
    _container: HTMLElement;
    options: {
        button: QuickdrawButton;
    };
    type: string;
    _drawMode: string;
    _operation: WasabeeOp;
    _opID: string;
    _anchor: WasabeePortal;
    _anchor1: WasabeePortal;
    _anchor2: WasabeePortal;
    _previous: WasabeePortal;
    _throwOrder: number;
    _guideLayerGroup: L.LayerGroup;
    _guideA: any;
    _guideB: any;
    constructor(options: {
        button: QuickdrawButton;
    });
    enable(): this;
    disable(): this;
    addHooks(): void;
    removeHooks(): void;
    _opchange(): void;
    _keyUpListener(e: any): void;
    _onMouseMove(e: any): void;
    _guideUpdate(e: any): void;
    _guideLayerToggle(): void;
    _getTooltipText(): {
        text: any;
    };
    _portalClicked(portal: any): void;
    _portalClickedQD(selectedPortal: any): void;
    _toggleMode(): void;
    _portalClickedSingle(selectedPortal: any): void;
    _portalClickedStar(selectedPortal: any): void;
}
export default QuickdrawButton;
