import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
	{
		name: 'Home',
		path: '/',
		component: () => import('@/views/Test.vue'),
		meta: { requiresAuth: true }  // Thêm meta tag này để kiểm tra authentication
	},
	{
		name: 'ItemDetail',
		path: '/product/:id',
		component: () => import('@/views/ItemDetail.vue'),
		meta: { requiresAuth: true }
	},
	{
		name: 'Login',
		path: '/login',
		component: () => import('@/views/Login.vue')
	},
	{
		name: 'ItemList',
		path: '/products',
		component: () => import('@/views/ItemList.vue'),
		meta: { requiresAuth: true }
	},
	{
		name: 'SignUp',
		path: '/signup',
		component: () => import('@/views/SignUp.vue')
	},
	{
		name: 'Cart',
		path: '/cart',
		component: () => import('@/views/Cart.vue'),
		meta: { requiresAuth: true }
	}
]

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		// Kiểm tra nếu route yêu cầu token
		if (!localStorage.getItem('token')) {
			next('/login');
		} else {
			// Nếu có token, tiếp tục như bình thường
			next();
		}
	} else {
		if (to.name === 'Login' && localStorage.getItem('token')) {
			next({name: 'Home'})
		} else {
			// Nếu route không yêu cầu authentication, tiếp tục như bình thường
			next();
		}
	}
});

export default router
