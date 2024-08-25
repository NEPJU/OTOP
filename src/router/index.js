import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to, from, next) => {
    const isAuthenticated = sessionStorage.getItem("username");
    const userRole = sessionStorage.getItem("role");

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        if (to.path.startsWith("/admin")) {
          next({ path: "/admin" }); // Redirect to admin login if trying to access an admin route
        } else {
          next({ path: "/login" }); // Redirect to user login if trying to access a user route
        }
      } else {
        if (to.matched.some((record) => record.meta.requiresAdmin)) {
          if (userRole === "admin") {
            next(); // Allow access to admin pages
          } else {
            next("/"); // Redirect to home if not admin
          }
        } else if (to.matched.some((record) => record.meta.requiresUser)) {
          if (userRole === "user") {
            next(); // Allow access to user pages
          } else {
            next("/"); // Redirect to home if not a regular user
          }
        } else {
          next(); // Proceed normally for routes that do not require specific roles
        }
      }
    } else {
      next(); // Proceed for routes that do not require authentication
    }
  });

  return Router;
});
