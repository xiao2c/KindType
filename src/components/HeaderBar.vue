<template>
	<v-toolbar dense>
		<router-link to="/"><v-icon>home</v-icon></router-link>
	
		<v-toolbar-title>{{barHeader}}</v-toolbar-title>
	
		<v-spacer></v-spacer>
	
		<span>{{info}}</span>
	</v-toolbar>
</template>

<script>
import {BUS, session} from '@/main'

	export default {
		name: "HeaderBar",
		data() {
			return {
				title: 'this is headerbar',
				barHeader: 'default',
				info: ''
			}
		},
		created () {
			BUS.$on('updateSession', () => {
				this.barHeader = session.pageTitle;
				this.info = session.barInfo;
			});
		}
	}
</script>
