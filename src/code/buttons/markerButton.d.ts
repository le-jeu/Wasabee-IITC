import { WButton } from "../leafletClasses";
declare class MarkerButton extends WButton {
    static TYPE: string;
    constructor(container: any);
    update(): void;
    getSubActions(): any[];
}
export default MarkerButton;
