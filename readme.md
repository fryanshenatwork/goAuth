# goAuth
Make connect Google api and Google Auth easier plugin.


---


## Contents
- [Prep work](#prep-work)
- [Installation](#installation)
- [Usage](#usage)
 - [Instance](#instance)
 - [Methods](#methods)
- [Developer Documentation](#developer-documentation)


---


## Prep work
Visit [Google Cloud Platform](https://console.cloud.google.com/) create a `project`, `apikey` and also `clientID`.


---


## Installation
1. npm
    ```node
    npm i https://github.com/fryanshenatwork/goAuth
    ```
2. Just download dist folder


---


## Usage
### Instance
Use `new` to instance goauth

- `gapiPath` (required) [String] - Google api path
- `oAuthConfig` (required) [Object] - oAuth configuration
    -  apiKey (require) [String] - [Prep work](#prep-work)
    -  clientID (required) [String] - [Prep work](#prep-work)
    -  discoverDocs (required) [Array] - Here's the sample using [Google Sheet API](https://developers.google.com/sheets/api/reference/rest#discovery-document)
    -  scopes (required) [Array] - [Google developer scopes](https://developers.google.com/identity/protocols/oauth2/scopes)
    ```javascript
    const instance = new FryanGoauth({
        gapiPath: 'https://apis.google.com/js/api.js',
        oAuthConfig: {
          apiKey: '<!-- apiKey -->',
          clientID: '<!-- clicentID -->',
          discoveryDocs: [ 'https://sheets.googleapis.com/$discovery/rest?version=v4' ],
          scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/spreadsheets.readonly',
            'https://www.googleapis.com/auth/plus.login',
            'profile',
            'email'
          ]
        }
    })
    ```
	

---


### Methods
| Name | Lifecycle | Param |
|---|---|---|
| afterGapiMounted       | After Google API mounted                               | gapi [Object]       |
| afterGapiClientMounted | After Gapi client mounted                              | gapiClient [Object] |
| oAuthSignedIn          | oAuth signed in                                        | -                   |
| oAuthSignedOut         | oAuth signed out                                       | -                   |
| afterOAuthSigned       | Any change when Signed state different (sign in / out) | signedIn [Boolean]  |
| then                   | All task done | success [Boolean]                      | -                   |
| catch                  | When error occurred | ers [Object]                     | -                   |

**Sample**
```javascript
instance
    .afterGapiMounted((gapi) => {
      console.log('[] gapi loaded');
    })
    .afterGapiClientMounted((gapiClient) => {
      console.log('[] gapiclient loaded')
    })
    .oAuthSignedIn(() => {
      console.log('[] goauth signedin');
      document.getElementById('signin-button').hidden = true
      document.getElementById('signout-button').hidden = false
      sample.auth.getUserProfile.then((profile) => {
        document.getElementById('greeting').innerText = 'Hello, ' + profile.name
        document.getElementById('greeting').hidden = false
      })
    })
    .oAuthSignedOut(() => {
      console.log('[] goauth signedout');
      document.getElementById('signin-button').hidden = false
      document.getElementById('signout-button').hidden = true
      document.getElementById('greeting').hidden = true
    })
    .afterOAuthSigned((signedIn) => {
      console.log('[] goauth signed in/out', signedIn);
      document.getElementById('sign-status').innerHTML = signedIn ? 'Already log in' : 'Please log in'
    })
    .then((success) => {
      console.log('success ' + success);
      document.getElementById('loading').hidden = true
    })
    .catch((ers) => {
      console.log('WHY? ' + ers);
    })
```


---


## Developer Documentation
### Development
To start dev-server, default port is `8080` you can modify the port in `package.json`
```node
    npm run dev
```
### Production
1. To compile, and it will build files in `dist/`
    ```node
        npm run build
    ``` 
2. `index.html` will contain js and css script all you need, copy and replace development path.