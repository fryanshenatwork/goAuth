declare global {
  // eslint-disable-next-line
  interface Window {
    gapi: any
  }
}

interface FryanGoAuthInterface {

}

interface configOauthI {
  apiKey: String,
  clientID: String,
  discoveryDocs: Array<String>
  scopes: Array<String>
}

interface configI {
  gapiPath: String,
  oAuthConfig: configOauthI,
  lifeCycle: {
  }
}

class FryanGoauth implements FryanGoAuthInterface {
  static '#GAPI': string

  static '#AUTH_OPTIONS': configOauthI

  static '#LIFECYCLE' = {
    afterGapiMounted: (gapi?: object) => {},
    afterGapiClientMounted: (gapiClient?: object) => {},
    oAuthSignedIn: (opt: { guid: string, gmail: string }) => {},
    oAuthSignedOut: () => {},
    afterOAuthSigned: (signedIn: boolean) => {},
    success: () => {},
    error: (err: string) => {}
  }

  static '#GOAUTH_CONFIG' : configOauthI = {
    apiKey: ``,
    clientID: ``,
    discoveryDocs: [],
    scopes: []
  }

  gapi: any = undefined

  constructor (config: configI) {
    FryanGoauth['#GAPI'] = `${config.gapiPath}`
    FryanGoauth['#GOAUTH_CONFIG'].apiKey = config.oAuthConfig.apiKey
    FryanGoauth['#GOAUTH_CONFIG'].clientID = config.oAuthConfig.clientID
    FryanGoauth['#GOAUTH_CONFIG'].discoveryDocs = config.oAuthConfig.discoveryDocs
    FryanGoauth['#GOAUTH_CONFIG'].scopes = config.oAuthConfig.scopes
    this.#init()
      .then(() => {
        FryanGoauth['#LIFECYCLE'].success()
      })
      .catch((err) => {
        FryanGoauth['#LIFECYCLE'].error(err)
      })
  }

  // HOOKS
  then = (fn: () => {}) => {
    FryanGoauth['#LIFECYCLE'].success = fn
    return this
  }

  catch = (fn: () => {}) => {
    FryanGoauth['#LIFECYCLE'].error = fn
    return this
  }

  afterGapiMounted = (fn: () => {}) => {
    FryanGoauth['#LIFECYCLE'].afterGapiMounted = fn
    return this
  }

  afterGapiClientMounted = (fn: () => {}) => {
    FryanGoauth['#LIFECYCLE'].afterGapiClientMounted = fn
    return this
  }

  oAuthSignedIn = (fn: () => {}) => {
    FryanGoauth['#LIFECYCLE'].oAuthSignedIn = fn
    return this
  }

  oAuthSignedOut = (fn: () => {}) => {
    FryanGoauth['#LIFECYCLE'].oAuthSignedOut = fn
    return this
  }

  afterOAuthSigned = (fn: () => {}) => {
    FryanGoauth['#LIFECYCLE'].afterOAuthSigned = fn
    return this
  }

  // methods
  auth = (function () {
    const _this = this

    return {
      get isSignedIn () {
        const { gapi } = _this
        let signed = false
        try {
          signed = gapi.auth2.getAuthInstance().isSignedIn.get()
        } catch (ers) {
          console.log('[isSignedIn] - Unready init') // eslint-disable-line
        }
        return signed
      },
      signin () : Promise<any> {
        const { gapi } = _this

        if (this.isSignedIn) {
          return Promise.reject('Already signed in')
        }
        try {
          const r = gapi.auth2.getAuthInstance().signIn()
          return Promise.resolve(r)
        } catch (ers) {
          // console.log('[signin] - Unready init', ers)
          return Promise.reject(ers)
        }
      },
      signout () : Promise<any> {
        const { gapi } = _this

        if (!this.isSignedIn) {
          return Promise.reject('Already signed out')
        }
        try {
          const r = gapi.auth2.getAuthInstance().signOut()
          return Promise.resolve(r)
        } catch (ers) {
          // console.log('[signOut] - Unready init', ers)
          return Promise.reject(ers)
        }
      },
      get getUserProfile () : Promise<any> {
        const { gapi } = _this

        if (!this.isSignedIn) {
          return Promise.reject(false)
        }
        try {
          const profile = gapi.auth2.getAuthInstance()
            .currentUser.get().getBasicProfile()
          return Promise.resolve({
            id: profile.getId(),
            name: profile.getName(),
            giveName: profile.getGivenName(),
            familyName: profile.getFamilyName(),
            image: profile.getImageUrl(),
            email: profile.getEmail()
          })
        } catch (ers) {
          return Promise.reject('[getUserProfile] - Error when get user profile')
        }
      }
    }
  }).bind(this)()

