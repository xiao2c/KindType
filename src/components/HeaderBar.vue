<template>
	<div>
		<v-toolbar dense>
			<v-icon @click="toHome">home</v-icon>
			<v-toolbar-title>{{barHeader}}</v-toolbar-title>
			<v-spacer></v-spacer>
			<span class="cat-array">Selected Categorie(s):</span>
			<span>
				<template v-for="(cat, i) in categories">
					<v-chip :key="i" color="light-green lighten-3" @click="showCatDetail(cat)">
						<span style="cursor:pointer">{{ cat }}</span>
					</v-chip>
				</template>
			</span>
			<v-btn dark color="blue" to="/SelectKT" v-if="showKtButton">Show Kind Types</v-btn>
		</v-toolbar>
		<DialogCatFeature :dialog.sync="dialogCatVisible" @closeCatFeature="closeCatDetail"/>
	</div>
</template>

<script>
import { BUS } from "@/main";
import Router from "@/router/index";
import DialogCatFeature from "@/components/utils/DialogCatFeature.vue";

export default {
	name: "HeaderBar",
	components: {
		DialogCatFeature
	},
	methods: {
		toHome() {
			Router.push("/");
		},
		showCatDetail(cat) {
			console.log("showCatDetail " + cat);
			this.dialogCatVisible = true;
		},
		closeCatDetail(data) {
			console.log(
				"closeCatDetail " +
					this.dialogCatVisible +
					"; data = " +
					JSON.stringify(data)
			);
			this.dialogCatVisible = false;
		}
	},
	data() {
		return {
			title: "this is headerbar",
			barHeader: "",
			categories: [],
			showKtButton: false,
			dialogCatVisible: false
		};
	},
	created() {
		BUS.$on("sessionChanged", () => {
			this.barHeader = BUS.session.pageTitle;
			this.categories = BUS.session.categories;
			this.showKtButton = BUS.session.barKtButton;
		});
	}
};
</script>

<style scoped>
.cat-array {
	font-weight: bold;
}
</style>
