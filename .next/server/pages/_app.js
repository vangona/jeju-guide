/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "(pages-dir-node)/./src/fBase.ts":
/*!**********************!*\
  !*** ./src/fBase.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authService: () => (/* binding */ authService),\n/* harmony export */   dbService: () => (/* binding */ dbService),\n/* harmony export */   firebaseInstance: () => (/* binding */ firebaseInstance),\n/* harmony export */   storageService: () => (/* binding */ storageService)\n/* harmony export */ });\n/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase/app */ \"firebase/app\");\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\n/* harmony import */ var firebase_firestore__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/firestore */ \"firebase/firestore\");\n/* harmony import */ var firebase_storage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! firebase/storage */ \"firebase/storage\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__, firebase_firestore__WEBPACK_IMPORTED_MODULE_2__, firebase_storage__WEBPACK_IMPORTED_MODULE_3__]);\n([firebase_app__WEBPACK_IMPORTED_MODULE_0__, firebase_auth__WEBPACK_IMPORTED_MODULE_1__, firebase_firestore__WEBPACK_IMPORTED_MODULE_2__, firebase_storage__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\nconst firebaseConfig = {\n    apiKey: \"AIzaSyDbt76_Zwf7Pnx-cBDVxe6oDWnv32v9xqo\" || 0,\n    authDomain: \"jeju-guide.firebaseapp.com\" || 0,\n    projectId: \"jeju-guide\" || 0,\n    storageBucket: \"jeju-guide.appspot.com\" || 0,\n    messagingSenderId: \"350907878366\" || 0,\n    appId: \"1:350907878366:web:2f3fcda2d82f9ab4602b4f\" || 0,\n    measurementId: \"G-2F62EPJ668\" || 0\n};\nconst app = (0,firebase_app__WEBPACK_IMPORTED_MODULE_0__.initializeApp)(firebaseConfig);\nconst authService = (0,firebase_auth__WEBPACK_IMPORTED_MODULE_1__.getAuth)(app);\nconst dbService = (0,firebase_firestore__WEBPACK_IMPORTED_MODULE_2__.getFirestore)(app);\nconst storageService = (0,firebase_storage__WEBPACK_IMPORTED_MODULE_3__.getStorage)(app);\n// For backward compatibility\nconst firebaseInstance = {\n    auth: authService\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9mQmFzZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUE2QztBQUNMO0FBQ1U7QUFDSjtBQUU5QyxNQUFNSSxpQkFBaUI7SUFDckJDLFFBQVFDLHlDQUF3QyxJQUFJQSxDQUFzQztJQUMxRkksWUFBWUosNEJBQTRDLElBQUlBLENBQTBDO0lBQ3RHTyxXQUFXUCxZQUEyQyxJQUFJQSxDQUF5QztJQUNuR1UsZUFBZVYsd0JBQStDLElBQUlBLENBQTZDO0lBQy9HYSxtQkFBbUJiLGNBQW9ELElBQUlBLENBQWtEO0lBQzdIZ0IsT0FBT2hCLDJDQUF1QyxJQUFJQSxDQUFxQztJQUN2Rm1CLGVBQWVuQixjQUErQyxJQUFJQSxDQUE2QztBQUNqSDtBQUVBLE1BQU1zQixNQUFNNUIsMkRBQWFBLENBQUNJO0FBRW5CLE1BQU15QixjQUFjNUIsc0RBQU9BLENBQUMyQixLQUFLO0FBQ2pDLE1BQU1FLFlBQVk1QixnRUFBWUEsQ0FBQzBCLEtBQUs7QUFDcEMsTUFBTUcsaUJBQWlCNUIsNERBQVVBLENBQUN5QixLQUFLO0FBRTlDLDZCQUE2QjtBQUN0QixNQUFNSSxtQkFBbUI7SUFBRUMsTUFBTUo7QUFBWSxFQUFFIiwic291cmNlcyI6WyIvVXNlcnMvdmluY2VudC1raW0vRGVza3RvcC9zb2Z0d2FyZS93ZWItcHJvamVjdHMvamVqdS1ndWlkZS9zcmMvZkJhc2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaW5pdGlhbGl6ZUFwcCB9IGZyb20gJ2ZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBnZXRBdXRoIH0gZnJvbSAnZmlyZWJhc2UvYXV0aCc7XG5pbXBvcnQgeyBnZXRGaXJlc3RvcmUgfSBmcm9tICdmaXJlYmFzZS9maXJlc3RvcmUnO1xuaW1wb3J0IHsgZ2V0U3RvcmFnZSB9IGZyb20gJ2ZpcmViYXNlL3N0b3JhZ2UnO1xuXG5jb25zdCBmaXJlYmFzZUNvbmZpZyA9IHtcbiAgYXBpS2V5OiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9BUElfS0VZIHx8IHByb2Nlc3MuZW52LlJFQUNUX0FQUF9GSVJFQkFTRV9BUElfS0VZLFxuICBhdXRoRG9tYWluOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9BVVRIX0RPTUFJTiB8fCBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRklSRUJBU0VfQVVUSF9ET01BSU4sXG4gIHByb2plY3RJZDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfRklSRUJBU0VfUFJPSkVDVF9JRCB8fCBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRklSRUJBU0VfUFJPSkVDVF9JRCxcbiAgc3RvcmFnZUJ1Y2tldDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfRklSRUJBU0VfU1RPUkFHRV9CVUNLRVQgfHwgcHJvY2Vzcy5lbnYuUkVBQ1RfQVBQX0ZJUkVCQVNFX1NUT1JBR0VfQlVDS0VULFxuICBtZXNzYWdpbmdTZW5kZXJJZDogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfRklSRUJBU0VfTUVTU0FHSU5HX1NFTkRFUl9JRCB8fCBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRklSRUJBU0VfTUVTU0FHSU5HX1NFTkRFUl9JRCxcbiAgYXBwSWQ6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX0ZJUkVCQVNFX0FQUF9JRCB8fCBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRklSRUJBU0VfQVBQX0lELFxuICBtZWFzdXJlbWVudElkOiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19GSVJFQkFTRV9NRUFTVVJFTUVOVF9JRCB8fCBwcm9jZXNzLmVudi5SRUFDVF9BUFBfRklSRUJBU0VfTUVBU1VSRU1FTlRfSUQsXG59O1xuXG5jb25zdCBhcHAgPSBpbml0aWFsaXplQXBwKGZpcmViYXNlQ29uZmlnKTtcblxuZXhwb3J0IGNvbnN0IGF1dGhTZXJ2aWNlID0gZ2V0QXV0aChhcHApO1xuZXhwb3J0IGNvbnN0IGRiU2VydmljZSA9IGdldEZpcmVzdG9yZShhcHApO1xuZXhwb3J0IGNvbnN0IHN0b3JhZ2VTZXJ2aWNlID0gZ2V0U3RvcmFnZShhcHApO1xuXG4vLyBGb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eVxuZXhwb3J0IGNvbnN0IGZpcmViYXNlSW5zdGFuY2UgPSB7IGF1dGg6IGF1dGhTZXJ2aWNlIH07XG4iXSwibmFtZXMiOlsiaW5pdGlhbGl6ZUFwcCIsImdldEF1dGgiLCJnZXRGaXJlc3RvcmUiLCJnZXRTdG9yYWdlIiwiZmlyZWJhc2VDb25maWciLCJhcGlLZXkiLCJwcm9jZXNzIiwiZW52IiwiTkVYVF9QVUJMSUNfRklSRUJBU0VfQVBJX0tFWSIsIlJFQUNUX0FQUF9GSVJFQkFTRV9BUElfS0VZIiwiYXV0aERvbWFpbiIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX0FVVEhfRE9NQUlOIiwiUkVBQ1RfQVBQX0ZJUkVCQVNFX0FVVEhfRE9NQUlOIiwicHJvamVjdElkIiwiTkVYVF9QVUJMSUNfRklSRUJBU0VfUFJPSkVDVF9JRCIsIlJFQUNUX0FQUF9GSVJFQkFTRV9QUk9KRUNUX0lEIiwic3RvcmFnZUJ1Y2tldCIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX1NUT1JBR0VfQlVDS0VUIiwiUkVBQ1RfQVBQX0ZJUkVCQVNFX1NUT1JBR0VfQlVDS0VUIiwibWVzc2FnaW5nU2VuZGVySWQiLCJORVhUX1BVQkxJQ19GSVJFQkFTRV9NRVNTQUdJTkdfU0VOREVSX0lEIiwiUkVBQ1RfQVBQX0ZJUkVCQVNFX01FU1NBR0lOR19TRU5ERVJfSUQiLCJhcHBJZCIsIk5FWFRfUFVCTElDX0ZJUkVCQVNFX0FQUF9JRCIsIlJFQUNUX0FQUF9GSVJFQkFTRV9BUFBfSUQiLCJtZWFzdXJlbWVudElkIiwiTkVYVF9QVUJMSUNfRklSRUJBU0VfTUVBU1VSRU1FTlRfSUQiLCJSRUFDVF9BUFBfRklSRUJBU0VfTUVBU1VSRU1FTlRfSUQiLCJhcHAiLCJhdXRoU2VydmljZSIsImRiU2VydmljZSIsInN0b3JhZ2VTZXJ2aWNlIiwiZmlyZWJhc2VJbnN0YW5jZSIsImF1dGgiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/fBase.ts\n");

