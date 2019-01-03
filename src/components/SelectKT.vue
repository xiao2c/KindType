<template>
	<div>
		<v-list two-line>
			<template v-for="(kt, i) in kindtypelist">
				<v-list-tile :key="i">
					<v-list-tile-content>
						<div class="kt-card">
							<div class="kt-set-middle">
								<v-chip color="light-blue lighten-3">
									<input
										type="checkbox"
										v-model="selectedKindType"
										:value="kt.name"
										@click="setSelected(kt.name, $event)"
									>&nbsp;
									<span>{{ kt.name }}</span>
								</v-chip>
							</div>
							<div class="kt-set">
								<span v-if="kt.parentname && kt.parentname !== ''">
									<v-icon @click="upClicked(kt)">arrow_drop_up</v-icon>
									<span class="parent-text">{{ kt.parentname }}</span>
								</span>
								<br>
								<span v-if="checkDownArraw(kt)">
									<v-icon @click="downClicked(kt)">arrow_drop_down</v-icon>
								</span>&nbsp;
							</div>
						</div>
					</v-list-tile-content>
				</v-list-tile>
			</template>
		</v-list>
		<v-toolbar dense>
			<span v-if="selectedKindType.length > 0">Selected KindType: {{ selectedKindType[0] }}</span>
			<v-spacer></v-spacer>
			<v-btn dark color="blue">Attach To KindType</v-btn>
			<v-btn dark color="blue">Create New KindType</v-btn>
			<v-btn dark color="blue">Back to Categories</v-btn>
		</v-toolbar>
	</div>
</template>

<script>
import { BUS } from "@/main";
import axios from "axios";

const ax = axios.create({
	baseURL: "http://localhost:1337/parse/",
	timeout: 8000,
	headers: {
		"X-Parse-Application-Id": "myapp",
		"X-Parse-Master-Key": "mymasterkey",
		"Content-Type": "application/json"
	}
});

export default {
	name: "SelectKT",
	methods: {
		setSelected(ktname, e) {
			if (e.target.checked) {
				this.selectedKindType = [ktname];
			}
		},
		checkDownArraw(kt) {
			if (kt.children !== null && kt.children.length > 0) {
				return true;
			}
			return false;
		},
		async upClicked(kt) {
			var ktindex = this.kindtypelist.indexOf(kt);
			var removelist = [];

			for (let i = 0; i < this.kindtypelist.length; i++) {
				let parentlist = [];
				parentlist.push(this.kindtypelist[i].parentname);
				var parentkt = this.getKtByName(this.kindtypelist[i].parentname);
				while (parentkt.parentname && parentkt.parentname !== "") {
					parentlist.push(parentkt.parentname);
					parentkt = this.getKtByName(parentkt.parentname);
				}
				// check if this kt should be removed from display
				if (parentlist.indexOf(kt.parentname) >= 0) {
					removelist.push(this.kindtypelist[i]);
				}
			}

			// insert the parent
			this.kindtypelist.splice(ktindex, 0, this.getKtByName(kt.parentname));

			// console.log("removelist = " + JSON.stringify(removelist));
			// console.log("kindtypelist = " + JSON.stringify(this.kindtypelist));
			for (let i = 0; i < removelist.length; i++) {
				let index = this.kindtypelist.indexOf(removelist[i]);
				if (index >= 0) {
					this.kindtypelist.splice(index, 1);
				}
			}
		},
		downClicked(kt) {
			// remove this kt from display
			let index = -1;
			for (let i = 0; i < this.kindtypelist.length; i++) {
				if (this.kindtypelist[i].name === kt.name) {
					index = i;
					break;
				}
			}

			// insert children
			let c = 0;
			for (let j = 0; j < this.allSubKts.length; j++) {
				let child = this.allSubKts[j];
				if (child.parentname === kt.name) {
					this.kindtypelist.splice(index, 0, child);
					c++;
				}
			}
			this.kindtypelist.splice(index + c, 1);
		},
		appendSubKts(kt, parentname) {
			kt.parentname = parentname;
			this.allSubKts.push(kt);
			// now cascade to children
			for (let i = 0; i < kt.children.length; i++) {
				let childname = kt.children[i];

				ax.get("classes/kindtype", {
					params: {
						where: '{"name":"' + childname + '"}',
						limit: 10000
					}
				})
					.then(response => {
						let list = response.data.results;
						if (list && list.length > 0) {
							this.appendSubKts(list[0], kt.name);
						}
					})
					.catch(function(error) {
						console.log(error);
					});
			}
			// console.log("this.allSubKts = " + JSON.stringify(this.allSubKts));
		},
		getKtByName(ktname) {
			for (let i = 0; i < this.allSubKts.length; i++) {
				if (this.allSubKts[i].name === ktname) {
					return this.allSubKts[i];
				}
			}
			return "";
		}
	},
	data() {
		return {
			kindtypelist: [], // Kindtypes that displayed on the page.
			selectedKindType: [], // The selected kindtype where this instance should attach to.
			allSubKts: [] // All kindtypes and their children kindtypes under current categories.
		};
	},
	created() {
		BUS.session.barKtButton = false;
		this.kindtypelist = JSON.parse(
			JSON.stringify(BUS.session.currentKindTypes)
		); // Not sure why
		BUS.updateSession();

		// load allSubKts
		for (let i = 0; i < this.kindtypelist.length; i++) {
			this.appendSubKts(this.kindtypelist[i], "");
		}
	}
};
</script>

<style scoped>
.kt-card {
	text-align: left;
	width: 100%;
}

.kt-set-middle {
	display: inline-block;
	top: 50%;
	transform: translateY(-35%);
	-ms-transform: translateY(-35%);
	-moz-transform: translateY(-35%);
	-webkit-transform: translateY(-35%);
	-o-transform: translateY(-35%);
}

.kt-set {
	display: inline-block;
}

.parent-text {
	font-size: 0.8em;
}
</style>
