import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "../views/ Referee/LoginView.vue";
import LiveMatchView from "../views/Spectator/LiveMatchView.vue";
import DashboardView from "../views/ Referee/DashboardView.vue";
import ManageMatchView from "../views/ Referee/ManageMatchView.vue";
import {useAuthStore} from "../stores/auth.store.ts";
import NotFoundView from "../views/NotFoundView.vue";
import EnterCodeView from "../views/Spectator/EnterCodeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/spectator',
            name: 'spectator',
            component: EnterCodeView
        },
        {
            path: '/spectator/:code',
            name: 'live-match',
            component: LiveMatchView,
            props: true
        },
        {
            path: '/referee/login',
            name: 'referee-login',
            component: LoginView
        },
        {
            path: '/referee/dashboard',
            name: 'referee-dashboard',
            component: DashboardView,
            meta: { requiresAuth: true }
        },
        {
            path: '/referee/match/:id',
            name: 'manage-match',
            component: ManageMatchView,
            meta: { requiresAuth: true },
            props: true
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: NotFoundView,
            meta: {
                title: 'Page non trouvée'
            }
        }
    ]
})

router.beforeEach((to, _, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ name: 'referee-login' })
    } else {
        next()
    }
})


export default router