<div align="center">
<img src="public/icon-128.png" alt="logo"/>
<h1>2FA Authenticator</h1>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![GitHub action badge](https://github.com/hemancini/2fa-authenticator/actions/workflows/build-zip.yml/badge.svg)
<a href="https://chrome.google.com/webstore/detail/2fa-authenticator/pnnmjhghimefjdmdilmlhnojccjgpgeh" target="_blank">
<img alt="Chrome Web Store" src="https://img.shields.io/chrome-web-store/v/pnnmjhghimefjdmdilmlhnojccjgpgeh?color=blue&label=Chrome&style=flat-square&logo=google-chrome&logoColor=white" />
</a>
<a href="https://microsoftedge.microsoft.com/addons/detail/hgnbjfcmpjakgfkjmmidclfkhedggmeo" target="_blank">
<img alt="Chrome" src="https://img.shields.io/badge/dynamic/json?label=Edge%20Add-on&prefix=v&query=%24.version&url=https%3A%2F%2Fmicrosoftedge.microsoft.com%2Faddons%2Fgetproductdetailsbycrxid%2Fhgnbjfcmpjakgfkjmmidclfkhedggmeo&style=flat-square&logo=microsoftedge&logoColor=fff" />
</a>

### 2FA-Authenticator is a extension that provides 2FA authentication codes in the browser.

</div>

> You no longer need to use your phone to authenticate. This extension gives you 2-step verification codes right in your browser.

## Available on Chrome Web Store and Microsoft Edge Add-ons <a name="available"></a>

[<img src="docs/img/chrome-store.svg" title="Chrome Web Store" alt="Chrome Web Store" width="200" />](https://chrome.google.com/webstore/detail/2fa-authenticator/pnnmjhghimefjdmdilmlhnojccjgpgeh)  [<img src="docs/img/edge-store.svg" title="Microsoft Edge Add-ons" alt="Microsoft Edge Add-ons" width="196" height="61" />](https://microsoftedge.microsoft.com/addons/detail/hgnbjfcmpjakgfkjmmidclfkhedggmeo)

## Features <a name="features"></a>

- Verification of OTP codes in your browser
- One click to autofill verification codes
- Scan QR codes from the page
- Show QR codes for quick scan
- Backup your accounts in Google Drive
- Open source

## Developer features <a name="developer-features"></a>

- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vite](https://vitejs.dev/)
- [SASS](https://sass-lang.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- HRR (Hot Rebuild & Refresh/Reload)
- [Material UI](https://mui.com/)
- [Zustand](https://github.com/pmndrs/zustand)

## Building <a name="building"></a>

### Procedures <a name="procedures"></a>

1. Clone this repository.
2. Run `pnpm i` (check your node version >= 16.6, recommended >= 18)
3. Run `pnpm start`
4. Load Extension on Chrome
   1. Open - Chrome browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpacked extension
   5. Select - `dist` folder in this project (after dev or build)
5. If you want to build in production, Just run `pnpm run build`.

## Documents <a name="documents"></a>

- [Vite Plugin](https://vitejs.dev/guide/api-plugin.html)
- [ChromeExtension](https://developer.chrome.com/docs/extensions/mv3/)
- [Rollup](https://rollupjs.org/guide/en/)
- [Rollup-plugin-chrome-extension](https://www.extend-chrome.dev/rollup-plugin)

## Credit <a name="credit"></a>

- Thanks to [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
