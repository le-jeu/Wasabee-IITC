import { WButton } from "../leafletClasses";
declare class LinkButton extends WButton {
    static TYPE: string;
    needWritePermission: boolean;
    constructor(container: any);
    getSubActions(): any[];
}
export default LinkButton;