  // init
  #init = function () {
    return new Promise(async (resolve, reject) => {
      const _this = this

      const isHttps: boolean = await (async function () {
        if (window.location.protocol !== 'https:') {
          window.location.href = `https:${window.location.href.substring(window.location.protocol.length)}`
          return false
        }
        return true
      }())
      if (!isHttps) { reject('Not https') }

      const loadGapi: boolean = await (
        (url: string) => new Promise((loadGapiResolve, loadGapiReject) => {
          const script = document.createElement('script')
          script.type = 'text/javascript'
          try {
            script.onload = function (e) {
              if (window.gapi !== undefined) {
                loadGapiResolve(true)
              } else {
                loadGapiReject(false)
              }
            }
            script.onerror = () => { loadGapiReject(false) }
            script.src = url
            document.getElementsByTagName('head')[0].appendChild(script)
          } catch (ers: any) {
            loadGapiReject(false)
          }
        }))(FryanGoauth['#GAPI'])
        .then(() => {
          FryanGoauth['#LIFECYCLE'].afterGapiMounted(window.gapi)
          this.gapi = window.gapi
          return true
        })
        .catch(() => false)
      if (!loadGapi) { reject('Gapi is not loaded') }

      const loadGapiClient: any = await (async function () {
        const { gapi } = _this
        const task = await new Promise((sResolve, sReject) => {
          gapi.load('client', () => {
            if (
              gapi
              && gapi.client
            ) {
              sResolve(true)
            } else {
              sReject(false)
            }
          })
        })
          .then(() => {
            FryanGoauth['#LIFECYCLE'].afterGapiClientMounted(_this.gapi.client)
            return true
          })
          .catch(() => false)
        return task
      }())
      if (!loadGapiClient) { reject('Error when loading client from gapi ') }

      const loadGoAuth: any = await (
        async () => {
          const task = await new Promise((goAuthResolve, goAuthReject) => {
            const gClient = this.gapi.client
            const GOAUTH_CONFIG = FryanGoauth['#GOAUTH_CONFIG']

            gClient.init({
              apiKey: GOAUTH_CONFIG.apiKey,
              clientId: GOAUTH_CONFIG.clientID,
              scope: GOAUTH_CONFIG.scopes.join(' '),
              discoveryDocs: GOAUTH_CONFIG.discoveryDocs
            })
              .then(() => {
                const { auth2 } = _this.gapi

                const checkSignInOut = function (isSignedIn: boolean) {
                  if (isSignedIn) {
                    // signin
                    const profile = auth2.getAuthInstance().currentUser.get()
                    const getProfile = profile.getBasicProfile()
                    const gmail = getProfile.getEmail()
                    const guid = getProfile.getId()
                    FryanGoauth['#LIFECYCLE'].oAuthSignedIn({
                      guid, gmail
                    })
                  } else {
                    // signout
                    FryanGoauth['#LIFECYCLE'].oAuthSignedOut()
                  }
                  FryanGoauth['#LIFECYCLE'].afterOAuthSigned(isSignedIn)
                }

                // listen Signin
                auth2.getAuthInstance().isSignedIn.listen(
                  (isSignedIn: boolean) => {
                    checkSignInOut(isSignedIn)
                  }
                )

                Promise.resolve(
                  auth2.getAuthInstance()
                ).then(() => {
                  const signInStatus = auth2.getAuthInstance().isSignedIn.get()
                  checkSignInOut(signInStatus)
                  if (!signInStatus) {
                    auth2.getAuthInstance().signIn()
                  }
                  goAuthResolve(true)
                })
              })
              .catch((ers : any) => {
                goAuthReject(`An error occurred when loading gapi.client.oAuth`)
              })
          })
          return task
        }
      )()
      if (!loadGoAuth) { reject('Error when loading gapi.client.auth') }
      resolve(true)
    })
  }
}

// window.FryanGoauth = FryanGoauth
export default FryanGoauth
