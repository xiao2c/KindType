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
		<DialogCatFeature
			:dialog.sync="dialogCatVisible"
			@closeCatFeature="closeCatDetail"
			@saveCatFeature="saveCatDetail"
		/>
	</div>
</template>

<script>
import { BUS } from "@/main";
import Router from "@/router/index";
import Parse from "parse";
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
			// check if category data already in the BUS
			let catList = JSON.parse(
				JSON.stringify(BUS.session.data.instanceCatObjs)
			);
			let found = false;
			var categoryData = null;
			for (let i = 0; i < catList.length && !found; i++) {
				if (catList[i].name === cat) {
					categoryData = catList[i];
					found = true;
				}
			}
			if (!found) {
				// call parse api to get category data
				let query = new Parse.Query("category");
				query.equalTo("name", cat);
				query.find().then(results => {
					if (results && results[0]) {
						BUS.session.ui.catDialogData = results[0];
						BUS.session.data.instanceCatObjs.push(results[0]);
						BUS.updateSession();
						this.dialogCatVisible = true;
					}
				});
			} else {
				BUS.session.ui.catDialogData = categoryData;
				BUS.updateSession();
				this.dialogCatVisible = true;
			}
		},
		closeCatDetail(data) {
			this.dialogCatVisible = false;
		},
		saveCatDetail(data) {
			this.dialogCatVisible = false;

			// replace old category data with the new modified category data
			let objList = JSON.parse(
				JSON.stringify(BUS.session.data.instanceCatObjs)
			);
			for (let i = 0; i < objList.length; i++) {
				if (objList[i].name === data.name) {
					objList.splice(i, 1, data);
					break;
				}
			}
			BUS.session.data.instanceCatObjs = objList;
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
			this.barHeader = BUS.session.ui.pageTitle;
			this.categories = BUS.session.data.categories;
			this.showKtButton = BUS.session.ui.barKtButton;

			// sync cat object list with categories names, only remove, do not add
			let objList = JSON.parse(
				JSON.stringify(BUS.session.data.instanceCatObjs)
			);
			let removeList = [];
			for (let i = 0; i < objList.length; i++) {
				if (this.categories.indexOf(objList[i].name) < 0) {
					removeList.push(objList[i]);
				}
			}
			for (let i = 0; i < removeList.length; i++) {
				objList.splice(objList.indexOf(removeList[i]), 1);
			}
			BUS.session.data.instanceCatObjs = objList;
		});
	}
};
</script>

<style scoped>
.cat-array {
	font-weight: bold;
}
</style>
