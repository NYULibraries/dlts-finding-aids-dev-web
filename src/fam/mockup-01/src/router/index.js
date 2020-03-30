import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/HomeView.vue';
import Login from '../views/LoginView.vue';

Vue.use( VueRouter );

const routes = [
    {
        path      : '/login',
        name      : 'Login',
        component : Login,
    },
    {
        path      : '/',
        name      : 'Home',
        component : Home,
    },
];

const router = new VueRouter( {
    routes,
} );

export default router;
