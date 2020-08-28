"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

require("./plugins/element.js");

require("./assets/fonts/iconfont.css");

require("./assets/css/global.css");

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 引入图标库
// 引入全局样式
// 引入axios
_axios["default"].defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

_axios["default"].interceptors.request.use(function (config) {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});

_vue["default"].prototype.$http = _axios["default"];
_vue["default"].config.productionTip = false;
new _vue["default"]({
  router: _router["default"],
  render: function render(h) {
    return h(_App["default"]);
  }
}).$mount('#app');