/***/ }),

/***/ "(pages-dir-node)/./src/pages/_app.tsx":
/*!****************************!*\
  !*** ./src/pages/_app.tsx ***!
  \****************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var firebase_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! firebase/auth */ \"firebase/auth\");\n/* harmony import */ var _fBase__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../fBase */ \"(pages-dir-node)/./src/fBase.ts\");\n/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles.css */ \"(pages-dir-node)/./src/styles.css\");\n/* harmony import */ var _styles_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _styles_components_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../styles/components.css */ \"(pages-dir-node)/./src/styles/components.css\");\n/* harmony import */ var _styles_components_css__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_styles_components_css__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _styles_responsive_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../styles/responsive.css */ \"(pages-dir-node)/./src/styles/responsive.css\");\n/* harmony import */ var _styles_responsive_css__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_styles_responsive_css__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _styles_touch_optimization_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../styles/touch-optimization.css */ \"(pages-dir-node)/./src/styles/touch-optimization.css\");\n/* harmony import */ var _styles_touch_optimization_css__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_styles_touch_optimization_css__WEBPACK_IMPORTED_MODULE_7__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([firebase_auth__WEBPACK_IMPORTED_MODULE_2__, _fBase__WEBPACK_IMPORTED_MODULE_3__]);\n([firebase_auth__WEBPACK_IMPORTED_MODULE_2__, _fBase__WEBPACK_IMPORTED_MODULE_3__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    const [init, setInit] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isLoggedIn, setIsLoggedIn] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [userObj, setUserObj] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [isMobile, setIsMobile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)({\n        \"MyApp.useEffect\": ()=>{\n            (0,firebase_auth__WEBPACK_IMPORTED_MODULE_2__.onAuthStateChanged)(_fBase__WEBPACK_IMPORTED_MODULE_3__.authService, {\n                \"MyApp.useEffect\": (user)=>{\n                    if (user) {\n                        setIsLoggedIn(true);\n                        setUserObj({\n                            uid: user.uid,\n                            displayName: user.displayName || '',\n                            photoURL: user.photoURL || ''\n                        });\n                    } else {\n                        setIsLoggedIn(false);\n                        setUserObj(null);\n                    }\n                    setInit(true);\n                }\n            }[\"MyApp.useEffect\"]);\n            // 모바일 기기 감지\n            const checkMobile = {\n                \"MyApp.useEffect.checkMobile\": ()=>{\n                    const userAgent = window.navigator.userAgent;\n                    const mobile = /iPhone|iPad|iPod|Android/i.test(userAgent);\n                    setIsMobile(mobile || window.innerWidth <= 768);\n                }\n            }[\"MyApp.useEffect.checkMobile\"];\n            checkMobile();\n            window.addEventListener('resize', checkMobile);\n            return ({\n                \"MyApp.useEffect\": ()=>{\n                    window.removeEventListener('resize', checkMobile);\n                }\n            })[\"MyApp.useEffect\"];\n        }\n    }[\"MyApp.useEffect\"], []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: init ? /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps,\n            isLoggedIn: isLoggedIn,\n            userObj: userObj,\n            isMobile: isMobile\n        }, void 0, false, {\n            fileName: \"/Users/vincent-kim/Desktop/software/web-projects/jeju-guide/src/pages/_app.tsx\",\n            lineNumber: 51,\n            columnNumber: 9\n        }, this) : /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            children: \"Loading...\"\n        }, void 0, false, {\n            fileName: \"/Users/vincent-kim/Desktop/software/web-projects/jeju-guide/src/pages/_app.tsx\",\n            lineNumber: 58,\n            columnNumber: 9\n        }, this)\n    }, void 0, false);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHBhZ2VzLWRpci1ub2RlKS8uL3NyYy9wYWdlcy9fYXBwLnRzeCIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQzRDO0FBQ087QUFDWjtBQUVoQjtBQUNXO0FBQ0E7QUFDUTtBQUUxQyxTQUFTSSxNQUFNLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFZO0lBQy9DLE1BQU0sQ0FBQ0MsTUFBTUMsUUFBUSxHQUFHUCwrQ0FBUUEsQ0FBQztJQUNqQyxNQUFNLENBQUNRLFlBQVlDLGNBQWMsR0FBR1QsK0NBQVFBLENBQUM7SUFDN0MsTUFBTSxDQUFDVSxTQUFTQyxXQUFXLEdBQUdYLCtDQUFRQSxDQUFpQjtJQUN2RCxNQUFNLENBQUNZLFVBQVVDLFlBQVksR0FBR2IsK0NBQVFBLENBQUM7SUFFekNELGdEQUFTQTsyQkFBQztZQUNSRSxpRUFBa0JBLENBQUNDLCtDQUFXQTttQ0FBRSxDQUFDWTtvQkFDL0IsSUFBSUEsTUFBTTt3QkFDUkwsY0FBYzt3QkFDZEUsV0FBVzs0QkFDVEksS0FBS0QsS0FBS0MsR0FBRzs0QkFDYkMsYUFBYUYsS0FBS0UsV0FBVyxJQUFJOzRCQUNqQ0MsVUFBVUgsS0FBS0csUUFBUSxJQUFJO3dCQUM3QjtvQkFDRixPQUFPO3dCQUNMUixjQUFjO3dCQUNkRSxXQUFXO29CQUNiO29CQUNBSixRQUFRO2dCQUNWOztZQUVBLFlBQVk7WUFDWixNQUFNVzsrQ0FBYztvQkFDbEIsTUFBTUMsWUFBWUMsT0FBT0MsU0FBUyxDQUFDRixTQUFTO29CQUM1QyxNQUFNRyxTQUFTLDRCQUE0QkMsSUFBSSxDQUFDSjtvQkFDaEROLFlBQVlTLFVBQVVGLE9BQU9JLFVBQVUsSUFBSTtnQkFDN0M7O1lBRUFOO1lBQ0FFLE9BQU9LLGdCQUFnQixDQUFDLFVBQVVQO1lBRWxDO21DQUFPO29CQUNMRSxPQUFPTSxtQkFBbUIsQ0FBQyxVQUFVUjtnQkFDdkM7O1FBQ0Y7MEJBQUcsRUFBRTtJQUVMLHFCQUNFO2tCQUNHWixxQkFDQyw4REFBQ0Y7WUFDRSxHQUFHQyxTQUFTO1lBQ2JHLFlBQVlBO1lBQ1pFLFNBQVNBO1lBQ1RFLFVBQVVBOzs7OztpQ0FHWiw4REFBQ2U7c0JBQUk7Ozs7Ozs7QUFJYjtBQUVBLGlFQUFleEIsS0FBS0EsRUFBQyIsInNvdXJjZXMiOlsiL1VzZXJzL3ZpbmNlbnQta2ltL0Rlc2t0b3Avc29mdHdhcmUvd2ViLXByb2plY3RzL2planUtZ3VpZGUvc3JjL3BhZ2VzL19hcHAudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFByb3BzIH0gZnJvbSAnbmV4dC9hcHAnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IG9uQXV0aFN0YXRlQ2hhbmdlZCB9IGZyb20gJ2ZpcmViYXNlL2F1dGgnO1xuaW1wb3J0IHsgYXV0aFNlcnZpY2UgfSBmcm9tICcuLi9mQmFzZSc7XG5pbXBvcnQgdHlwZSB7IFVzZXJPYmogfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgJy4uL3N0eWxlcy5jc3MnO1xuaW1wb3J0ICcuLi9zdHlsZXMvY29tcG9uZW50cy5jc3MnO1xuaW1wb3J0ICcuLi9zdHlsZXMvcmVzcG9uc2l2ZS5jc3MnO1xuaW1wb3J0ICcuLi9zdHlsZXMvdG91Y2gtb3B0aW1pemF0aW9uLmNzcyc7XG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpIHtcbiAgY29uc3QgW2luaXQsIHNldEluaXRdID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbaXNMb2dnZWRJbiwgc2V0SXNMb2dnZWRJbl0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFt1c2VyT2JqLCBzZXRVc2VyT2JqXSA9IHVzZVN0YXRlPFVzZXJPYmogfCBudWxsPihudWxsKTtcbiAgY29uc3QgW2lzTW9iaWxlLCBzZXRJc01vYmlsZV0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBvbkF1dGhTdGF0ZUNoYW5nZWQoYXV0aFNlcnZpY2UsICh1c2VyKSA9PiB7XG4gICAgICBpZiAodXNlcikge1xuICAgICAgICBzZXRJc0xvZ2dlZEluKHRydWUpO1xuICAgICAgICBzZXRVc2VyT2JqKHtcbiAgICAgICAgICB1aWQ6IHVzZXIudWlkLFxuICAgICAgICAgIGRpc3BsYXlOYW1lOiB1c2VyLmRpc3BsYXlOYW1lIHx8ICcnLFxuICAgICAgICAgIHBob3RvVVJMOiB1c2VyLnBob3RvVVJMIHx8ICcnLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldElzTG9nZ2VkSW4oZmFsc2UpO1xuICAgICAgICBzZXRVc2VyT2JqKG51bGwpO1xuICAgICAgfVxuICAgICAgc2V0SW5pdCh0cnVlKTtcbiAgICB9KTtcblxuICAgIC8vIOuqqOuwlOydvCDquLDquLAg6rCQ7KeAXG4gICAgY29uc3QgY2hlY2tNb2JpbGUgPSAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyQWdlbnQgPSB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudDtcbiAgICAgIGNvbnN0IG1vYmlsZSA9IC9pUGhvbmV8aVBhZHxpUG9kfEFuZHJvaWQvaS50ZXN0KHVzZXJBZ2VudCk7XG4gICAgICBzZXRJc01vYmlsZShtb2JpbGUgfHwgd2luZG93LmlubmVyV2lkdGggPD0gNzY4KTtcbiAgICB9O1xuXG4gICAgY2hlY2tNb2JpbGUoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgY2hlY2tNb2JpbGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCBjaGVja01vYmlsZSk7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtpbml0ID8gKFxuICAgICAgICA8Q29tcG9uZW50IFxuICAgICAgICAgIHsuLi5wYWdlUHJvcHN9IFxuICAgICAgICAgIGlzTG9nZ2VkSW49e2lzTG9nZ2VkSW59XG4gICAgICAgICAgdXNlck9iaj17dXNlck9ian1cbiAgICAgICAgICBpc01vYmlsZT17aXNNb2JpbGV9XG4gICAgICAgIC8+XG4gICAgICApIDogKFxuICAgICAgICA8ZGl2PkxvYWRpbmcuLi48L2Rpdj5cbiAgICAgICl9XG4gICAgPC8+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwOyJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIm9uQXV0aFN0YXRlQ2hhbmdlZCIsImF1dGhTZXJ2aWNlIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJpbml0Iiwic2V0SW5pdCIsImlzTG9nZ2VkSW4iLCJzZXRJc0xvZ2dlZEluIiwidXNlck9iaiIsInNldFVzZXJPYmoiLCJpc01vYmlsZSIsInNldElzTW9iaWxlIiwidXNlciIsInVpZCIsImRpc3BsYXlOYW1lIiwicGhvdG9VUkwiLCJjaGVja01vYmlsZSIsInVzZXJBZ2VudCIsIndpbmRvdyIsIm5hdmlnYXRvciIsIm1vYmlsZSIsInRlc3QiLCJpbm5lcldpZHRoIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkaXYiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(pages-dir-node)/./src/pages/_app.tsx\n");

