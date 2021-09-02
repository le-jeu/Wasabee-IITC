import { WButton } from "../leafletClasses";
declare class WasabeeButton extends WButton {
    static TYPE: string;
    _lastLoginState: boolean;
    _loginAction: any;
    _logoutAction: any;
    _teamAction: any;
    _alwaysActions: any;
    _Dactions: any;
    _SettingsActions: any;
    constructor(container: any);
    _getActions(): HTMLUListElement;
    _buildActions(): void;
    update(): void;
}
export default WasabeeButton;
