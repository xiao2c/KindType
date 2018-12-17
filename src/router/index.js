import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Test from '@/components/Test'
import SelectCat from '@/components/SelectCat'
import SelectKT from '@/components/SelectKT'

Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/Test',
			name: 'Test',
			component: Test
		},
		{
			path: '/SelectCat',
			name: 'SelectCat',
			component: SelectCat
		},
		{
			path: '/SelectKT',
			name: 'SelectKT',
			component: SelectKT
		}
	]
})
