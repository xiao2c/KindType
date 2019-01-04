<template>
	<v-app id="app">
		<vue-headful :title="title"/>
		<HeaderBar/>
		<keep-alive>
			<router-view/>
		</keep-alive>
	</v-app>
</template>

<script>
import HeaderBar from "@/components/HeaderBar";
import { BUS } from "@/main";

export default {
	name: "App",
	components: {
		HeaderBar
	},
	data() {
		return {
			title: "App"
		};
	},
	created() {
		BUS.$on("sessionChanged", () => {
			this.title = BUS.session.ui.pageTitle;
		});
	}
};
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
