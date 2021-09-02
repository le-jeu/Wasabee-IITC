import { WButton } from "../leafletClasses";
declare class SyncButton extends WButton {
    static TYPE: string;
    update(): void;
    constructor(container: any);
}
export default SyncButton;
