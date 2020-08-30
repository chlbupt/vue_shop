"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// import Login from '../components/Login.vue'
var Login = function Login() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../components/Login.vue'));
  });
}; // import Home from '../components/Home.vue'


var Home = function Home() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../components/Home.vue'));
  });
}; // import Welcome from '../components/Welcome.vue'


var Welcome = function Welcome() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../components/Welcome.vue'));
  });
}; // import Users from '../components/user/Users.vue'


var Users = function Users() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../components/user/Users.vue'));
  });
}; // import Rights from '../components/power/Rights.vue'


var Rights = function Rights() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../components/power/Rights.vue'));
  });
}; // import Roles from '../components/power/Roles.vue'


var Roles = function Roles() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require('../components/power/Roles.vue'));
  });
};

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [{
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: Users
  }, {
    path: '/rights',
    component: Rights
  }, {
    path: '/roles',
    component: Roles
  }]
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