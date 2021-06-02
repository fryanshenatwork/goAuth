/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 362:
/***/ (function() {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FryanGoauth_init;
class FryanGoauth {
    constructor(config) {
        this.gapi = undefined;
        // HOOKS
        this.then = (fn) => {
            FryanGoauth['#LIFECYCLE'].success = fn;
            return this;
        };
        this.catch = (fn) => {
            FryanGoauth['#LIFECYCLE'].error = fn;
            return this;
        };
        this.afterGapiMounted = (fn) => {
            FryanGoauth['#LIFECYCLE'].afterGapiMounted = fn;
            return this;
        };
        this.afterGapiClientMounted = (fn) => {
            FryanGoauth['#LIFECYCLE'].afterGapiClientMounted = fn;
            return this;
        };
        this.oAuthSignedIn = (fn) => {
            FryanGoauth['#LIFECYCLE'].oAuthSignedIn = fn;
            return this;
        };
        this.oAuthSignedOut = (fn) => {
            FryanGoauth['#LIFECYCLE'].oAuthSignedOut = fn;
            return this;
        };
        this.afterOAuthSigned = (fn) => {
            FryanGoauth['#LIFECYCLE'].afterOAuthSigned = fn;
            return this;
        };
        // methods
        this.auth = (function () {
            const _this = this;
            return {
                get isSignedIn() {
                    const gapi = _this.gapi;
                    let signed = false;
                    try {
                        signed = gapi.auth2.getAuthInstance().isSignedIn.get();
                    }
                    catch (ers) {
                        console.log('[isSignedIn] - Unready init');
                    }
                    return signed;
                },
                signin: function () {
                    const gapi = _this.gapi;
                    if (this.isSignedIn) {
                        return Promise.reject('Already signed in');
                    }
                    else {
                        try {
                            let r = gapi.auth2.getAuthInstance().signIn();
                            return Promise.resolve(r);
                        }
                        catch (ers) {
                            console.log('[signin] - Unready init', ers);
                            return Promise.reject();
                        }
                    }
                },
                signout: function () {
                    const gapi = _this.gapi;
                    if (!this.isSignedIn) {
                        return Promise.reject('Already signed out');
                    }
                    else {
                        try {
                            let r = gapi.auth2.getAuthInstance().signOut();
                            return Promise.resolve(r);
                        }
                        catch (ers) {
                            console.log('[signOut] - Unready init', ers);
                            return Promise.reject();
                        }
                    }
                },
                get getUserProfile() {
                    const gapi = _this.gapi;
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
                            email: profile.getEmail(),
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
                        if (location.protocol !== 'https:') {
                            location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
                            return false;
                        }
                        return true;
                    });
                })();
                if (!isHttps) {
                    reject('Not https');
                }
                const loadGapi = yield ((url) => {
                    return new Promise((resolve, reject) => {
                        var script = document.createElement('script');
                        script.type = 'text/javascript';
                        try {
                            script.onload = function (e) {
                                if (window.gapi !== undefined) {
                                    resolve(true);
                                }
                                else {
                                    reject(false);
                                }
                            };
                            script.onerror = () => { reject(false); };
                            script.src = url;
                            document.getElementsByTagName("head")[0].appendChild(script);
                        }
                        catch (ers) {
                            reject(false);
                        }
                    });
                })(FryanGoauth['#GAPI'])
                    .then(() => {
                    FryanGoauth['#LIFECYCLE'].afterGapiMounted(window.gapi);
                    this.gapi = window.gapi;
                    return true;
                })
                    .catch(() => { return false; });
                if (!loadGapi) {
                    reject('Gapi is not loaded');
                }
                const loadGapiClient = yield (function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        const gapi = _this.gapi;
                        return yield new Promise((sResolve, sReject) => {
                            gapi.load('client', function () {
                                if (gapi &&
                                    gapi.client) {
                                    sResolve(true);
                                }
                                else {
                                    sReject(false);
                                }
                            });
                        })
                            .then(() => {
                            FryanGoauth['#LIFECYCLE'].afterGapiClientMounted(_this.gapi.client);
                            return true;
                        })
                            .catch(() => { return false; });
                    });
                })();
                if (!loadGapiClient) {
                    reject('Error when loading client from gapi ');
                }
                const loadGoAuth = yield (() => __awaiter(this, void 0, void 0, function* () {
                    return yield new Promise((goAuthResolve, goAuthReject) => {
                        const gClient = this.gapi.client;
                        const GOAUTH_CONFIG = FryanGoauth['#GOAUTH_CONFIG'];
                        gClient.init({
                            apiKey: GOAUTH_CONFIG.apiKey,
                            clientId: GOAUTH_CONFIG.clientID,
                            scope: GOAUTH_CONFIG.scopes.join(' '),
                            discoveryDocs: GOAUTH_CONFIG.discoveryDocs
                        })
                            .then(function () {
                            const auth2 = _this.gapi.auth2;
                            const checkSignInOut = function (isSignedIn) {
                                if (isSignedIn) {
                                    // signin
                                    const profile = auth2.getAuthInstance().currentUser.get();
                                    const getProfile = profile.getBasicProfile();
                                    const gmail = getProfile.getEmail();
                                    const guid = getProfile.getId();
                                    FryanGoauth['#LIFECYCLE'].oAuthSignedIn({
                                        guid, gmail
                                    });
                                }
                                else {
                                    // signout
                                    FryanGoauth['#LIFECYCLE'].oAuthSignedOut();
                                }
                                FryanGoauth['#LIFECYCLE'].afterOAuthSigned(isSignedIn);
                            };
                            // listen Signin
                            auth2.getAuthInstance().isSignedIn.listen(function (isSignedIn) {
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
                }))();
                if (!loadGoAuth) {
                    reject('Error when loading gapi.client.auth');
                }
                resolve(true);
            }));
        });
        FryanGoauth['#GAPI'] = `${config.gapiPath}`;
        FryanGoauth['#GOAUTH_CONFIG'].apiKey = config.oAuthConfig.apiKey;
        FryanGoauth['#GOAUTH_CONFIG'].clientID = config.oAuthConfig.clientID;
        FryanGoauth['#GOAUTH_CONFIG'].discoveryDocs = config.oAuthConfig.discoveryDocs;
        FryanGoauth['#GOAUTH_CONFIG'].scopes = config.oAuthConfig.scopes;
        __classPrivateFieldGet(this, _FryanGoauth_init, "f").call(this)
            .then(() => {
            FryanGoauth['#LIFECYCLE'].success();
        })
            .catch((err) => {
            FryanGoauth['#LIFECYCLE'].error(err);
        });
    }
}
_FryanGoauth_init = new WeakMap();
FryanGoauth['#LIFECYCLE'] = {
    afterGapiMounted: (gapi) => { },
    afterGapiClientMounted: (gapiClient) => { },
    oAuthSignedIn: (opt) => { },
    oAuthSignedOut: () => { },
    afterOAuthSigned: (signedIn) => { },
    success: () => { },
    error: (err) => { }
};
FryanGoauth['#GOAUTH_CONFIG'] = {
    apiKey: ``,
    clientID: ``,
    discoveryDocs: [],
    scopes: []
};
window.FryanGoauth = FryanGoauth;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__(362);
})();

/******/ })()
;
//# sourceMappingURL=fryan.goauth.js.map