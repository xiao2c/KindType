<template>
	<v-layout row justify-center>
		<v-dialog v-model="dialog" persistent max-width="1280px">
			<v-card>
				<v-card-title>
					<span class="title">KindType Feature List</span>
				</v-card-title>
				<v-card-text v-if="initData">
					<table width="100%" class="mytable">
						<thead>
							<tr>
								<td width="75%" class="myheader body-2">{{ initData.name }}</td>
								<td width="25%" class="myheader body-2">Instance(s)</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{{ initData.description }}</td>
								<td>{{ initData.instances?initData.instances.join(", "):"" }}</td>
							</tr>
						</tbody>
					</table>
					<br>&nbsp;
					<table width="100%" class="mytable">
						<thead>
							<tr>
								<td width="33%" class="myheader body-2">Feature</td>
								<td width="33%" class="myheader body-2">Feature Values</td>
								<td width="33%" class="myheader body-2">Explanation</td>
							</tr>
						</thead>
						<tbody>
							<template v-for="(f, i) in initData.feature_types">
								<tr :key="i">
									<td>{{ f.feature_name }}</td>
									<td>
										<template v-for="(v, j) in f.values">
											<div :key="j">
												<textarea rows="2" v-model="v.value"></textarea>
											</div>
										</template>
										<button @click="addFValue(f)">Add</button>
									</td>
									<td>{{ f.explain }}</td>
								</tr>
							</template>
						</tbody>
					</table>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn color="blue darken-1" flat @click="close">Close</v-btn>
					<v-btn color="blue darken-1" flat @click="save">Save</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-layout>
</template>

<script>
import { BUS } from "@/main";
// import Parse from "parse";

export default {
	props: {
		dialog: {
			default: false
		}
	},
	methods: {
		addFValue(f) {
			f.values.push({ value: "" });
			this.$forceUpdate();
		},
		close() {
			this.$emit("closeKtFeature", { name: "dummy" });
		},
		save() {
			// remove any empty value (added, but not filled)
			for (let i = 0; i < this.initData.feature_types.length; i++) {
				let values = this.initData.feature_types[i].values;
				for (let j = values.length - 1; j >= 0; --j) {
					if (values[j].value === "") {
						values.splice(j, 1);
					}
				}
			}
			this.$emit("saveKtFeature", this.initData);
		}
	},
	data() {
		return { initData: null };
	},
	created() {
		console.log(" dialog data: " + JSON.stringify(this.initData));
		BUS.$on("sessionChanged", () => {
			if (BUS.session.ui.ktDialogData) {
				this.initData = JSON.parse(JSON.stringify(BUS.session.ui.ktDialogData));
				if (this.initData.feature_types) {
					for (let i = 0; i < this.initData.feature_types.length; i++) {
						if (!this.initData.feature_types[i].values) {
							this.initData.feature_types[i].values = [];
						}
					}
				}
			}
		});
	}
};
</script>

<style scoped>
table.mytable {
	border-collapse: collapse;
}
td.myheader {
	border: 1px solid grey;
	background-color: #eeeeee;
	text-align: left;
	padding: 8px;
}
td {
	border: 1px solid grey;
	background-color: white;
	text-align: left;
	padding: 8px;
}
textarea {
	border: 1px solid grey;
	box-shadow: 0 0 2px grey;
	width: 100%;
}
button {
	border: 1px solid grey;
	padding: 3px;
	font-size: 0.8em;
}
</style>
