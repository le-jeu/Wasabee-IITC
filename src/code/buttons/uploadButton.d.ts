import { WButton } from "../leafletClasses";
declare class UploadButton extends WButton {
    static TYPE: string;
    needWritePermission: boolean;
    constructor(container: any);
    update(): void;
    _visible(): void;
    _invisible(): void;
    doUpdate(operation: any, force?: boolean): Promise<void>;
}
export default UploadButton;
