import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '../components/Login.vue'
const Login = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "Login_Home_Welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    return next()
  }

  const token = window.sessionStorage.getItem('token')

  if (!token) {
    return next('/login')
  }

  next()
})

export default router
