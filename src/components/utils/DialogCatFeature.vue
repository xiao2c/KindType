<template>
	<v-layout row justify-center>
		<v-dialog v-model="dialog" persistent max-width="1280px">
			<v-card>
				<v-card-title>
					<span class="title">Feature List</span>
				</v-card-title>
				<v-card-text v-if="initData">
					<table width="100%" class="mytable">
						<thead>
							<tr>
								<td width="75%" class="myheader body-2">{{ initData.name }}</td>
								<td width="25%" class="myheader body-2">Example Instance(s)</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>{{ initData.description }}</td>
								<td>{{ initData.example_instances?initData.example_instances.join(", "):"" }}</td>
							</tr>
						</tbody>
					</table>
					<br>&nbsp;
					<table width="100%" class="mytable">
						<thead>
							<tr>
								<td width="33%" class="myheader body-2">Feature</td>
								<td width="33%" class="myheader body-2">Feature Value</td>
								<td width="33%" class="myheader body-2">Explanation</td>
							</tr>
						</thead>
						<tbody>
							<template v-for="(f, i) in initData.feature_types">
								<tr :key="i">
									<td>{{ f.feature_name }}</td>
									<td>
										<v-text-field v-model="f.value"></v-text-field>
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
		close() {
			this.$emit("closeCatFeature", { name: "dummy" });
		},
		save() {
			this.$emit("saveCatFeature", this.initData);
		}
	},
	data() {
		return { initData: null };
	},
	created() {
		console.log(" dialog data: " + JSON.stringify(this.initData));
		BUS.$on("sessionChanged", () => {
			if (BUS.session.ui.catDialogData) {
				this.initData = JSON.parse(
					JSON.stringify(BUS.session.ui.catDialogData)
				);
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
</style>