/***/ }),

/***/ "(pages-dir-node)/./src/styles.css":
/*!************************!*\
  !*** ./src/styles.css ***!
  \************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./src/styles/components.css":
/*!***********************************!*\
  !*** ./src/styles/components.css ***!
  \***********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./src/styles/responsive.css":
/*!***********************************!*\
  !*** ./src/styles/responsive.css ***!
  \***********************************/
/***/ (() => {



/***/ }),

/***/ "(pages-dir-node)/./src/styles/touch-optimization.css":
/*!*******************************************!*\
  !*** ./src/styles/touch-optimization.css ***!
  \*******************************************/
/***/ (() => {



/***/ }),

/***/ "firebase/app":
/*!*******************************!*\
  !*** external "firebase/app" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/app");;

/***/ }),

/***/ "firebase/auth":
/*!********************************!*\
  !*** external "firebase/auth" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/auth");;

/***/ }),

/***/ "firebase/firestore":
/*!*************************************!*\
  !*** external "firebase/firestore" ***!
  \*************************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/firestore");;

/***/ }),

/***/ "firebase/storage":
/*!***********************************!*\
  !*** external "firebase/storage" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = import("firebase/storage");;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("(pages-dir-node)/./src/pages/_app.tsx"));
module.exports = __webpack_exports__;

})();