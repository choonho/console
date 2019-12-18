import Vue from 'vue';
import VueRouter from 'vue-router';

// Routes
import dashboardRoute from '@/routes/dashboard/dashboard-route';
import identityRoute from '@/routes/identity/identity-route';
import inventoryRoute from '@/routes/inventory/inventory-route';
import DefaultContainer from '@/views/containers/DefaultContainer';

// Views
import SignIn from '@/views/sign-in/local/Local';
import GoolgeSignIn from '@/views/sign-in/oauth/GoogleOAuth';
import Admin from '@/views/sign-in/admin/Admin';
import Redirect404 from '@/views/common/404/Redirect404';
import api from '@/lib/api';
import store from '@/store';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    hash: false,
    linkActiveClass: 'open active',
    routes: [
        {
            path: '/error-page',
            name: 'error',
            meta: { label: '', excludeAuth: true },
            component: Redirect404,
        },
        {
            path: '/sign-in',
            name: 'SignIn',
            meta: { label: 'Sign In', excludeAuth: true, isSignInPage: true },
            component: SignIn,
        },
        {
            path: '/google-sign-in',
            name: 'GoogleOauthSignIn',
            meta: { label: 'google_oauth2', excludeAuth: true, isSignInPage: true },
            component: GoolgeSignIn,
        },
        {
            path: '/admin-sign-in',
            name: 'Admin-SignIn',
            meta: { label: 'admin_sign', excludeAuth: true, isSignInPage: true },
            component: Admin,
        },
        {
            path: '/',
            name: 'root',
            meta: { label: 'root' },
            redirect: '/dashboard',
            component: DefaultContainer,
            children: [
                dashboardRoute,
                identityRoute,
                inventoryRoute,
            ],
        },
        { path: '*', component: Redirect404 },
    ],
});


router.beforeEach(async (to, from, next) => {
    if (store.getters['domain/id']) {
        if (to.meta && !to.meta.excludeAuth && !api.checkAccessToken()) {
            await store.dispatch('auth/signOut');
            const nextPath = store.getters['domain/authType'] === 'local' ? { path: '/sign-in' } : { path: '/google-sign-in' };
            next(nextPath);
        } else next();
    } else {
        localStorage.setItem('common.toMeta', JSON.stringify(to.meta));
        localStorage.setItem('common.toNextPath', to.path);
        next();
    }
});

export default router;
