import { WDialog } from "../leafletClasses";
declare class AuthDialog extends WDialog {
    static TYPE: string;
    _server: HTMLDivElement;
    _android: boolean;
    _ios: boolean;
    addHooks(): void;
    removeHooks(): void;
    _successLogin(me?: string): Promise<void>;
    _displayDialog(): void;
    gapiAuth(): void;
    gsapiAuthChoose(): void;
}
export default AuthDialog;
