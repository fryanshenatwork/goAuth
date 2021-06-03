declare global {
    interface Window {
        gapi: any;
    }
}
interface FryanGoAuthInterface {
}
interface configOauthI {
    apiKey: String;
    clientID: String;
    discoveryDocs: Array<String>;
    scopes: Array<String>;
}
interface configI {
    gapiPath: String;
    oAuthConfig: configOauthI;
    lifeCycle: {};
}
declare class FryanGoauth implements FryanGoAuthInterface {
    #private;
    static '#GAPI': string;
    static '#AUTH_OPTIONS': configOauthI;
    static '#LIFECYCLE': {
        afterGapiMounted: (gapi?: object) => void;
        afterGapiClientMounted: (gapiClient?: object) => void;
        oAuthSignedIn: (opt: {
            guid: string;
            gmail: string;
        }) => void;
        oAuthSignedOut: () => void;
        afterOAuthSigned: (signedIn: boolean) => void;
        success: () => void;
        error: (err: string) => void;
    };
    static '#GOAUTH_CONFIG': configOauthI;
    gapi: any;
    constructor(config: configI);
    then: (fn: () => {}) => this;
    catch: (fn: () => {}) => this;
    afterGapiMounted: (fn: () => {}) => this;
    afterGapiClientMounted: (fn: () => {}) => this;
    oAuthSignedIn: (fn: () => {}) => this;
    oAuthSignedOut: (fn: () => {}) => this;
    afterOAuthSigned: (fn: () => {}) => this;
    auth: any;
}
export default FryanGoauth;
//# sourceMappingURL=index.d.ts.map