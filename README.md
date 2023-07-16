<div align="center">
<img src="public/icon-128.png" alt="logo"/>
<h1>2FA Authenticator</h1>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)
![GitHub action badge](https://github.com/hemancini/2fa-authenticator/actions/workflows/build-zip.yml/badge.svg)

> This project was generated from [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

### 2FA Authenticator is a Chrome extension that provides 2FA authentication codes in the browser.

</div>

## Features <a name="features"></a>

- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vite](https://vitejs.dev/)
- [SASS](https://sass-lang.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- HRR(Hot Rebuild & Refresh/Reload)

## Installation <a name="installation"></a>

### Procedures <a name="procedures"></a>

1. Clone this repository.
2. Change `name` and `description` in package.json => **Auto synchronize with manifest**
3. Run `pnpm i` (check your node version >= 16.6, recommended >= 18)
4. Run `pnpm start`
5. Load Extension on Chrome
   1. Open - Chrome browser
   2. Access - chrome://extensions
   3. Check - Developer mode
   4. Find - Load unpacked extension
   5. Select - `dist` folder in this project (after dev or build)
6. If you want to build in production, Just run `pnpm run build`.

## Documents <a name="documents"></a>

- [Vite Plugin](https://vitejs.dev/guide/api-plugin.html)
- [ChromeExtension](https://developer.chrome.com/docs/extensions/mv3/)
- [Rollup](https://rollupjs.org/guide/en/)
- [Rollup-plugin-chrome-extension](https://www.extend-chrome.dev/rollup-plugin)

## TODO

- [x] **popup**
  - [x] get entries
  - [x] edit entries
  - [x] auto refresh
  - [x] pin entry
- [x] **edit entries**
  - [x] drag and drop
  - [x] delete entry
  - [x] edit entry
  - [x] add entry
- [ ] **add entry**
  - [x] scan QR code
  - [ ] manual input
  - [x] otp uri
  - [ ] image file
  - [x] show success message
- [ ] **control errors**
  - [x] scan QR code
- [x] i18n
  - [x] spanish
  - [x] english
- [ ] options
  - [x] themes
    - [x] dark mode
  - [x] tooltip
  - [ ] autofill
  - [x] entrust bypass

## Thanks To

- [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
- [Authenticator extension](https://github.com/Authenticator-Extension/Authenticator)
