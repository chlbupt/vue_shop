"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Login = _interopRequireDefault(require("../components/Login.vue"));

var _Home = _interopRequireDefault(require("../components/Home.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: _Login["default"]
}, {
  path: '/home',
  component: _Home["default"]
}];
var router = new _vueRouter["default"]({
  routes: routes
});
router.beforeEach(function (to, from, next) {
  if (to.path == '/login') {
    return next();
  }

  var token = window.sessionStorage.getItem('token');

  if (!token) {
    return next('/login');
  }

  next();
});
var _default = router;
exports["default"] = _default;