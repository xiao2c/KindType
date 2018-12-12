<template>
	<v-card>
		<v-card-title>
			Select An Instance to Start
			<v-spacer></v-spacer>
			<v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
		</v-card-title>
		<v-data-table :headers="headers" :items="instances" :search="search">
			<template slot="items" slot-scope="props">
					<tr :active="props.selected" @click="props.selected = !props.selected">
						<td>
							<v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
						</td>
						<td>{{ props.item.instance }}</td>
					</tr>
			</template>
			<v-alert slot="no-results" :value="true" color="error" icon="warning">
			Your search for "{{ search }}" found no results.
			</v-alert>
		</v-data-table>
		<v-toolbar dense>
			<v-spacer></v-spacer>
			<v-btn icon to="/SelectCat">
				<v-icon>send</v-icon>
			</v-btn>
		</v-toolbar>
	</v-card>
</template>

<script>
	import {
		BUS,
		session
	} from "@/main";
	
	export default {
		name: "Home",
		data() {
			return {
				pagination: {
					sortBy: 'instance'
				},
				selected: [],
				search: "",
				headers: [{
						text: 'Select',
						sortable: false
					},
					{
						text: 'Instance',
						align: 'center',
						value: 'instance'
					}
				],
				instances: [{
						value: false,
						instance: 'Frozen Yogurt'
					},
					{
						value: false,
						instance: 'Ice cream sandwich'
					},
					{
						value: false,
						instance: 'Eclair'
					},
					{
						value: false,
						instance: 'Cupcake'
					},
					{
						value: false,
						instance: 'Gingerbread'
					},
					{
						value: false,
						instance: 'Jelly bean'
					},
					{
						value: false,
						instance: 'Lollipop'
					},
					{
						value: false,
						instance: 'Honeycomb'
					},
					{
						value: false,
						instance: 'Donut'
					},
					{
						value: false,
						instance: 'KitKat'
					}
				]
			};
		},
		mounted() {
			session.pageTitle = "Home";
			BUS.$emit('updateSession');
		}
	};
</script>
