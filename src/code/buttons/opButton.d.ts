import { WButton } from "../leafletClasses";
declare class OpButton extends WButton {
    static TYPE: string;
    constructor(container: any);
    getSubActions(): {
        title: any;
        text: any;
        callback: () => void;
        context: WButton;
    }[];
}
export default OpButton;
