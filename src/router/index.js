import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";

import Register from "@/views/Register.vue";

import ErrorPage from "@/views/ErrorPage.vue";

import store from "../store";

import axios from "axios";

const routeAccessMethod = (to, from, next) => {
    const user = store.getters.GET_USER;

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (user.username === undefined) {
            if (to.path === "/error-notfound") {
                sessionStorage.setItem("redirectPath", "/");
                next("/");
            } else {
                sessionStorage.setItem("redirectPath", to.path);
                next("/login");
            }
        } else {
            // if (to.matched.some(record => record.meta.adminRoute)) {
            //     if (user.role === "admin") {
            //         next();
            //     } else {
            //         console.log("4");
            //         next("/error-notfound");
            //     }
            // } else if (user.isVerified) {
            //     next();
            // } else {
            //     next();
            // }
            next();
        }
    } else {
        if (to.matched.some(record => record.meta.hideForAuth) && user.username) {
            next("/");
        } else {
            next();
        }
    }
};

async function AuthenticationHandler (to, from, next) {
    await store.dispatch("GETUSER")
        .then((user) => {
            store.watch(() => user, () => {
            });
            routeAccessMethod(to, from, next);
        });
};

const changeTitle = (to, from, next) => {
    const { title } = to.meta;
    document.title = typeof title === "function" ? title(to.params.id) : title;
    next();
};

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
            title: `Home | ${process.env.VUE_APP_TITLE}`,
            hideForAuth: false,
            requiresAuth: true
        }
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
        meta: {
            title: `Login | ${process.env.VUE_APP_TITLE}`,
            hideForAuth: true,
            requiresAuth: false
        }
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
        meta: {
            title: `Register | ${process.env.VUE_APP_TITLE}`,
            hideForAuth: true,
            requiresAuth: false
        }
    },
    {
        path: "/error-notfound",
        name: "ErrorPage",
        component: ErrorPage,
        meta: {
            title: `Pagină inexistentă | ${process.env.VUE_APP_TITLE}`,
            requiresAuth: false,
            hideForAuth: false
        }
    },
    {
        path: "/*",
        redirect: {
            name: "ErrorPage"
        }
    }
];


axios.interceptors.response.use(function (response) {
    console.log(response);
    return response;
}, function (error) {
    console.log(error);
    console.log(error.response.data);
    if (error.response.status === 401) {
        store.dispatch("LOGOUT_USER");
        router.push("/login");
    }
    return Promise.reject(error);
});

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

router.beforeResolve(AuthenticationHandler);
// router.beforeEach(AuthenticationHandler);
router.beforeEach(changeTitle);

export default router;
