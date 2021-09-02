import WasabeeAgent from "../model/agent";
declare function formatDisplay(agent: any, teamID?: number | string): Promise<HTMLAnchorElement>;
declare function timeSinceformat(agent: any): any;
interface WLAgentOptions extends L.MarkerOptions {
    agent: WasabeeAgent;
    id: string;
    zoom: number;
}
declare class WLAgent extends L.Marker {
    options: WLAgentOptions;
    constructor(agent: WasabeeAgent);
    update(): this;
    _getPopup(): HTMLDivElement;
}
declare const _default: {
    formatDisplay: typeof formatDisplay;
    timeSinceformat: typeof timeSinceformat;
    WLAgent: typeof WLAgent;
};
export default _default;
