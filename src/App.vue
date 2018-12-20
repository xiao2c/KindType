<template>
	<div id="app">
		<vue-headful :title="title" />
		<HeaderBar/>
		<router-view/>
	</div>
</template>

<script>
	import HeaderBar from '@/components/HeaderBar'
	import {BUS} from '@/main'
	
	export default {
		name: "App",
		components: {
			HeaderBar
		},
		data () {
			return {
				title: 'App'
			}
		},
		created () {
			BUS.$on('sessionChanged', () => {
				this.title = BUS.session.pageTitle;
			});
		}
	}
</script>

<style>
	#app {
		font-family: "Avenir", Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}
</style>
