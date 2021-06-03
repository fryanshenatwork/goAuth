/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

// UNUSED EXPORTS: default

;// CONCATENATED MODULE: ./src/lib/index.ts
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FryanGoauth_init;
class lib_FryanGoauth {
    constructor(config) {
        this.gapi = undefined;
        // HOOKS
        this.then = (fn) => {
            lib_FryanGoauth['#LIFECYCLE'].success = fn;
            return this;
        };
        this.catch = (fn) => {
            lib_FryanGoauth['#LIFECYCLE'].error = fn;
            return this;
        };
        this.afterGapiMounted = (fn) => {
            lib_FryanGoauth['#LIFECYCLE'].afterGapiMounted = fn;
            return this;
        };
        this.afterGapiClientMounted = (fn) => {
            lib_FryanGoauth['#LIFECYCLE'].afterGapiClientMounted = fn;
            return this;
        };
        this.oAuthSignedIn = (fn) => {
            lib_FryanGoauth['#LIFECYCLE'].oAuthSignedIn = fn;
            return this;
        };
        this.oAuthSignedOut = (fn) => {
            lib_FryanGoauth['#LIFECYCLE'].oAuthSignedOut = fn;
            return this;
        };
        this.afterOAuthSigned = (fn) => {
            lib_FryanGoauth['#LIFECYCLE'].afterOAuthSigned = fn;
            return this;
        };
        // methods
        this.auth = (function () {
            const _this = this;
            return {
                get isSignedIn() {
                    const { gapi } = _this;
                    let signed = false;
                    try {
                        signed = gapi.auth2.getAuthInstance().isSignedIn.get();
                    }
                    catch (ers) {
                        console.log('[isSignedIn] - Unready init'); // eslint-disable-line
                    }
                    return signed;
                },
                signin() {
                    const { gapi } = _this;
                    if (this.isSignedIn) {
                        return Promise.reject('Already signed in');
                    }
                    try {
                        const r = gapi.auth2.getAuthInstance().signIn();
                        return Promise.resolve(r);
                    }
                    catch (ers) {
                        // console.log('[signin] - Unready init', ers)
                        return Promise.reject(ers);
                    }
                },
                signout() {
                    const { gapi } = _this;
                    if (!this.isSignedIn) {
                        return Promise.reject('Already signed out');
                    }
                    try {
                        const r = gapi.auth2.getAuthInstance().signOut();
                        return Promise.resolve(r);
                    }
                    catch (ers) {
                        // console.log('[signOut] - Unready init', ers)
                        return Promise.reject(ers);
                    }
                },
                get getUserProfile() {
                    const { gapi } = _this;
                    if (!this.isSignedIn) {
                        return Promise.reject(false);
                    }
                    try {
                        const profile = gapi.auth2.getAuthInstance()
                            .currentUser.get().getBasicProfile();
                        return Promise.resolve({
                            id: profile.getId(),
                            name: profile.getName(),
                            giveName: profile.getGivenName(),
                            familyName: profile.getFamilyName(),
                            image: profile.getImageUrl(),
                            email: profile.getEmail()
                        });
                    }
                    catch (ers) {
                        return Promise.reject('[getUserProfile] - Error when get user profile');
                    }
                }
            };
        }).bind(this)();
        // init
        _FryanGoauth_init.set(this, function () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const _this = this;
                const isHttps = yield (function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (window.location.protocol !== 'https:') {
                            window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`;
                            return false;
                        }
                        return true;
                    });
                }());
                if (!isHttps) {
                    reject('Not https');
                }
                const loadGapi = yield ((url) => new Promise((loadGapiResolve, loadGapiReject) => {
                    const script = document.createElement('script');
                    script.type = 'text/javascript';
                    try {
                        script.onload = function (e) {
                            if (window.gapi !== undefined) {
                                loadGapiResolve(true);
                            }
                            else {
                                loadGapiReject(false);
                            }
                        };
                        script.onerror = () => { loadGapiReject(false); };
                        script.src = url;
                        document.getElementsByTagName('head')[0].appendChild(script);
                    }
                    catch (ers) {
                        loadGapiReject(false);
                    }
                }))(lib_FryanGoauth['#GAPI'])
                    .then(() => {
                    lib_FryanGoauth['#LIFECYCLE'].afterGapiMounted(window.gapi);
                    this.gapi = window.gapi;
                    return true;
                })
                    .catch(() => false);
                if (!loadGapi) {
                    reject('Gapi is not loaded');
                }
                const loadGapiClient = yield (function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { gapi } = _this;
                        const task = yield new Promise((sResolve, sReject) => {
                            gapi.load('client', () => {
                                if (gapi
                                    && gapi.client) {
                                    sResolve(true);
                                }
                                else {
                                    sReject(false);
                                }
                            });
                        })
                            .then(() => {
                            lib_FryanGoauth['#LIFECYCLE'].afterGapiClientMounted(_this.gapi.client);
                            return true;
                        })
                            .catch(() => false);
                        return task;
                    });
                }());
                if (!loadGapiClient) {
                    reject('Error when loading client from gapi ');
                }
                const loadGoAuth = yield (() => __awaiter(this, void 0, void 0, function* () {
                    const task = yield new Promise((goAuthResolve, goAuthReject) => {
                        const gClient = this.gapi.client;
                        const GOAUTH_CONFIG = lib_FryanGoauth['#GOAUTH_CONFIG'];
                        gClient.init({
                            apiKey: GOAUTH_CONFIG.apiKey,
                            clientId: GOAUTH_CONFIG.clientID,
                            scope: GOAUTH_CONFIG.scopes.join(' '),
                            discoveryDocs: GOAUTH_CONFIG.discoveryDocs
                        })
                            .then(() => {
                            const { auth2 } = _this.gapi;
                            const checkSignInOut = function (isSignedIn) {
                                if (isSignedIn) {
                                    // signin
                                    const profile = auth2.getAuthInstance().currentUser.get();
                                    const getProfile = profile.getBasicProfile();
                                    const gmail = getProfile.getEmail();
                                    const guid = getProfile.getId();
                                    lib_FryanGoauth['#LIFECYCLE'].oAuthSignedIn({
                                        guid, gmail
                                    });
                                }
                                else {
                                    // signout
                                    lib_FryanGoauth['#LIFECYCLE'].oAuthSignedOut();
                                }
                                lib_FryanGoauth['#LIFECYCLE'].afterOAuthSigned(isSignedIn);
                            };
                            // listen Signin
                            auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
                                checkSignInOut(isSignedIn);
                            });
                            Promise.resolve(auth2.getAuthInstance()).then(() => {
                                const signInStatus = auth2.getAuthInstance().isSignedIn.get();
                                checkSignInOut(signInStatus);
                                if (!signInStatus) {
                                    auth2.getAuthInstance().signIn();
                                }
                                goAuthResolve(true);
                            });
                        })
                            .catch((ers) => {
                            goAuthReject(`An error occurred when loading gapi.client.oAuth`);
                        });
                    });
                    return task;
                }))();
                if (!loadGoAuth) {
                    reject('Error when loading gapi.client.auth');
                }
                resolve(true);
            }));
        });
        lib_FryanGoauth['#GAPI'] = `${config.gapiPath}`;
        lib_FryanGoauth['#GOAUTH_CONFIG'].apiKey = config.oAuthConfig.apiKey;
        lib_FryanGoauth['#GOAUTH_CONFIG'].clientID = config.oAuthConfig.clientID;
        lib_FryanGoauth['#GOAUTH_CONFIG'].discoveryDocs = config.oAuthConfig.discoveryDocs;
        lib_FryanGoauth['#GOAUTH_CONFIG'].scopes = config.oAuthConfig.scopes;
        __classPrivateFieldGet(this, _FryanGoauth_init, "f").call(this)
            .then(() => {
            lib_FryanGoauth['#LIFECYCLE'].success();
        })
            .catch((err) => {
            lib_FryanGoauth['#LIFECYCLE'].error(err);
        });
    }
}
_FryanGoauth_init = new WeakMap();
lib_FryanGoauth['#LIFECYCLE'] = {
    afterGapiMounted: (gapi) => { },
    afterGapiClientMounted: (gapiClient) => { },
    oAuthSignedIn: (opt) => { },
    oAuthSignedOut: () => { },
    afterOAuthSigned: (signedIn) => { },
    success: () => { },
    error: (err) => { }
};
lib_FryanGoauth['#GOAUTH_CONFIG'] = {
    apiKey: ``,
    clientID: ``,
    discoveryDocs: [],
    scopes: []
};
// window.FryanGoauth = FryanGoauth
/* harmony default export */ const lib = (lib_FryanGoauth);

;// CONCATENATED MODULE: ./src/main.js

window.FryanGoauth = lib;
/* harmony default export */ const main = ((/* unused pure expression or super */ null && (FryanGoauth)));
/******/ })()
;
//# sourceMappingURL=fryan.goauth.js.map