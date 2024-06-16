import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'layout',
            redirect: '/index',
            component: () => import('../views/Layout.vue'),
            children: [
                {
                    path: '/index',
                    name: 'index',
                    component: () => import('../views/Index.vue'),
                },
                {
                    path: '/account',
                    name: 'account',
                    component: () => import('../views/Account.vue'),
                },
                {
                    path: '/collection',
                    name: 'collection',
                    component: () => import('../views/Blog.vue'),
                },
            ],
        },
    ],
});

export default router;
