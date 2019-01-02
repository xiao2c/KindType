<template>
	<v-list two-line>
		<template v-for="(catset, i) in catsetlist">
			<v-list-tile :key="i">
				<v-list-tile-content>
					<div class="cat-card">
						<div class="cat-set-middle">
							<template v-for="(cat, index) in catset.catlist">
								<v-chip :key="index" label outline color="blue">
									<input
										type="checkbox"
										v-model="selectedCats"
										:value="cat.name"
										@change="boxChanged(cat.name, $event, false)"
									>&nbsp;
									<span>{{ cat.name }}</span>
								</v-chip>
							</template>
						</div>
						<div class="cat-set">
							<span v-if="catset.parent !== ''">
								<v-icon @click="upClicked(catset.parent)">arrow_drop_up</v-icon>
								<span class="parent-text">{{ catset.parent }}</span>
							</span>
							<br>
							<span v-if="checkDownArraw(catset)">
								<v-icon @click="downClicked(catset)">arrow_drop_down</v-icon>
							</span>&nbsp;
						</div>
					</div>
				</v-list-tile-content>
			</v-list-tile>
			<v-divider v-if="i + 1 < catsetlist.length" :key="`divider-${i}`"></v-divider>
		</template>
	</v-list>
</template>

<script>
import { BUS } from "@/main";
import axios from "axios";
import Parse from "parse";

const ax = axios.create({
	baseURL: "http://localhost:1337/parse/",
	timeout: 8000,
	headers: {
		"X-Parse-Application-Id": "myapp",
		"X-Parse-Master-Key": "mymasterkey",
		"Content-Type": "application/json"
	}
});

Parse.initialize("myapp", "", "mymasterkey");
// javascriptKey is required only if you have it on server.
Parse.serverURL = "http://localhost:1337/parse";

