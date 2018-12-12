<template>
	<div id="app">
		<vue-headful :title="title" />
		<HeaderBar/>
		<router-view/>
	</div>
</template>

<script>
	import HeaderBar from '@/components/HeaderBar'
	import {BUS, session} from '@/main'
	
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
			BUS.$on('updateSession', () => {
				this.title = session.pageTitle;
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