export default {
	name: "SelectCat",
	methods: {
		// This function is used for 2 senarios: 1. Click checkbox (use parameter: category, e). 2. Click down arrow (use parameter: category, simulate).
		boxChanged(category, e, simulate) {
			if ((e !== null && e.target.checked) || (e === null && simulate)) {
				// lookup the category in catsetlist
				var c = null;
				var cIndex = -1;
				var found = false;
				for (let i = 0; !found && i < this.catsetlist.length; i++) {
					let s = this.catsetlist[i];
					for (let j = 0; j < s.catlist.length; j++) {
						let t = s.catlist[j];
						if (t.name === category) {
							found = true;
							c = t;
							cIndex = i;
							break;
						}
					}
				}

				// Check if any of the sibling category is already selected, if yes, remove from selectedCats
				let s = this.catsetlist[cIndex];
				for (let j = 0; j < s.catlist.length; j++) {
					let t = s.catlist[j];
					if (t.name === category) {
						continue;
					}
					// remove this sibling if in selectedCats
					let i = this.selectedCats.indexOf(t.name);
					if (i >= 0) {
						this.selectedCats.splice(i, 1);
					}
				}

				this.expandCatSet(category, c, cIndex);
			} else {
				// checkbox unchecked.
				// when it is uncheck, any child category in the selected list should be removed.
				var removelist = [];
				for (let i = 0; i < this.selectedCats.length; i++) {
					let parentlist = this.getAllParents(this.selectedCats[i]);
					if (parentlist !== null && parentlist.indexOf(category) >= 0) {
						removelist.push(this.selectedCats[i]);
					}
				}
				// let flatchildlist = [].concat.apply([], childlists);
				for (let i = 0; i < removelist.length; i++) {
					let index = this.selectedCats.indexOf(removelist[i]);
					if (index >= 0) {
						this.selectedCats.splice(index, 1);
					}
				}
			}

			this.checkKindType(this.selectedCats);
		},
		getAllChild(category) {
			for (let i = 0; i < this.allCategories.length; i++) {
				if (this.allCategories[i].name === category) {
					return this.allCategories[i].children;
				}
			}
			return null;
		},
		checkDownArraw(categorySet) {
			for (let i = 0; i < categorySet.catlist.length; i++) {
				if (this.selectedCats.indexOf(categorySet.catlist[i].name) >= 0) {
					if (
						categorySet.catlist[i].children !== null &&
						categorySet.catlist[i].children.length > 0
					) {
						return true;
					} else {
						return false;
					}
				}
			}
			return false;
		},
		async upClicked(category) {
			// category is the parent category to go to.
			// loop through catsetlist to check which need to go up together with this category set. remove it from catsetlist.
			var removelist = [];
			for (let i = 0; i < this.catsetlist.length; i++) {
				let s = this.catsetlist[i];
				// console.log(" check all parents of " + s.parent);
				let allp = this.getAllParents(s.parent);
				if (allp.indexOf(category) >= 0) {
					removelist.push(s);
				}
			}
			// removing
			// console.log(" Removing list = " + JSON.stringify(removelist));
			for (let i = 0; i < removelist.length; i++) {
				let index = this.catsetlist.indexOf(removelist[i]);
				this.catsetlist.splice(index, 1);
			}
			// add the selected parent category set
			var parent = this.getDirectParentObj(category);
			if (parent !== null) {
				// get siblings of the same set
				var newset = null;
				for (let i = 0; i < parent.children.length; i++) {
					if (parent.children[i].indexOf(category) >= 0) {
						let catSet = parent.children[i];
						let whereStr = JSON.stringify({
							name: {
								$in: catSet
							}
						});
						// call api to get category detail
						newset = await this.syncRequest(category, whereStr);
					}
				}
				if (newset !== null) {
					this.catsetlist.push(newset);
				}
			} else {
				// this must be ENTITY
				ax.get("classes/category", {
					params: {
						where: '{"name":"ENTITY"}',
						limit: 10000
					}
				})
					.then(response => {
						this.catsetlist = [
							{
								parent: "",
								catlist: response.data.results
							}
						];
					})
					.catch(function(error) {
						console.log(error);
					});
			}
		},
		downClicked(categorySet) {
			// console.log(" downClicked, cat set = " + JSON.stringify(categorySet));
			// Find which category in the set is currently checked.
			var checkedCat = null;
			for (let i = 0; i < categorySet.catlist.length; i++) {
				if (this.selectedCats.indexOf(categorySet.catlist[i].name) >= 0) {
					checkedCat = categorySet.catlist[i];
					break;
				}
			}

			// click down arrow is equivalent to check the category. So call the checkbox checked to continue.
			this.boxChanged(checkedCat.name, null, true);
		},
		async expandCatSet(category, c, cIndex) {
			if (c != null) {
				if (c.children !== null && c.children.length > 0) {
					// console.log("FOUND: " + JSON.stringify(c));
					let newsetList = [];
					for (let i = 0; i < c.children.length; i++) {
						let catSet = c.children[i];
						let whereStr = JSON.stringify({
							name: {
								$in: catSet
							}
						});
						// call api to get category detail
						let newset = await this.syncRequest(category, whereStr);
						newsetList.push(newset);
					}
					// console.log(cIndex + " newsetList = " + JSON.stringify(newsetList));
					for (var i = 0; i < newsetList.length; i++) {
						this.catsetlist.splice(cIndex, 0, newsetList[i]);
					}
					this.catsetlist.splice(cIndex + i, 1);
					// console.log("new set list : " + JSON.stringify(this.catsetlist));
					// this.$forceUpdate();
				}
			}
		},
		syncRequest(category, whereStr) {
			return ax
				.get("classes/category", {
					params: {
						where: whereStr,
						limit: 10000
					}
				})
				.then(response => {
					let newset = {
						parent: category,
						catlist: response.data.results
					};
					// console.log("newset : " + JSON.stringify(newset));
					return newset;
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		getAllParents(category) {
			var parentlist = [category];
			let cat = this.getDirectParent(category);
			while (cat !== "") {
				parentlist.push(cat);
				cat = this.getDirectParent(cat);
			}

			return parentlist;
		},
		getDirectParent(category) {
			if (category === null || category === "") {
				return "";
			}
			// get the category set who's children contains this category.
			for (let i = 0; i < this.allCategories.length; i++) {
				let cat = this.allCategories[i];
				let childrenlist = cat.children;
				for (let j = 0; j < childrenlist.length; j++) {
					// console.log(" childrenlist[j] = " + childrenlist[j] + " ; current cat  = " + JSON.stringify(cat));
					if (childrenlist[j].indexOf(category) >= 0) {
						return cat.name;
					}
				}
			}
			return "";
		},
		getDirectParentObj(category) {
			if (category === null || category === "") {
				return null;
			}
			// get the category set who's children contains this category.
			for (let i = 0; i < this.allCategories.length; i++) {
				let cat = this.allCategories[i];
				let childlist = cat.children;
				for (let j = 0; j < childlist.length; j++) {
					if (childlist[j].indexOf(category) >= 0) {
						return cat;
					}
				}
			}
			return null;
		},
		checkKindType(selectedList) {
			console.log(
				"called checkkindtype: list = " + JSON.stringify(selectedList)
			);

			BUS.session.barInfo =
				"Selected Categorie(s): " + this.selectedCats.join(", ");
			BUS.session.barKtButton = false;
			BUS.updateSession();

			var query1 = new Parse.Query("kindtype");
			query1.containsAll("parents", selectedList);
			// query.containedIn("parents", ["INDIVIDUAL", "ENTITY", "SELFMOVING", "NONSTATIONARY", "PHYSICAL", "REAL", "LIVING", "NATURAL"]);
			var query2 = new Parse.Query("kindtype");
			query2.containedBy("parents", selectedList);
			var query = new Parse.Query.and(query1, query2).limit(10000);
			query.find().then(results => {
				// console.log(" Parse SDK test: " + JSON.stringify(results));
				if (results !== null && results.length > 0) {
					console.log(
						" check kindtype find " +
							results.length +
							" kindtypes. " +
							JSON.stringify(results)
					);
					this.kindtypelist = results;
					BUS.session.barInfo =
						"Selected Categorie(s): " +
						this.selectedCats.join(", ") +
						". Terminal Cut Reached";
					BUS.session.barKtButton = true;
					BUS.session.currentKindTypes = results;
					BUS.updateSession();
				}
			});
		}
	},
	data() {
		return {
			kindtypelist: [], // kindtypes find under current selected categories
			selectedCats: [], // list of user selected categories
			catsetlist: [], // category sets that displayed on the page
			allCategories: [] // an index list of all category names and children
		};
	},
	created() {
		BUS.session.pageTitle = "Instance: " + BUS.session.currentInstance;
		BUS.updateSession();

		// Get the default start category ENTITY
		ax.get("classes/category", {
			params: {
				where: '{"name":"ENTITY"}',
				limit: 10000
			}
		})
			.then(response => {
				this.catsetlist = [
					{
						parent: "",
						catlist: response.data.results
					}
				];
			})
			.catch(function(error) {
				console.log(error);
			});

		// Get all category name plus children
		ax.get("classes/category", {
			params: {
				keys: "name,children",
				limit: 10000
			}
		})
			.then(response => {
				this.allCategories = response.data.results;
				// console.log("allCategories : " + JSON.stringify(this.allCategories));
			})
			.catch(function(error) {
				console.log(error);
			});
	}
};
</script>

<style scoped>
.cat-card {
	text-align: left;
	width: 100%;
}

.cat-set-middle {
	display: inline-block;
	top: 50%;
	transform: translateY(-35%);
	-ms-transform: translateY(-35%);
	-moz-transform: translateY(-35%);
	-webkit-transform: translateY(-35%);
	-o-transform: translateY(-35%);
}

.cat-set {
	display: inline-block;
}

.parent-text {
	font-size: 0.8em;
}
</style>
